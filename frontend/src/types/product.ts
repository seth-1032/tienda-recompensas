export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    image: string | null;
    stock: number;
    active: boolean;
    categoryId: number;
    category: Category;
}

export interface ProductResponse {
    data: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CartItem {
    id: number;
    productId: number;
    name: string;
    image: string | null;
    category: string;
    unitPrice: string;
    quantity: number;
    subtotal: string;
}

export interface CartResponse {
    items: CartItem[];
    total: string;
    pointsBalance: number;
}

export interface CartActionResponse {
    message: string;
    productId: number;
    quantity?: number;
}

