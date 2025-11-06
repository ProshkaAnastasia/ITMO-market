import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NotFound.module.css';

const NotFound: React.FC = () => {
    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.message}>Страница не найдена</p>
                <Link to="/" className={styles.homeLink}>
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
