import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/UserMenu.module.css';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';

const UserMenu: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const hideTimer = useRef<NodeJS.Timeout | null>(null);
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
        }
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        hideTimer.current = setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsVisible(false);
    };

    return (
        <div className={styles.userMenuWrapper} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {isAuthenticated && user ? (
                <>
                    <Link to="/profile" className={styles.iconLink} title={`Профиль (${user.username})`}>
                        <Icon name="User" size={30} color="none" />
                    </Link>
                    <div className={`${styles.menu} ${isVisible ? styles.menuVisible : ''}`}>
                        <div className={styles.userInfo}>
                            <p>{user.username}</p>
                            <small>{user.email}</small>
                        </div>
                        <button className={`${styles.menuButton} ${styles.logoutButton}`} onClick={handleLogout}>
                            Выход
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <Link to="/login" className={styles.iconLink} title="Вход/регистрация">
                        <Icon name="User" size={30} color="none" />
                    </Link>
                    <div className={`${styles.menu} ${isVisible ? styles.menuVisible : ''}`}>
                        <Link to="/login" className={`${styles.menuButton} ${styles.loginButton}`}>
                            Вход
                        </Link>
                        <p className={styles.registerText}>
                            Нет аккаунта?{' '}
                            <Link to="/register" className={styles.registerLink}>
                                Регистрация
                            </Link>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserMenu;