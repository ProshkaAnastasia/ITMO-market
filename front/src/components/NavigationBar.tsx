import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NavigationBar.module.css';
import Icon from './Icon';
import UserMenu from "./UserMenu";

interface NavigationBarProps {
    isAuthenticated: boolean;
    cartItemCount: number;
    onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isAuthenticated, cartItemCount, onLogout}) => (
    <nav className={styles.nav}>
        <div className={styles.leftSection}>
            <Link to="/" className={styles.logo}>
                <img src={'/assets/images/itmo_logo.png'} alt={'ИТМО'} className={styles.logoImage} />
                <span className={styles.logoText}>- Маркет</span>
            </Link>
        </div>
        <div className={styles.rightSection}>
            <Link to="/search" className={styles.iconLink} title="Поиск">
                <Icon name={"Search"} size={30} color={"none"}/>
            </Link>
            {isAuthenticated && (
                <Link to="/shop/1" className={styles.iconLink} title="Магазин">
                    <Icon name={"Shop"} size={30} color={"none"}/>
                </Link>
            )}
            <Link to="/cart" className={styles.iconLink} title="Корзина">
                <Icon name={"ShoppingBag"} size={30} color={"none"}/>
                {cartItemCount > 0 && <span className={styles.cartCount}>{cartItemCount}</span>}
            </Link>
            <UserMenu isAuthenticated={isAuthenticated} onLogout={onLogout}/>
        </div>
    </nav>
);

export default NavigationBar;
