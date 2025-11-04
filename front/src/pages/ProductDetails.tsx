import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ProductDetails.module.css';

interface Shop {
    id: string;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    features: string[];
    price: number;
    image: string;
    shop: Shop;
}

interface ProductDetailsProps {
    productId: number;
    onAddToCart: (productId: number) => void;
}

/**
 * Компонент для отображения деталей товара.
 * Загружает данные асинхронно и отображает их.
 */
const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onAddToCart }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        setError(false);

        const fetchProduct = async () => {
            try {
                // Эмуляция задержки и заглушка данных
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (productId === -1) throw new Error('Product not found');

                setProduct({
                    id: productId,
                    name: 'Футболка ИТМО',
                    description: 'Качественная футболка с логотипом ИТМО.',
                    features: ['100% хлопок', 'Дышащий материал', 'Доступна в разных размерах'],
                    price: 1200,
                    image: '/assets/images/product1_large.jpg',
                    shop: {
                        id: '1',
                        name: 'ITMO-Маркет'
                    }
                });

            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.container}>
                    <p className={styles.loading}>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.container}>
                    <p className={styles.error}>Ошибка загрузки продукта. Попробуйте позже.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <div className={styles.imageWrapper}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        loading="lazy"
                    />
                </div>
                <div className={styles.details}>
                    <h1 className={styles.productName}>{product.name}</h1>

                    <p className={styles.shopLink}>
                        Продавец:{' '}
                        <Link to={`/shop/${product.shop.id}`} className={styles.shopLink}>
                            {product.shop.name}
                        </Link>
                    </p>

                    <p className={styles.description}>{product.description}</p>
                    <ul className={styles.features}>
                        {product.features.map((feature, index) => (
                            <li key={index} className={styles.featureItem}>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <div className={styles.price}>Цена: {product.price} ₽</div>

                    <button
                        type="button"
                        className={styles.addToCartButton}
                        onClick={() => onAddToCart(product.id)}
                    >
                        Добавить в корзину
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
