import apiClient, { tokenManager } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
} from '@/types';

class AuthService {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.LOGIN,
            credentials
        );

        const { accessToken, refreshToken, user } = response.data;

        // Store tokens
        tokenManager.setAccessToken(accessToken);
        tokenManager.setRefreshToken(refreshToken);

        return response.data;
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.REGISTER,
            userData
        );

        const { accessToken, refreshToken, user } = response.data;

        // Store tokens
        tokenManager.setAccessToken(accessToken);
        tokenManager.setRefreshToken(refreshToken);

        return response.data;
    }

    async logout(): Promise<void> {
        try {
            const refreshToken = tokenManager.getRefreshToken();
            
            // Call backend to revoke refresh token
            if (refreshToken) {
                await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT, {
                    refreshToken,
                });
            }
        } catch (error) {
            // Even if logout fails, clear tokens locally
            console.error('Logout error:', error);
        } finally {
            // Clear tokens
            tokenManager.clearTokens();

            // Redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    isAuthenticated(): boolean {
        return !!tokenManager.getRefreshToken();
    }

    getAccessToken(): string | null {
        return tokenManager.getAccessToken();
    }
}

export const authService = new AuthService();
