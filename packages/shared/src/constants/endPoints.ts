export const endPoints = {
  login: '/v1/auth/login',
  summary: '/v1/api/arrests/summary',
  profile: '/v1/api/users/profile',
  users: '/v1/api/users',
  logout: '/v1/auth/logout',
  refreshToken: '/v1/auth/refresh',
  resetPassword: '/v1/auth/reset-password',
  changePassword: '/v1/auth/change-password',
  isTokenValid: '/v1/auth/is-token-valid',
  media: '/v1/api/media',
  offence: '/v1/api/offence',
  notifications: '/v1/api/notificationlog',
  arrests: '/v1/api/arrests',
  draft: '/v1/api/arrests/draft',
  submitArrest: '/v1/api/arrests/submit',
  editArrest: '/v1/api/arrests/edit',
  readNotification: '/v1/api/notificationlog/read-notification-by-id'
};

export const apiMethods = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH'
};
