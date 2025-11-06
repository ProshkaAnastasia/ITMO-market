import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../styles/Shop.module.css';
import ProductGridPageable, { Product } from '../components/ProductGridPageable';
import { productsApi } from '../api/productsApi';
import { PaginatedResponse, ProductDTO, ShopDTO } from '../types/dto';
import { useAuth } from '../context/AuthContext';

interface ShopData {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
}

const Shop: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const [shop, setShop] = useState<ShopData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const isOwner = user?.id === shop?.id; // Упрощенная проверка

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);

                if (!id) throw new Error('Shop ID missing');

                // TODO: Получить данные магазина из API
                // const shopData = await shopsApi.getShop(id);
                // Пока используем mock
                setShop({
                    id,
                    name: 'Магазин ИТМО',
                    description: 'Лучший магазин сувениров и мерча ИТМО.',
                    avatarUrl: '/assets/images/shop_avatar.jpg',
                });

                // Получить товары магазина
                const response: PaginatedResponse<ProductDTO> = await productsApi.getShopProducts(id);

                const mappedProducts: Product[] = response.data.map(product => ({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    description: product.description,
                }));

                setProducts(mappedProducts);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddToCart = (productId: number) => {
        console.log('Добавить в корзину:', productId);
    };

    if (loading) {
        return <div className={styles.pageBackground}><p>Загрузка...</p></div>;
    }

    if (error || !shop) {
        return <div className={styles.pageBackground}><p>Ошибка загрузки магазина</p></div>;
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <Link to="/" className={styles.backLink}>
                    ← Назад
                </Link>

                <div className={styles.shopHeader}>
                    <img src={shop.avatarUrl} alt={shop.name} className={styles.shopAvatar} />
                    <h1 className={styles.shopName}>{shop.name}</h1>
                </div>

                <div className={styles.shopDescription}>
                    <p>{shop.description}</p>
                    {isOwner && <button>Редактировать описание</button>}
                </div>

                <div className={styles.gridWrapper}>
                    <ProductGridPageable products={products} onAddToCart={handleAddToCart} />
                </div>
            </div>
        </div>
    );
};

export default Shop;