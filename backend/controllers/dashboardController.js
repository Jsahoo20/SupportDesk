const Ticket = require('../models/Ticket');

const getStats = async (req, res) => {
  const activeTicketQuery = { isDeleted: false };
  const [
    stats,
    deptBreakdown,
    totalTickets,
    resolvedTickets,
    slaBreaches,
    avgResolutionTime,
  ] = await Promise.all([
    Ticket.aggregate([
      { $match: activeTicketQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Ticket.aggregate([
      { $match: activeTicketQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Ticket.countDocuments(activeTicketQuery),
    Ticket.countDocuments({ ...activeTicketQuery, status: 'Resolved' }),
    Ticket.countDocuments({ ...activeTicketQuery, slaBreached: true }),
    Ticket.aggregate([
      { $match: { ...activeTicketQuery, resolvedAt: { $exists: true, $ne: null } } },
      { $project: { resolutionTime: { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000] } } },
      { $group: { _id: null, avgHours: { $avg: '$resolutionTime' } } },
    ]),
  ]);

  const slaCompliance = totalTickets
    ? (((totalTickets - slaBreaches) / totalTickets) * 100).toFixed(2)
    : 0;

  res.json({
    success: true,
    message: 'Stats retrieved',
    data: {
      totalTickets,
      resolvedTickets,
      slaBreaches,
      slaCompliance: `${slaCompliance}%`,
      avgResolutionHours: avgResolutionTime[0]?.avgHours?.toFixed(2) || 'N/A',
      statusBreakdown: stats,
      deptBreakdown,
    },
  });
};

module.exports = { getStats };
