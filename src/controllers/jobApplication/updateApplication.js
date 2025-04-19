import prisma from '../../config/db.js';
import {
  validateUserUpdateApplication,
  validateRecruiterUpdateApplication
} from '../../utils/validator/jobApplicationValidator.js';

export const updateApplication = async (req, res, next) => {
  try {
    const applicationId = parseInt(req.params.applicationId, 10);
    if (isNaN(applicationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID',
      });
    }

    const existingApp = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!existingApp) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // If recruiter -> allow only status update
    if (req.user.role === 'RECRUITER') {
      const { error, value } = validateRecruiterUpdateApplication.validate(req.body);
      if (error) {
        return res.status(422).json({
          success: false,
          message: 'Validation failed',
          error: error.details[0].message,
        });
      }

      // Ensure recruiter owns the job
      if (existingApp.job.recruiterId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You do not own this job',
        });
      }

      const updated = await prisma.jobApplication.update({
        where: { id: applicationId },
        data: value,
      });

      return res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: updated,
      });
    }

    // If regular user -> allow only coverLetter and resumeUrl
    if (req.user.id !== existingApp.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this application',
      });
    }

    const { error, value } = validateUserUpdateApplication.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        error: error.details[0].message,
      });
    }

    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: value,
    });

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updated,
    });

  } catch (err) {
    console.error('Update application error:', err);
    next(err);
  }
};
