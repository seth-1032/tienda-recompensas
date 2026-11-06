
import type { Request, Response } from "express";
import { addToCart, getCart, updateCartItem, deleteCartItem } from "../services/cart.service.js";

export const addToCartController = async (
    req: Request,
    res: Response
) => {
    try {
        const productId = Number(req.body.productId);
        const quantity = Number(req.body.quantity);
        const result = await addToCart({ productId, quantity });

        return res.status(200).json({
            message: "Producto agregado al carrito correctamente.",
            ...result,
        });

    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "";

        switch (errorMessage) {
            case "INVALID_INPUT":
                return res.status(400).json({
                    message: "Los datos enviados no son válidos.",
                });

            case "PRODUCT_NOT_AVAILABLE":
                return res.status(404).json({
                    message: "El producto no existe o no está disponible.",
                });

            case "USER_NOT_FOUND":
                return res.status(404).json({
                    message: "No se encontró el usuario.",
                });

            case "INSUFFICIENT_STOCK":
                return res.status(409).json({
                    message: "No hay suficiente stock para la cantidad solicitada.",
                });

            default:
                console.error("Error al agregar producto al carrito:", error);

                return res.status(500).json({
                    message: "Ocurrió un error al agregar el producto al carrito.",
                });
        }
    }
};

export const getCartController = async (
    _req: Request,
    res: Response
) => {
    try {
        const result = await getCart();
        return res.status(200).json(result);

    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "";

        if (errorMessage === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "No se encontró el usuario.",
            });
        }

        console.error("Error al consultar el carrito:", error);

        return res.status(500).json({
            message: "Ocurrió un error al consultar el carrito.",
        });
    }
};

export const updateCartItemController = async (
    req: Request,
    res: Response
) => {
    try {
        const productId = Number(req.params.productId);
        const quantity = Number(req.body.quantity);
        const result = await updateCartItem({ productId, quantity });

        return res.status(200).json(result);

    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "";

        switch (errorMessage) {
            case "INVALID_INPUT":
                return res.status(400).json({
                    message: "Los datos enviados no son válidos.",
                });

            case "CART_NOT_FOUND":
                return res.status(404).json({
                    message: "No se encontró el carrito.",
                });

            case "CART_ITEM_NOT_FOUND":
                return res.status(404).json({
                    message: "El producto no está en el carrito.",
                });

            case "PRODUCT_NOT_AVAILABLE":
                return res.status(404).json({
                    message: "El producto no está disponible.",
                });

            case "INSUFFICIENT_STOCK":
                return res.status(409).json({
                    message: "No hay suficiente stock.",
                });

            default:
                console.error("Error al actualizar el carrito:", error);

                return res.status(500).json({
                    message: "Ocurrió un error al actualizar el carrito.",
                });
        }
    }
};

export const removeCartItemController = async (
    req: Request,
    res: Response
) => {
    try {
        const productId = Number(req.params.productId);
        const result = await deleteCartItem({ productId });

        return res.status(200).json(result);

    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "";

        switch (errorMessage) {
            case "INVALID_INPUT":
                return res.status(400).json({
                    message: "El identificador del producto no es válido.",
                });

            case "CART_NOT_FOUND":
                return res.status(404).json({
                    message: "No se encontró el carrito.",
                });

            case "CART_ITEM_NOT_FOUND":
                return res.status(404).json({
                    message: "El producto no está en el carrito.",
                });

            default:
                console.error("Error al eliminar producto del carrito:", error);

                return res.status(500).json({
                    message: "Ocurrió un error al eliminar el producto.",
                });
        }
    }
};
