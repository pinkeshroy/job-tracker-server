import prisma from '../../config/db.js'
import { validateUserUpdateApplication } from '../../utils/validator/jobApplicationValidator.js'

export const updateApplication = async (req, res, next) => {
  try {
    const applicationId = parseInt(req.params.applicationId)
    if (isNaN(applicationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID'
      })
    }

    // Validate request body
    const { error, value } = validateUserUpdateApplication.validate(req.body)
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        error: error.details[0].message
      })
    }

    const existingApp = await prisma.jobApplication.findUnique({
      where: { id: applicationId }
    })

    if (!existingApp) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    if (existingApp.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this application'
      })
    }

    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: value
    })

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updated
    })
  } catch (err) {
    console.error('Update application error:', err)
    next(err)
  }
}
