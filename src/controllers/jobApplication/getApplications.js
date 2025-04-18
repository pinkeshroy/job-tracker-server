import prisma from '../../config/db.js'
import { validateGetApplications } from '../../utils/validator/jobApplicationValidator.js'

export const getApplications = async (req, res, next) => {
  try {
    // Validate incoming query params
    const { error, value } = validateGetApplications.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        error: error.details[0].message
      });
    }

    const { page, limit, status, sortBy, order } = value;
    const userId = req.user.id;

    const filters = {
      userId,
      ...(status && { status })
    };

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where: filters,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              salaryRange: true,
              status: true
            }
          }
        }
      }),
      prisma.jobApplication.count({ where: filters })
    ]);

    res.status(200).json({
      success: true,
      message: 'Applications fetched successfully',
      data: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching applications:', err);
    next(err);
  }
};
