export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',

        // Tasks
        TASKS: '/tasks',
    },
    TOKEN_STORAGE_KEY: 'access_token',
    REFRESH_TOKEN_STORAGE_KEY: 'refresh_token',
};
