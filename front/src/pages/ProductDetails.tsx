import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../styles/ProductDetails.module.css';
import { productsApi } from '../api/productsApi';
import { ProductDTO } from '../types/dto';

interface ProductDetailsProps {
    onAddToCart: (productId: number) => void;
}

/**
 * Компонент для отображения деталей товара.
 * Загружает данные асинхронно с backend'а по ID из URL.
 */
const ProductDetails: React.FC<ProductDetailsProps> = ({ onAddToCart }) => {
    // ИСПРАВЛЕНИЕ: читаем ID из URL параметров
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<ProductDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!id) {
            setError(true);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(false);

        const fetchProduct = async () => {
            try {
                // ИСПРАВЛЕНИЕ: используем реальный API вместо mock'а
                const productId = parseInt(id, 10);
                const data = await productsApi.getProduct(productId);
                setProduct(data);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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
                        Магазин:{' '}
                        <Link to={`/shop/${product.shopId}`} className={styles.shopLink}>
                            Переход в магазин
                        </Link>
                    </p>

                    <p className={styles.description}>{product.description}</p>

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