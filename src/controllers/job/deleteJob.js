import prisma from '../../config/db.js'

export const deleteJob = async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id)

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      })
    }

    // Only the recruiter who posted the job can delete it
    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this job'
      })
    }

    await prisma.job.delete({
      where: { id: jobId }
    })

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    })

  } catch (err) {
    console.error('Delete job error:', err)
    next(err)
  }
}
