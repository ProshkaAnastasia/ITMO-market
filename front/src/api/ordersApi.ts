import axiosInstance from './axiosInstance';
import { OrderDTO, PaginatedResponse } from '../types/dto';

export const ordersApi = {
    // Получить корзину
    getCart: async (): Promise<OrderDTO> => {
        const response = await axiosInstance.get<OrderDTO>('/cart');
        return response.data;
    },

    // Добавить товар в корзину
    addToCart: async (productId: number, quantity: number) => {
        const response = await axiosInstance.post('/cart/items', { productId, quantity });
        return response.data;
    },

    // Создать заказ
    createOrder: async (deliveryAddress: string): Promise<OrderDTO> => {
        const response = await axiosInstance.post<OrderDTO>('/cart', { deliveryAddress });
        return response.data;
    },

    // Получить заказы пользователя
    getUserOrders: async (page: number = 1): Promise<PaginatedResponse<OrderDTO>> => {
        const response = await axiosInstance.get<PaginatedResponse<OrderDTO>>('/orders', {
            params: { page, pageSize: 20 },
        });
        return response.data;
    },

    // Получить деталь заказа
    getOrder: async (orderId: string): Promise<OrderDTO> => {
        const response = await axiosInstance.get<OrderDTO>(`/orders/${orderId}`);
        return response.data;
    },
};