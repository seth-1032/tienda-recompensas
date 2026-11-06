import type {
    Category,
    ProductResponse,
    CartResponse,
    CartActionResponse,
} from "../types/product";

const API_URL = "http://localhost:3000/api";

interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
}

interface AddToCartResponse {
    message: string;
    pointsBalance: number;
    pointsEarned: number;
}

// Función general para realizar solicitudes HTTP
const requestJson = async <T>(
    endpoint: string
): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok)
        throw new Error("No fue posible obtener la información.");

    return response.json() as Promise<T>;
};

// Consultar productos con filtros y paginacion
export const obtenerProductos = async ({
    page = 1,
    limit = 10,
    search = "",
    categoryId,
}: GetProductsParams = {}): Promise<ProductResponse> => {

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search.trim())
        params.set("search", search.trim());

    if (categoryId)
        params.set("categoryId", String(categoryId));

    return requestJson<ProductResponse>(`/products?${params.toString()}`);
};

// Consultar categorías
export const obtenerCategorias = async (): Promise<Category[]> => {
    return requestJson<Category[]>("/categories");
};

// Añadir al carrito
export const agregarAlCarrito = async (
    productId: number,
    quantity: number
): Promise<AddToCartResponse> => {
    const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            productId,
            quantity,
        }),
    });

    const data = await response.json();

    if (!response.ok)
        throw new Error(data.message || "No fue posible agregar el producto.");

    return data;
};
// Consultar el carrito y el saldo de puntos
export const obtenerCarrito = async (): Promise<CartResponse> => {
    return requestJson<CartResponse>("/cart");
};

// Actualizar la cantidad de un producto
export const actualizarCantidadCarrito = async (
    productId: number,
    quantity: number
): Promise<CartActionResponse> => {

    const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (!response.ok)
        throw new Error(data.message || "No fue posible actualizar la cantidad.");

    return data as CartActionResponse;
};

// Eliminar un producto del carrito
export const eliminarDelCarrito = async (
    productId: number
): Promise<CartActionResponse> => {

    const response = await fetch(`${API_URL}/cart/${productId}`, { method: "DELETE", });
    const data = await response.json();

    if (!response.ok)
        throw new Error(data.message || "No fue posible eliminar el producto.");

    return data as CartActionResponse;
};
