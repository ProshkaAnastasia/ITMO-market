import React, { useState, useEffect } from 'react';
import styles from '../styles/Search.module.css';
import ProductGridPageable, { Product } from '../components/ProductGridPageable';

const Search: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            await new Promise(res => setTimeout(res, 300));

            const totalProducts = 100;
            const items: Product[] = [];
            for (let i = 1; i <= totalProducts; i++) {
                items.push({
                    id: i,
                    name: `Товар #${i}`,
                    image: `/assets/images/product${(i % 6) + 1}.jpg`,
                    price: Math.round(1000 + Math.random() * 5000),
                    description: `Описание товара #${i}`,
                });
            }

            // Фильтрация по searchTerm
            const filteredItems = items.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setProducts(filteredItems);
            setLoading(false);
        };

        fetchProducts();
    }, [searchTerm]);

    const handleAddToCart = (id: number) => {
        alert(`Добавлен товар ${id}`);
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Поиск товаров..."
                className={styles.searchInput}
                autoComplete="off"
            />

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <ProductGridPageable
                    products={products}
                    onAddToCart={handleAddToCart}
                />
            )}
        </div>
    );
};

export default Search;
