export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api/v1',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  }
};