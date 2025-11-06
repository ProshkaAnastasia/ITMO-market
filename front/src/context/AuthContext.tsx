import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginRequest, RegisterRequest, AuthUser, TokenResponse } from '../types/dto';
import { authApi } from '../api/authApi';
import { usersApi } from '../api/usersApi'; // Нужно создать!

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
            const token = localStorage.getItem('accessToken');

            if (token) {
                // Если есть токен, загружаем данные пользователя
                fetchUserData();
            } else {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const fetchUserData = async () => {
        try {
            // ГЛАВНОЕ ИСПРАВЛЕНИЕ: загружаем данные пользователя с backend'а
            const userData = await usersApi.getMe();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setError(null);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            // Если не удалось загрузить - очищаем токены
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const tokenResponse: TokenResponse = await authApi.login(credentials);

            // Сохраняем токены
            localStorage.setItem('accessToken', tokenResponse.accessToken);
            localStorage.setItem('refreshToken', tokenResponse.refreshToken);

            // ИСПРАВЛЕНИЕ: загружаем данные пользователя ПОСЛЕ логина
            await fetchUserData();

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

            // ИСПРАВЛЕНИЕ: загружаем данные пользователя ПОСЛЕ регистрации
            await fetchUserData();

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

    // ИСПРАВЛЕНИЕ: isAuthenticated зависит от токена И наличия user
    const isAuthenticated = !!localStorage.getItem('accessToken') && !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
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