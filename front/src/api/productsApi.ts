import axiosInstance from './axiosInstance';
import { ProductDTO, PaginatedResponse } from '../types/dto';

export const productsApi = {
    // Получить товары с пагинацией (max 50)
    getProducts: async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<ProductDTO>> => {
        const response = await axiosInstance.get<PaginatedResponse<ProductDTO>>('/products', {
            params: { page, pageSize: Math.min(pageSize, 50) },
        });
        return response.data;
    },

    // Поиск товаров
    searchProducts: async (keywords: string, page: number = 1): Promise<PaginatedResponse<ProductDTO>> => {
        const response = await axiosInstance.get<PaginatedResponse<ProductDTO>>('/products/search', {
            params: { keywords, page, pageSize: 50 },
        });
        return response.data;
    },

    // Получить товар по ID
    getProduct: async (id: number): Promise<ProductDTO> => {
        const response = await axiosInstance.get<ProductDTO>(`/products/${id}`);
        return response.data;
    },

    // Получить товары магазина
    getShopProducts: async (shopId: string, page: number = 1): Promise<PaginatedResponse<ProductDTO>> => {
        const response = await axiosInstance.get<PaginatedResponse<ProductDTO>>(`/shops/${shopId}/products`, {
            params: { page, pageSize: 50 },
        });
        return response.data;
    },
};