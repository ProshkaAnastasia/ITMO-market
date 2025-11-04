import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../styles/Shop.module.css';
import ProductGridPageable, { Product } from '../components/ProductGridPageable';

interface ShopData {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
}

const Shop: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const isModerator = true;
    const isSeller = true;

    const [shop, setShop] = useState<ShopData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [descEditing, setDescEditing] = useState(false);
    const [descDraft, setDescDraft] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);

                await new Promise(res => setTimeout(res, 1000));
                if (!id) throw new Error('Shop ID missing');

                setShop({
                    id,
                    name: 'Магазин ИТМО',
                    description: 'Лучший магазин сувениров и мерча ИТМО. Мы рады предложить качественные и уникальные товары для всех посетителей нашего магазина.',
                    avatarUrl: '/assets/images/shop_avatar.jpg',
                });
                setDescDraft('Лучший магазин сувениров и мерча ИТМО. Мы рады предложить качественные и уникальные товары для всех посетителей нашего магазина.');

                const productsData: Product[] = [];
                for (let i = 1; i <= 50; i++) {
                    productsData.push({
                        id: i,
                        name: `Товар #${i}`,
                        price: Math.round(500 + Math.random() * 1500),
                        image: `/assets/images/product${(i % 6) + 1}.jpg`,
                        description: `Описание товара #${i}`,
                    });
                }
                setProducts(productsData);

                setLoading(false);
            } catch {
                setError(true);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const saveDescription = () => {
        setShop(prev => prev ? { ...prev, description: descDraft } : prev);
        setDescEditing(false);
    };

    const handleAddToCart = (productId: number) => {
        alert(`Добавлен в корзину товар с ID: ${productId}`);
    };

    if (loading) return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <p className={styles.loading}>Загрузка магазина...</p>
            </div>
        </div>
    );

    if (error || !shop) return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <p className={styles.error}>Ошибка загрузки данных магазина.</p>
                <Link to="/" className={styles.homeLink}>На главную</Link>
            </div>
        </div>
    );

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <Link to="/" className={styles.backLink}>← Назад</Link>

                <div className={styles.shopHeader}>
                    <img src={shop.avatarUrl} alt={`${shop.name} аватар`} className={styles.shopAvatar} />
                    <h1 className={styles.shopName}>{shop.name}</h1>
                </div>

                <div className={styles.shopDescription}>
                    {descEditing && (isModerator || isSeller) ? (
                        <>
              <textarea
                  className={styles.descriptionTextarea}
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
              />
                            <div className={styles.descriptionButtons}>
                                <button onClick={saveDescription} className={styles.saveButton}>Сохранить</button>
                                <button onClick={() => { setDescEditing(false); setDescDraft(shop.description); }} className={styles.cancelButton}>Отмена</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>{shop.description}</p>
                            {(isModerator || isSeller) && (
                                <button onClick={() => setDescEditing(true)} className={styles.editButton}>Редактировать описание</button>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.gridWrapper}>
                    <ProductGridPageable
                        products={products}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </div>
        </div>
    );
};

export default Shop;
