import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditableField from '../components/EditableField';
import styles from '../styles/Profile.module.css';

interface Order {
    id: number;
    products: { id: number; image: string }[];
    status: string;
    createdAt: string;
}

const orderStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'В ожидании', color: '#ffbb33' },
    processing: { label: 'В обработке', color: '#33b5e5' },
    shipped: { label: 'Отправлен', color: '#0099cc' },
    delivered: { label: 'Доставлен', color: '#00c851' },
    canceled: { label: 'Отменён', color: '#ff4444' },
};

const Profile: React.FC = () => {
    const navigate = useNavigate();

    // Стейты для редактирования данных
    const [nickname, setNickname] = useState('Иван123');
    const [email, setEmail] = useState('ivan@example.com');
    const [phone, setPhone] = useState('+7 912 345 67 89');

    const orders: Order[] = [
        {
            id: 101,
            status: 'delivered',
            createdAt: '2025-10-05',
            products: [
                { id: 1, image: '/assets/images/product1.jpg' },
                { id: 2, image: '/assets/images/product2.jpg' },
                { id: 4, image: '/assets/images/product4.jpg' },
                { id: 5, image: '/assets/images/product5.jpg' },
            ],
        },
        {
            id: 102,
            status: 'processing',
            createdAt: '2025-10-01',
            products: [
                { id: 3, image: '/assets/images/product3.jpg' },
                { id: 6, image: '/assets/images/product6.jpg' },
            ],
        },
    ];

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h2 className={styles.title}>Профиль пользователя</h2>
                <section className={styles.userInfo}>
                    <EditableField label="Никнейм" value={nickname} onChange={setNickname} />
                    <EditableField label="Email" value={email} onChange={setEmail} />
                    <EditableField label="Телефон" value={phone} onChange={setPhone} />
                </section>

                <section className={styles.orderHistory}>
                    <h3 className={styles.ordersTitle}>История заказов</h3>
                    {orders.length === 0 ? (
                        <p className={styles.empty}>Заказы отсутствуют</p>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map(order => (
                                <div
                                    key={order.id}
                                    className={styles.orderCard}
                                    tabIndex={0}
                                    role="button"
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') navigate(`/orders/${order.id}`);
                                    }}
                                >
                                    <div className={styles.orderHeader}>
                    <span className={styles.orderStatus} style={{ color: orderStatusMap[order.status]?.color }}>
                      {orderStatusMap[order.status]?.label || order.status}
                    </span>
                                        <span className={styles.orderDate}>{order.createdAt}</span>
                                    </div>
                                    <div className={styles.orderImages}>
                                        {order.products.map(p => (
                                            <img
                                                key={p.id}
                                                src={p.image}
                                                alt={`Товар ${p.id}`}
                                                className={styles.productImage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Profile;