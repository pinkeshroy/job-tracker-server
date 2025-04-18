import prisma from '../../config/db.js'

export const getApplicationStats = async (req, res, next) => {
  try {
    const userId = req.user.id

    const grouped = await prisma.jobApplication.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true }
    })

    const statusMap = {
      APPLIED: 0,
      INTERVIEW: 0,
      OFFERED: 0,
      REJECTED: 0,
      ON_HOLD: 0
    }

    grouped.forEach(entry => {
      statusMap[entry.status] = entry._count._all
    })

    res.status(200).json({
      success: true,
      message: 'Application stats fetched successfully',
      data: {
        total: Object.values(statusMap).reduce((a, b) => a + b, 0),
        ...statusMap
      }
    })
  } catch (err) {
    console.error('Error getting application stats:', err)
    next(err)
  }
}
