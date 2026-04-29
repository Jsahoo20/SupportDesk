const { SLA_MAP } = require('../config/constants');

/**
 * Calculate SLA deadline based on priority and current time
 * Excludes weekends (Sat, Sun)
 */
const calculateSLADeadline = (priority) => {
  let slaHours = SLA_MAP[priority] || 24;
  const now = new Date();
  let deadline = new Date(now);
  let hoursAdded = 0;

  // Skip weekends
  while (hoursAdded < slaHours) {
    deadline.setHours(deadline.getHours() + 1);
    const dayOfWeek = deadline.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      hoursAdded++;
    }
  }

  return deadline;
};

module.exports = calculateSLADeadline;
