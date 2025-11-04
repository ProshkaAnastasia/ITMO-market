import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginRequest, RegisterRequest, AuthUser, TokenResponse } from '../types/dto';
import { authApi } from '../api/authApi';

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Инициализация при загрузке приложения
    useEffect(() => {
        const initAuth = () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');

            if (storedUser && token) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Failed to parse stored user', e);
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const tokenResponse: TokenResponse = await authApi.login(credentials);

            // Сохраняем токены
            localStorage.setItem('accessToken', tokenResponse.accessToken);
            localStorage.setItem('refreshToken', tokenResponse.refreshToken);

            // TODO: Получить данные пользователя после логина
            // Пока предполагаем, что backend вернет user info вместе с токенами
            // или нам нужен отдельный запрос GET /api/users для получения данных

            setLoading(false);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Ошибка при входе';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            const tokenResponse: TokenResponse = await authApi.register(data);

            localStorage.setItem('accessToken', tokenResponse.accessToken);
            localStorage.setItem('refreshToken', tokenResponse.refreshToken);

            setLoading(false);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Ошибка при регистрации';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user && !!localStorage.getItem('accessToken'),
                loading,
                error,
                login,
                register,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};