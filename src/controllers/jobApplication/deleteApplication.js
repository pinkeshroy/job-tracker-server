import prisma from '../../config/db.js'

export const deleteApplication = async (req, res, next) => {
  try {
    const applicationId = parseInt(req.params.applicationId, 10)
    const userId = req.user.id

    // 1. Validate ID
    if (isNaN(applicationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID'
      })
    }

    // 2. Fetch application
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId }
    })

    // 3. Handle not found
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // 4. Ownership check
    if (application.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this application'
      })
    }

    // 5. Delete it
    await prisma.jobApplication.delete({
      where: { id: applicationId }
    })

    // 6. Respond
    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    })
  } catch (err) {
    console.error('Error deleting application:', err)
    next(err)
  }
}
