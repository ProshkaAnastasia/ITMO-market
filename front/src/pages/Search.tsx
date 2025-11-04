import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from '../styles/Search.module.css';
import ProductGridPageable, { Product } from '../components/ProductGridPageable';
import { productsApi } from '../api/productsApi';
import { PaginatedResponse, ProductDTO } from '../types/dto';

const Search: React.FC = () => {
    const [searchParams] = useSearchParams();
    const keywords = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(keywords);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response: PaginatedResponse<ProductDTO> = searchTerm
                    ? await productsApi.searchProducts(searchTerm)
                    : await productsApi.getProducts();

                // Маппим ProductDTO на Product для компонента
                const mappedProducts: Product[] = response.data.map(product => ({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    description: product.description,
                }));

                setProducts(mappedProducts);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка загрузки товаров');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchTerm]);

    const handleAddToCart = (id: number) => {
        // TODO: Добавить в корзину
        console.log('Добавить в корзину:', id);
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
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : products.length === 0 ? (
                <p>Товаров не найдено</p>
            ) : (
                <ProductGridPageable products={products} onAddToCart={handleAddToCart} />
            )}
        </div>
    );
};

export default Search;