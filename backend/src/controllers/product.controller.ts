
import type { Request, Response } from "express";
import { getProducts } from "../services/product.service.js";

export const getProductsController = async (
    req: Request,
    res: Response
) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = String(req.query.search ?? "").trim();
        const categoryId = req.query.categoryId !== undefined ? Number(req.query.categoryId) : undefined;

        // Validar paginación
        if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100)
            return res.status(400).json({ message: "Los parámetros de paginación no son válidos." });

        // Validar categoría
        if (categoryId !== undefined && (!Number.isInteger(categoryId) || categoryId < 1))
            return res.status(400).json({ message: "El identificador de categoría no es válido." });

        const result = await getProducts({ page, limit, search, categoryId });

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error al obtener productos:", error);

        return res.status(500).json({ message: "Ocurrió un error al consultar los productos." });
    }
};
