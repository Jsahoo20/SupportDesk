export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    USERS: '/auth/users',
    UPDATE_ROLE: (id) => `/auth/users/${id}`,
  },
  TICKETS: {
    BASE: '/tickets',
    BY_ID: (id) => `/tickets/${id}`,
    ASSIGN: (id) => `/tickets/${id}/assign`,
    STATUS: (id) => `/tickets/${id}/status`,
  },
  COMMENTS: {
    BASE: '/comments',
    BY_TICKET: (ticketId) => `/comments/${ticketId}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
};
