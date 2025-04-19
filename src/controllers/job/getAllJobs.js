import prisma from '../../config/db.js';
import { validateJobQuery } from '../../utils/validator/jobValidator.js';

export const getAllJobs = async (req, res) => {
  const { error, value } = validateJobQuery(req.query);

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { page, limit, sortBy, order, status, title } = value;

  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const where = {};

  // Recruiter sees only their jobs
  if (user.role === 'RECRUITER') {
    where.recruiterId = user.id;
  }

  // Optional: Add filtering by status or title
  if (status) where.status = status;
  if (title) {
    where.title = {
      contains: title,
      mode: 'insensitive',
    };
  }

  const skip = (page - 1) * limit;

  try {
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          recruiter: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pageSize: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error('[GET /jobs] Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
