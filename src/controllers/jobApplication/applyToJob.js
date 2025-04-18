import prisma from '../../config/db.js';
import { validateJobApplication } from '../../utils/validator/jobApplicationValidator.js';

export const applyToJob = async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.jobId, 10);
    const userId = req.user.id;

    if (isNaN(jobId)) {
      return res.status(400).json({ success: false, error: 'Invalid job ID' });
    }

    const { error } = validateJobApplication(req.body);
    if (error) {
      return res.status(422).json({ success: false, error: error.details[0].message });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { status: true }
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    if (job.status !== 'OPEN') {
      return res.status(400).json({ success: false, error: 'Job is not open for applications' });
    }

    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        userId
      }
    });

    if (existingApplication) {
      return res.status(409).json({ success: false, error: 'You have already applied to this job' });
    }

    const newApplication = await prisma.jobApplication.create({
      data: {
        coverLetter: req.body.coverLetter,
        resumeUrl: req.body.resumeUrl,
        jobId,
        userId
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: newApplication
    });
  } catch (err) {
    console.error('Error applying to job:', err);
    next(err);
  }
};
