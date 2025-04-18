import prisma from '../../config/db.js'
import { validateJobUpdate } from '../../utils/validator/jobValidator.js'

export const updateJob = async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id)

    // ✅ Partial validation
    const { error } = validateJobUpdate(req.body)
    if (error) {
      return res.status(422).json({
        success: false,
        error: error.details[0].message
      })
    }

    const existingJob = await prisma.job.findUnique({ where: { id: jobId } })

    if (!existingJob) {
      return res.status(404).json({ success: false, error: 'Job not found' })
    }

    if (existingJob.recruiterId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You are not authorized to update this job' })
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: req.body, // 👈 safe now because it's validated
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        location: true,
        salaryRange: true,
        status: true,
        updatedAt: true
      }
    })

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    })
  } catch (err) {
    console.error('Update job error:', err)
    next(err)
  }
}
