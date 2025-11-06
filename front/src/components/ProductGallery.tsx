import React from 'react';
import ProductCard from '../components/ProductCard';
import styles from '../styles/ProductGallery.module.css';

const products = [
    { id: 1, name: 'Футболка ИТМО', image: '/assets/images/product1.jpg' },
    { id: 2, name: 'Кепка ИТМО', image: '/assets/images/product2.jpg' },
    { id: 3, name: 'Рюкзак ИТМО', image: '/assets/images/product3.jpg' },
    { id: 4, name: 'Бутылка для воды', image: '/assets/images/product4.jpg' },
    { id: 5, name: 'Значок дракончик', image: '/assets/images/product5.jpg' },
    { id: 6, name: 'Ручка с логотипом', image: '/assets/images/product6.jpg' },
    { id: 7, name: 'Шапка ИТМО', image: '/assets/images/product7.jpg' },
    { id: 8, name: 'Кружка ИТМО', image: '/assets/images/product8.jpg' },
    { id: 9, name: 'Блокнот', image: '/assets/images/product9.jpg' },
    { id: 10, name: 'Значок', image: '/assets/images/product10.jpg' },
    { id: 11, name: 'Флешка', image: '/assets/images/product11.jpg' },
    { id: 12, name: 'Брелок', image: '/assets/images/product12.jpg' },
];

const half = Math.ceil(products.length / 2);
const topProducts = [...products.slice(0, half), ...products.slice(0, half), ...products.slice(0, half)];
const bottomProducts = [...products.slice(half), ...products.slice(half), ...products.slice(half)];

const ProductGallery: React.FC = () => (
    <div className={styles.galleryWrapper}>
        <div className={styles.galleryTop}>
            {topProducts.map((product, i) => (
                <ProductCard
                    key={`top-${i}`}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    showPrice={false}
                />
            ))}
        </div>
        <div className={styles.galleryBottom}>
            {bottomProducts.map((product, i) => (
                <ProductCard
                    key={`bottom-${i}`}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    showPrice={false}
                />
            ))}
        </div>
    </div>
);

export default ProductGallery;
