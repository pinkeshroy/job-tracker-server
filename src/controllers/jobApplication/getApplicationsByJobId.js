import prisma from '../../config/db.js';
import { validateJobApplicationsQuery } from '../../utils/validator/jobApplicationValidator.js';

export const getApplicationsByJobId = async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.jobId, 10);
    if (isNaN(jobId)) {
      return res.status(400).json({ success: false, error: 'Invalid job ID' });
    }

    const { error } = validateJobApplicationsQuery(req.query);
    if (error) {
      return res.status(422).json({ success: false, error: error.details[0].message });
    }

    const {
      status,
      sortBy = 'appliedAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const skip = (page - 1) * limit;

    const whereClause = {
      jobId,
      ...(status && { status })
    };

    const [applications, totalCount] = await Promise.all([
      prisma.jobApplication.findMany({
        where: whereClause,
        orderBy: { [sortBy]: order },
        skip,
        take: parseInt(limit, 10),
        select: {
          id: true,
          status: true,
          appliedAt: true,
          updatedAt: true,
          coverLetter: true,
          resumeUrl: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.jobApplication.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: applications,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: parseInt(page, 10),
        perPage: parseInt(limit, 10)
      }
    });
  } catch (err) {
    console.error('Error fetching applications:', err);
    next(err);
  }
};
