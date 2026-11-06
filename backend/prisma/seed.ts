import { PrismaClient } from "../generated/prisma/client.js";
import type { Category } from "../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "Usuario Demo",
            points: 0,
        },
    });

    // Crear categorías
    const categories = [
        "Celulares",
        "Accesorios",
        "Computadores",
    ];

    const categoryRecords: Category[] = [];

    for (const name of categories) {
        const category = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });

        categoryRecords.push(category);
    }

    const celulares = categoryRecords.find(
        (category) => category.name === "Celulares"
    )!;

    const accesorios = categoryRecords.find(
        (category) => category.name === "Accesorios"
    )!;

    const computadores = categoryRecords.find(
        (category) => category.name === "Computadores"
    )!;

    // Productos iniciales
    const products = [
        {
            name: "Samsung Galaxy A55",
            description: "Celular Samsung Galaxy A55",
            price: "1499900",
            stock: 15,
            categoryId: celulares.id,
        },
        {
            name: "iPhone 15",
            description: "Apple iPhone 15",
            price: "3299900",
            stock: 8,
            categoryId: celulares.id,
        },
        {
            name: "Audífonos Bluetooth",
            description: "Audífonos inalámbricos",
            price: "89900",
            stock: 25,
            categoryId: accesorios.id,
        },
        {
            name: "Cargador USB-C",
            description: "Cargador de carga rápida",
            price: "59900",
            stock: 30,
            categoryId: accesorios.id,
        },
        {
            name: "Portátil Lenovo",
            description: "Computador portátil Lenovo",
            price: "2599900",
            stock: 6,
            categoryId: computadores.id,
        },
    ];

    for (const product of products) {
        const existingProduct = await prisma.product.findFirst({
            where: {
                name: product.name,
                categoryId: product.categoryId,
            },
        });

        if (!existingProduct)
            await prisma.product.create({ data: product, });
    }

    console.log("Seed ejecutado correctamente.");
}

main()
    .catch((error) => {
        console.error("Error ejecutando el seed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });