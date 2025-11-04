import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/UserMenu.module.css';
import Icon from './Icon';

interface UserMenuProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isAuthenticated , onLogout}) => {
    const [isVisible, setIsVisible] = useState(false);
    const hideTimer = useRef<NodeJS.Timeout | null>(null);

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
        }, 300); // задержка 300 мс перед скрытием
    };

    return (
        <div className={styles.userMenuWrapper}
             onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {isAuthenticated ? (
                <>
                    <Link to="/profile" className={styles.iconLink} title="Профиль">
                        <Icon name="User" size={30} color="none"/>
                    </Link>
                    <div className={`${styles.menu} ${isVisible ? styles.menuVisible : ''}`}>
                        <button className={`${styles.menuButton} ${styles.logoutButton}`} onClick={onLogout}>
                            Выход
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <Link to="/login" className={styles.iconLink} title="Вход/регистрация">
                        <Icon name="User" size={30} color="none"/>
                    </Link>
                    <div className={`${styles.menu} ${isVisible ? styles.menuVisible : ''}`}>
                        <Link to="/login" className={`${styles.menuButton} ${styles.loginButton}`}>
                            Вход
                        </Link>
                        <p className={styles.registerText}>
                            Если вы не зарегистрированы, можете зарегистрироваться{' '}
                            <Link to="/register" className={styles.registerLink}>здесь</Link>.
                        </p>
                    </div>
                </>
            )}
        </div>


    );
};

export default UserMenu;
