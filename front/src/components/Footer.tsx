import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.left}>
                <img src="/assets/images/itmo_logo.png" alt="ИТМО Логотип" className={styles.logoImage} />
                <div className={styles.contact}>
                    <p>Тел: +7 (931) 272-04-00</p>
                    <p>Email: info@itmo.ru</p>
                </div>
            </div>
            <div className={styles.middle}>
                <a href="/about">О нас</a>
                <a href="/terms">Пользовательское соглашение</a>
                <a href="/privacy">Политика конфиденциальности</a>
            </div>
            <div className={styles.right}>
                <a href="https://vk.com/itmo" target="_blank" rel="noopener noreferrer">VK</a>
                <a href="https://instagram.com/itmo" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://t.me/itmo" target="_blank" rel="noopener noreferrer">Telegram</a>
                <p>© {new Date().getFullYear()} ИТМО</p>
            </div>
        </footer>
    );
};

export default Footer;
