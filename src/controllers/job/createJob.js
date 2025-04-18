import prisma from '../../config/db.js'
import { validateJob } from '../../utils/validator/jobValidator.js'

export const createJob = async (req, res, next) => {
  try {
    const { error } = validateJob(req.body)
    if (error) {
      return res.status(422).json({
        success: false,
        error: error.details[0].message
      })
    }

    const { title, company, description, location, salaryRange } = req.body
    const recruiterId = req.user.id

    const job = await prisma.job.create({
      data: {
        title,
        company,
        description,
        location,
        salaryRange,
        recruiterId
      },
      select: {
        id: true,
        title: true,
        company: true,
        status: true,
        location: true,
        salaryRange: true,
        createdAt: true,
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    })
  } catch (err) {
    console.error('Create job error:', err)
    next(err)
  }
}
