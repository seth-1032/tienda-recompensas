
import type { Request, Response } from "express";
import { getCategories } from "../services/category.service.js";

export const getCategoriesController = async (
    _req: Request,
    res: Response
) => {
    try {
        const categories = await getCategories();
        return res.status(200).json(categories);

    } catch (error) {
        console.error("Error al consultar categorías:", error);

        return res.status(500).json({
            message: "Ocurrió un error al consultar las categorías.",
        });
    }
};
