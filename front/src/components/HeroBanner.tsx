import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/HeroBanner.module.css';

const slides = [
    {
        src: '/assets/images/itmo_university.jpg',
        alt: 'Университет ИТМО',
        link: 'https://itmo.ru/',
        title: 'Университет ИТМО',
        description: 'Лучший технический университет России.',
        bgColor: '#ffd6a5',
    },
    {
        src: '/assets/images/itmo_store.png',
        alt: 'Магазин ИТМО',
        link: 'https://vk.link/itmostore',
        title: 'ИТМО.STORE',
        description: 'Мерч ИТМО уже в ITMO Store — стиль будущего в настоящем!',
        bgColor: '#a0c4ff',
    },
    {
        src: '/assets/images/rubber_duck.jpeg',
        alt: 'Резиновая уточка',
        link: 'https://se.ifmo.ru/',
        title: 'Сувениры ИТМО',
        description: 'Резиновая уточка, постеры и многое другое!',
        bgColor: '#97e197',
    }
];

const HeroBanner: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 10000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <div
            className={styles.hero}
            style={{ backgroundColor: slides[current].bgColor }}
        >
            <div className={styles.textBlock}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={styles.text}
                        style={{
                            opacity: index === current ? 1 : 0,
                            transition: 'opacity 1s ease-in-out',
                            position: index === current ? 'relative' : 'absolute',
                            pointerEvents: index === current ? 'auto' : 'none',
                        }}
                    >
                        <h2 className={styles.title}>{slide.title}</h2>
                        <p className={styles.description}>{slide.description}</p>
                    </div>
                ))}
            </div>
            <div></div>
            <div className={styles.slidesBlock}>
                {slides.map((slide, index) => {
                    let className = styles.next;
                    if (index === current) className = styles.active;
                    if (index === (current === 0 ? slides.length - 1 : current - 1)) className = styles.leave;
                    return (
                        <a
                            key={index}
                            href={slide.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={className}
                        >
                            <img src={slide.src} alt={slide.alt} className={styles.image} />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroBanner;
