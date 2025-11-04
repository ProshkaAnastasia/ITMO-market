import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ProductCard.module.css';

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    price?: number;
    description?: string;
    showPrice?: boolean;
    onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
                                                     id,
                                                     name,
                                                     image,
                                                     price,
                                                     description = '',
                                                     showPrice = true,
                                                     onAddToCart
                                                 }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div
            className={styles.card}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        >
            <img src={image} alt={name} className={styles.image} />
            {showPrice && price !== undefined && <div className={styles.price}>{price} ₽</div>}

            {(description || onAddToCart) && (
                <div className={`${styles.info} ${hovered ? styles.infoVisible : ''}`}>
                    {description && <div className={styles.description}>{description}</div>}
                    {onAddToCart && (
                        <button
                            className={styles.addButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart();
                            }}
                        >
                            Добавить в корзину
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
