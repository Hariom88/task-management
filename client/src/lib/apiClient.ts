import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';

// In-memory token storage (more secure than localStorage for access tokens)
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Token management functions
export const tokenManager = {
    getAccessToken: () => accessToken,
    setAccessToken: (token: string | null) => {
        accessToken = token;
    },
    getRefreshToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
        }
        return refreshToken;
    },
    setRefreshToken: (token: string | null) => {
        refreshToken = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY, token);
            } else {
                localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
            }
        }
    },
    clearTokens: () => {
        accessToken = null;
        refreshToken = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
        }
    },
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor to add access token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const storedRefreshToken = tokenManager.getRefreshToken();

            if (!storedRefreshToken) {
                // No refresh token available, redirect to login
                tokenManager.clearTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh the token
                const response = await axios.post(
                    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`,
                    {
                        refreshToken: storedRefreshToken,
                    }
                );

                const { accessToken: newAccessToken } = response.data;
                tokenManager.setAccessToken(newAccessToken);

                // Process queued requests
                processQueue(null, newAccessToken);

                // Retry original request
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                processQueue(refreshError as Error, null);
                tokenManager.clearTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
