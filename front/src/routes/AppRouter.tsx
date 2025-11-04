import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Profile from "../pages/Profile";
import Shop from "../pages/Shop";
import Search from "../pages/Search";
import ProductDetails from "../pages/ProductDetails";
import Order from "../pages/OrderView";
import AdminPanel from "../pages/AdminPanel";
import NotFound from "../pages/NotFound";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";

// // Admin
// AdminPanel.tsx (Admin privileges)
//
// // Auth
// Auth.tsx (For everyone) Login + Register
// Profile.tsx (For everyone)
//
// // Shop
// Shop.tsx (For users only view, for sellers/moderation +edit)
//
// // Products
// Search.tsx (For users only view, for moderation +products_on_moderation)
// ProductDetails.tsx (For users only view, for moderation +approval/reject +edit)
//
// // Order & Orders
// OrderView.tsx (For everyone)
// Orders.tsx (For everyone)
// OrderDetails.tsx (For everyone)
//
// // Общие
// Home.tsx (For everyone)
// NotFound.tsx (For everyone)

const AppRouter: React.FC = () => (
    <Router>
        <div className="app">
            <NavigationBar isAuthenticated={false} cartItemCount={10} onLogout={() => {}}/>
            <Routes>
                <Route path="/" element={<Home/>}/>

                <Route path="/login" element={<Auth/>}/>
                <Route path="/register" element={<Auth/>}/>
                <Route path="/profile" element={<Profile/>}/>

                <Route path="/shop/:id" element={<Shop/>}/>

                <Route path="/search" element={<Search/>}/>
                <Route path="/product/:id" element={<ProductDetails productId={0} onAddToCart={() => {}}/>}/>

                <Route path="/cart" element={<Order mode={'cart'}/>}/>
                <Route path="/orders/:id" element={<Order mode={'orderDetails'}/>}/>

                <Route path="/admin" element={<AdminPanel/>}/>

                <Route path="*" element={<NotFound/>}/>
            </Routes>
            <Footer/>
        </div>
    </Router>
)
;

export default AppRouter;