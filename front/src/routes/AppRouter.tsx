import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Profile from '../pages/Profile';
import Shop from '../pages/Shop';
import Search from '../pages/Search';
import ProductDetails from '../pages/ProductDetails';
import OrderView from '../pages/OrderView';
import AdminPanel from '../pages/AdminPanel';
import NotFound from '../pages/NotFound';
import Footer from '../components/Footer';
import NavigationBar from '../components/NavigationBar';

const AppRouter: React.FC = () => {
    const { isAuthenticated, user, loading } = useAuth();

    // Пока идет загрузка - показываем заглушку
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Загрузка...</p>
            </div>
        );
    }

    const handleAddToCart = (productId: number) => {
        console.log('Добавить в корзину:', productId);
        // TODO: добавить в корзину через API
    };

    return (
        <Router>
            <div className="app">
                <NavigationBar cartItemCount={10} />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} />} />

                    {/* Auth routes - redirect если уже авторизован */}
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Auth />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Auth />} />

                    {/* Private routes */}
                    <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                    <Route path="/shop/:id" element={<PrivateRoute element={<Shop />} />} />
                    <Route path="/cart" element={<PrivateRoute element={<OrderView mode="cart" />} />} />
                    <Route path="/orders/:id" element={<PrivateRoute element={<OrderView mode="orderDetails" />} />} />

                    {/* Admin only */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute
                                element={<AdminPanel />}
                                requiredRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']}
                            />
                        }
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default AppRouter;