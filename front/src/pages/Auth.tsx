import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../context/AuthContext';
import escapeHtml from '../api/escapeHtml';
import { LoginRequest, RegisterRequest } from '../types/dto';

const usernameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9]{0,32}$/;
const passwordRegex = /^.{0,72}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Auth: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register, error, loading, clearError } = useAuth();

    const mode = location.pathname === '/register' ? 'register' : 'login';

    // Общие поля
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    // Только для регистрации
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    // Локальная ошибка валидации
    const [localError, setLocalError] = useState<string | null>(null);

    const validateLoginFinal = (value: string) => /^[a-zA-Zа-яА-ЯёЁ0-9]{4,32}$/.test(value);
    const validatePasswordFinal = (value: string) =>
        value.length >= 8 && value.length <= 72 && value.trim() === value;
    const validateEmail = (value: string) => emailRegex.test(value);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (usernameRegex.test(val)) {
            setUsername(val);
            clearError();
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (passwordRegex.test(val)) {
            setPassword(val);
            clearError();
        }
    };

    const handlePasswordRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (passwordRegex.test(val)) {
            setPasswordRepeat(val);
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!validateLoginFinal(username)) {
            setLocalError('Логин должен содержать 4-32 символа.');
            return;
        }
        if (!validatePasswordFinal(password)) {
            setLocalError('Пароль должен быть 8-72 символов.');
            return;
        }

        try {
            if (mode === 'register') {
                if (password !== passwordRepeat) {
                    setLocalError('Пароли не совпадают.');
                    return;
                }
                if (!firstName.trim()) {
                    setLocalError('Введите имя.');
                    return;
                }
                if (!lastName.trim()) {
                    setLocalError('Введите фамилию.');
                    return;
                }
                if (!validateEmail(email)) {
                    setLocalError('Введите корректный email.');
                    return;
                }

                const registerData: RegisterRequest = {
                    username,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                };

                await register(registerData);
            } else {
                const loginData: LoginRequest = { username, password };
                await login(loginData);
            }

            // При успехе редиректим на главную
            navigate('/');
        } catch (err: any) {
            // Ошибка уже обработана в context, но можно доп. обработать
            console.error('Auth error:', err);
        }
    };

    const displayError = localError || error;

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
                <h2 className={styles.title}>{mode === 'register' ? 'Регистрация' : 'Вход в аккаунт'}</h2>
                {displayError && <div className={styles.error}>{displayError}</div>}

                <label htmlFor="username" className={styles.label}>
                    Логин
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={handleLoginChange}
                    className={styles.input}
                    autoComplete="username"
                    placeholder="Логин (4-32 символов)"
                    required
                    disabled={loading}
                />

                <label htmlFor="password" className={styles.label}>
                    Пароль
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    placeholder="Пароль (8-72 символов)"
                    required
                    disabled={loading}
                />

                {mode === 'register' && (
                    <>
                        <label htmlFor="passwordRepeat" className={styles.label}>
                            Повторите пароль
                        </label>
                        <input
                            id="passwordRepeat"
                            type="password"
                            value={passwordRepeat}
                            onChange={handlePasswordRepeatChange}
                            className={styles.input}
                            autoComplete="new-password"
                            placeholder="Повторите пароль"
                            required
                            disabled={loading}
                        />

                        <label htmlFor="firstName" className={styles.label}>
                            Имя
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                clearError();
                            }}
                            className={styles.input}
                            placeholder="Ваше имя"
                            required
                            disabled={loading}
                        />

                        <label htmlFor="lastName" className={styles.label}>
                            Фамилия
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                clearError();
                            }}
                            className={styles.input}
                            placeholder="Ваша фамилия"
                            required
                            disabled={loading}
                        />

                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearError();
                            }}
                            className={styles.input}
                            placeholder="example@mail.com"
                            required
                            disabled={loading}
                        />
                    </>
                )}

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? (mode === 'register' ? 'Регистрация...' : 'Вход...') : (mode === 'register' ? 'Зарегистрироваться' : 'Войти')}
                </button>

                <div className={styles.links}>
                    {mode === 'register' ? (
                        <Link to="/login" className={styles.link}>
                            Уже есть аккаунт? Войти
                        </Link>
                    ) : (
                        <Link to="/register" className={styles.link}>
                            Регистрация
                        </Link>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Auth;