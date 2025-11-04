import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Auth.module.css';
import escapeHtml from "../api/escapeHtml";

const usernameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9]{0,32}$/;
const passwordRegex = /^.{0,72}$/;

const Auth: React.FC = () => {
    const location = useLocation();

    // Определяем режим по пути
    const mode = location.pathname === '/register' ? 'register' : 'login';

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validateLoginFinal = (value: string) => /^[a-zA-Zа-яА-ЯёЁ0-9]{4,32}$/.test(value);
    const validatePasswordFinal = (value: string) =>
        value.length >= 8 && value.length <= 72 && value.trim() === value;

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (usernameRegex.test(val)) {
            setLogin(val);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (passwordRegex.test(val)) {
            setPassword(val);
        }
    };

    const handlePasswordRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (passwordRegex.test(val)) {
            setPasswordRepeat(val);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateLoginFinal(login)) {
            setError('Логин должен содержать 4-32 символа без пробелов и только русские, английские буквы или цифры.');
            return;
        }
        if (!validatePasswordFinal(password)) {
            setError('Пароль должен быть длиной 8-72 символов и не содержать пробелов в начале и конце.');
            return;
        }
        if (mode === 'register') {
            if (password !== passwordRepeat) {
                setError('Пароли не совпадают.');
                return;
            }
        }

        // логика входа / регистрации
        const escapePass = escapeHtml(password)
        console.log(mode === 'register' ? 'Регистрация' : 'Вход', { login, escapePass });
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
                <h2 className={styles.title}>{mode === 'register' ? 'Регистрация' : 'Вход в аккаунт'}</h2>
                {error && <div className={styles.error}>{error}</div>}

                <label htmlFor="login" className={styles.label}>Логин</label>
                <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={handleLoginChange}
                    className={styles.input}
                    autoComplete="username"
                    placeholder="Логин"
                    required
                />

                <label htmlFor="password" className={styles.label}>Пароль</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    autoComplete={mode === 'register' ? "new-password" : "current-password"}
                    placeholder="Пароль"
                    required
                />

                {/* Поле повторения пароля только для регистрации */}
                {mode === 'register' && (
                    <>
                        <label htmlFor="passwordRepeat" className={styles.label}>Повторите пароль</label>
                        <input
                            id="passwordRepeat"
                            type="password"
                            value={passwordRepeat}
                            onChange={handlePasswordRepeatChange}
                            className={styles.input}
                            autoComplete="new-password"
                            placeholder="Повторите пароль"
                            required
                        />
                    </>
                )}

                <button type="submit" className={styles.submitButton}>
                    {mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
                </button>

                <div className={styles.links}>
                    {mode === 'register' ? (
                        <Link to="/login" className={styles.link}>Уже есть аккаунт? Войти</Link>
                    ) : (
                        <Link to="/register" className={styles.link}>Регистрация</Link>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Auth;