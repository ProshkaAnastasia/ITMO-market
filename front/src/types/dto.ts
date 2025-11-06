// Auth DTOs
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[]; // ['ROLE_USER', 'ROLE_SELLER', 'ROLE_MODERATOR', 'ROLE_ADMIN']
}

// Product DTOs
export interface ProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    shopId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED'; // для модераторов
}

// Shop DTOs
export interface ShopDTO {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    sellerId: string;
}

// Cart & Order DTOs
export interface CartItemDTO {
    productId: number;
    quantity: number;
}

export interface OrderDTO {
    id: string;
    userId: string;
    items: CartItemDTO[];
    totalPrice: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
    deliveryAddress: string;
    createdAt: string;
}

// Comment DTOs
export interface CommentDTO {
    id: string;
    productId: number;
    userId: string;
    username: string;
    text: string;
    rating: number;
    createdAt: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

// API Error Response
export interface ApiErrorResponse {
    message: string;
    status: number;
    timestamp: string;
    path: string;
}