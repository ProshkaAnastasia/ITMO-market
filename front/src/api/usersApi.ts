import axiosInstance from './axiosInstance';
import { AuthUser } from '../types/dto';

export const usersApi = {
    // Получить текущего пользователя
    getMe: async (): Promise<AuthUser> => {
        const response = await axiosInstance.get<AuthUser>('/users/me');
        return response.data;
    },

    // Получить пользователя по ID
    getUser: async (userId: string): Promise<AuthUser> => {
        const response = await axiosInstance.get<AuthUser>(`/users/${userId}`);
        return response.data;
    },

    // Обновить свой профиль
    updateProfile: async (data: {
        first_name?: string;
        last_name?: string;
        email?: string;
    }): Promise<AuthUser> => {
        const response = await axiosInstance.put<AuthUser>('/users/me', data);
        return response.data;
    },

    // Удалить профиль
    deleteProfile: async (): Promise<void> => {
        await axiosInstance.delete('/users/me');
    },

    // Получить пользователя по ID (только для админов)
    getUserById: async (id: string): Promise<AuthUser> => {
        const response = await axiosInstance.get<AuthUser>(`/users/${id}`);
        return response.data;
    },
};