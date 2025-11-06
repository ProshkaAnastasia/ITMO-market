import axiosInstance from './axiosInstance';
import { LoginRequest, RegisterRequest, TokenResponse, AuthUser } from '../types/dto';

export const authApi = {
    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const response = await axiosInstance.post<TokenResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<TokenResponse> => {
        const response = await axiosInstance.post<TokenResponse>('/auth/register', data);
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
        const response = await axiosInstance.post<TokenResponse>('/auth/refresh_token', {
            refreshToken,
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
};