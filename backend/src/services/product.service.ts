
import { prisma } from "../config/prisma.js";

interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
}

export const getProducts = async ({
    page = 1,
    limit = 10,
    search,
    categoryId,
}: GetProductsParams) => {

    const skip = (page - 1) * limit;

    const where = {
        active: true,
        ...(search && {
            name: {
                contains: search,
            },
        }),
        ...(categoryId && {
            categoryId,
        }),
    };

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.product.count({
            where,
        }),
    ]);

    return {
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
