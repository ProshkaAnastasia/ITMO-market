import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from '../styles/ProductGridPageable.module.css';
import ProductCard from './ProductCard';

export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    description?: string;
}

interface ProductGridPageableProps {
    products: Product[];
    onAddToCart: (productId: number) => void;
    className?: string;
    itemMinWidth?: number;
    itemMaxWidth?: number;
    itemMinHeight?: number;
    itemMaxHeight?: number;
    maxRows?: number;
}

const ProductGridPageable: React.FC<ProductGridPageableProps> = ({
                                                                     products,
                                                                     onAddToCart,
                                                                     className = '',
                                                                     itemMinWidth = 230,
                                                                     itemMaxWidth = 250,
                                                                     itemMinHeight = 170,
                                                                     itemMaxHeight = 200,
                                                                     maxRows = 10,
                                                                 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(1);
    const [rows, setRows] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const calculateColumns = useCallback(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const colCount = Math.floor(width / itemMinWidth);
        setColumns(colCount > 0 ? colCount : 1);
    }, [itemMinWidth]);

    const calculateRows = useCallback(() => {
        if (!containerRef.current) return;
        const height = containerRef.current.clientHeight;
        let maxRowsPossible = Math.min(maxRows, Math.floor(height / itemMinHeight));
        // Локальная переменная, чтобы избежать setRows в цикле
        while (containerRef.current.scrollHeight > containerRef.current.clientHeight && maxRowsPossible > 1) {
            maxRowsPossible--;
        }
        setRows(maxRowsPossible > 0 ? maxRowsPossible : 1);
    }, [itemMinHeight, maxRows]);

    const handleResize = useCallback(() => {
        calculateColumns();
        calculateRows();
    }, [calculateColumns, calculateRows]);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [columns, rows]);

    const itemsPerPage = columns * rows;
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const displayedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getShownPages = () => {
        const pages = [];
        if (currentPage > 1) pages.push(currentPage - 1);
        pages.push(currentPage);
        if (currentPage < totalPages) pages.push(currentPage + 1);
        return pages;
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <>
            <div
                ref={containerRef}
                className={`${styles.gridContainer} ${className}`}
                style={{
                    gridTemplateColumns: `repeat(auto-fit, minmax(${itemMinWidth}px, ${itemMaxWidth}px))`,
                    gridAutoRows: `minmax(${itemMinHeight}px, ${itemMaxHeight}px)`,
                    height: '100%',
                }}
            >
                {displayedProducts.map((product) => (
                    <div key={product.id} className={styles.gridItem}>
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            price={product.price}
                            description={product.description}
                            showPrice
                            onAddToCart={() => onAddToCart(product.id)}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.paginationButton}>
                    ◀
                </button>

                {getShownPages().map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={page === currentPage ? `${styles.paginationButton} ${styles.paginationButtonActive}` : styles.paginationButton}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                >
                    ▶
                </button>
            </div>
        </>
    );
};

export default ProductGridPageable;
