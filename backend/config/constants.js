// SLA Definitions (in hours)
const SLA_MAP = {
  critical: 2,
  high: 8,
  medium: 24,
  low: 48,
};

const TICKET_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const TICKET_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const USER_ROLE = {
  EMPLOYEE: 'Employee',
  SUPPORT: 'Support',
  ADMIN: 'Admin',
};

const TICKET_CATEGORY = [
  'Engineering',
  'Sales',
  'HR',
  'Finance',
  'Other',
];

module.exports = {
  SLA_MAP,
  TICKET_STATUS,
  TICKET_STATUS_VALUES: Object.values(TICKET_STATUS),
  TICKET_PRIORITY,
  TICKET_PRIORITY_VALUES: Object.values(TICKET_PRIORITY),
  USER_ROLE,
  USER_ROLE_VALUES: Object.values(USER_ROLE),
  TICKET_CATEGORY,
};
