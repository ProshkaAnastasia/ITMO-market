import React, { useState, useEffect } from 'react';
import styles from '../styles/OrderView.module.css';

interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface OrderViewProps {
    mode: 'cart' | 'orderDetails';
    orderId?: number;
    deliveryAddress?: string;
    onAddressChange?: (newAddress: string) => void;
    onRemoveItem?: (id: number) => void;
    onQuantityChange?: (id: number, quantity: number) => void;
    onPayment?: () => void;
}

const OrderView: React.FC<OrderViewProps> = ({
                                                 mode,
                                                 orderId,
                                                 deliveryAddress = '',
                                                 onAddressChange,
                                                 onRemoveItem,
                                                 onQuantityChange,
                                                 onPayment,
                                             }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [address, setAddress] = useState(deliveryAddress);
    const [addressError, setAddressError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError(false);
        async function fetchData() {
            try {
                await new Promise(res => setTimeout(res, 1000));
                // Пример: если orderId === undefined — эмулируем пустой ответ
                // для cart — пустая корзина, для orderDetails — ошибка
                if (orderId === undefined) {
                    if (mode === 'cart') {
                        setItems([]); // пустая корзина
                        setLoading(false);
                        return;
                    } else {
                        throw new Error('No order');
                    }
                }
                // Фиктивные данные для успешного запроса
                const fetchedItems: CartItem[] = [
                    { id: 1, name: 'Товар 1', image: '/assets/images/product1.jpg', price: 1000, quantity: 2 },
                    { id: 2, name: 'Товар 2', image: '/assets/images/product2.jpg', price: 1500, quantity: 1 },
                ];
                setItems(fetchedItems);
                setLoading(false);
            } catch {
                setError(true);
                setItems([]);
                setLoading(false);
            }
        }
        fetchData();
    }, [orderId, mode]);

    const totalSum = error ? 0 : items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleQtyChange = (id: number, qtyStr: string) => {
        const qty = Number(qtyStr);
        if (qty < 1) return;
        onQuantityChange?.(id, qty);
    };

    const handleAddressChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
        if (e.target.value.trim()) setAddressError('');
        onAddressChange?.(e.target.value);
    };

    const handlePaymentClick = () => {
        if (!address.trim()) {
            setAddressError('Введите адрес доставки');
            return;
        }
        onPayment?.();
    };

    if (loading) {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.container}>
                    <h2 className={styles.title}>Загрузка...</h2>
                </div>
            </div>
        );
    }

    if (error && mode === 'orderDetails') {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.container}>
                    <h2 className={styles.title}>Данные заказа недоступны</h2>
                    <p className={styles.empty}>Пожалуйста, попробуйте позже.</p>
                </div>
            </div>
        );
    }

    if (!error && items.length === 0 && mode === 'cart') {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.container}>
                    <h2 className={styles.title}>Ваша корзина</h2>
                    <p className={styles.empty}>Корзина пуста</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h2 className={styles.title}>{mode === 'cart' ? 'Ваша корзина' : 'Детали заказа'}</h2>

                <div className={styles.itemsList}>
                    {items.map(item => (
                        <div key={item.id} className={styles.cartItem}>
                            <img src={item.image} alt={item.name} className={styles.productImage} />
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{item.name}</h3>
                                {mode === 'cart' ? (
                                    <div className={styles.controls}>
                                        <label className={styles.qtyLabel}>
                                            Кол-во:
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={e => handleQtyChange(item.id, e.target.value)}
                                                className={styles.qtyInput}
                                            />
                                        </label>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => onRemoveItem?.(item.id)}
                                            title="Удалить товар"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <p className={styles.staticQuantity}>Количество: {item.quantity}</p>
                                )}
                                {!error && (
                                    <div className={styles.priceRow}>
                                        <span>Цена за штуку: {item.price} ₽</span>
                                        <span>Итого: {item.price * item.quantity} ₽</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {mode === 'cart' ? (
                    <>
                        <div className={styles.delivery}>
                            <label htmlFor="address" className={styles.addressLabel}>
                                Адрес доставки:
                            </label>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={handleAddressChangeLocal}
                                placeholder="Введите адрес доставки"
                                className={styles.addressInput}
                            />
                            {addressError && <p className={styles.error}>{addressError}</p>}
                        </div>

                        <div className={styles.totalSum}>Итоговая сумма: {totalSum} ₽</div>

                        <button
                            className={styles.payButton}
                            disabled={address.trim() === '' || items.length === 0}
                            onClick={handlePaymentClick}
                        >
                            Оплатить
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.delivery}>
                            <label className={styles.addressLabel}>Адрес доставки:</label>
                            <p className={styles.staticAddress}>{address || 'Адрес не указан'}</p>
                        </div>
                        {!error && <div className={styles.totalSum}>Итоговая сумма: {totalSum} ₽</div>}
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderView;
