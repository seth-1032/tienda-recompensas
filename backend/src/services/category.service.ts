
import { prisma } from "../config/prisma.js";

export const getCategories = async () => {
    return prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
        },
    });
};
