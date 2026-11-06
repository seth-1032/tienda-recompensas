import { PrismaClient } from "../generated/prisma/client.js";
import type { Category } from "../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    // Usuario de demostración
    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "Usuario Demo",
            points: 0,
        },
    });

    // Categorías
    const categories = [
        "Celulares",
        "Accesorios",
        "Computadores",
        "Tablets",
        "Audio",
        "Periféricos",
        "Monitores",
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

    // Obtener los identificadores de las categorías
    const categoryIds = new Map(
        categoryRecords.map((category) => [
            category.name,
            category.id,
        ])
    );

    // Productos
    const products = [
        {
            name: "Samsung Galaxy A55",
            description: "Celular Samsung Galaxy A55 con 128 GB de almacenamiento.",
            price: "1499900",
            stock: 15,
            category: "Celulares",
        },
        {
            name: "iPhone 15",
            description: "Apple iPhone 15 con pantalla Super Retina XDR.",
            price: "3299900",
            stock: 8,
            category: "Celulares",
        },
        {
            name: "Samsung Galaxy S24",
            description: "Smartphone Samsung Galaxy S24 de alto rendimiento.",
            price: "3499900",
            stock: 7,
            category: "Celulares",
        },
        {
            name: "Xiaomi Redmi Note 13",
            description: "Celular Xiaomi con pantalla AMOLED y 256 GB.",
            price: "899900",
            stock: 18,
            category: "Celulares",
        },
        {
            name: "Motorola Edge 50 Fusion",
            description: "Smartphone Motorola con cámara avanzada.",
            price: "1299900",
            stock: 12,
            category: "Celulares",
        },
        {
            name: "iPhone 14",
            description: "Apple iPhone 14 con 128 GB de almacenamiento.",
            price: "2599900",
            stock: 5,
            category: "Celulares",
        },
        {
            name: "Samsung Galaxy A35",
            description: "Celular Samsung Galaxy A35 con pantalla AMOLED.",
            price: "1099900",
            stock: 20,
            category: "Celulares",
        },
        {
            name: "Audífonos Bluetooth",
            description: "Audífonos inalámbricos con conexión Bluetooth.",
            price: "89900",
            stock: 25,
            category: "Accesorios",
        },
        {
            name: "Cargador USB-C",
            description: "Cargador de carga rápida compatible con USB-C.",
            price: "59900",
            stock: 30,
            category: "Accesorios",
        },
        {
            name: "Funda protectora universal",
            description: "Funda protectora resistente para teléfonos móviles.",
            price: "39900",
            stock: 40,
            category: "Accesorios",
        },
        {
            name: "Cable USB-C",
            description: "Cable USB-C de carga rápida y transferencia de datos.",
            price: "29900",
            stock: 50,
            category: "Accesorios",
        },
        {
            name: "Power Bank 20000 mAh",
            description: "Batería portátil con capacidad de 20000 mAh.",
            price: "149900",
            stock: 16,
            category: "Accesorios",
        },
        {
            name: "Portátil Lenovo",
            description: "Computador portátil Lenovo para trabajo y estudio.",
            price: "2599900",
            stock: 6,
            category: "Computadores",
        },
        {
            name: "Portátil HP Pavilion",
            description: "Portátil HP Pavilion con procesador Intel Core i5.",
            price: "2899900",
            stock: 9,
            category: "Computadores",
        },
        {
            name: "MacBook Air M2",
            description: "Portátil Apple con chip M2 y diseño ultradelgado.",
            price: "4599900",
            stock: 4,
            category: "Computadores",
        },
        {
            name: "Portátil ASUS VivoBook",
            description: "Computador ASUS VivoBook para productividad.",
            price: "2399900",
            stock: 11,
            category: "Computadores",
        },
        {
            name: "Portátil Acer Aspire 5",
            description: "Portátil Acer Aspire 5 para uso cotidiano.",
            price: "2199900",
            stock: 8,
            category: "Computadores",
        },
        {
            name: "iPad 10 generación",
            description: "Tablet Apple con pantalla Liquid Retina.",
            price: "2199900",
            stock: 7,
            category: "Tablets",
        },
        {
            name: "Samsung Galaxy Tab S9 FE",
            description: "Tablet Samsung con pantalla de alta resolución.",
            price: "1899900",
            stock: 10,
            category: "Tablets",
        },
        {
            name: "Xiaomi Redmi Pad SE",
            description: "Tablet Xiaomi para entretenimiento y estudio.",
            price: "799900",
            stock: 14,
            category: "Tablets",
        },
        {
            name: "Lenovo Tab M10",
            description: "Tablet Lenovo compacta para uso familiar.",
            price: "649900",
            stock: 12,
            category: "Tablets",
        },

        {
            name: "JBL Tune 520BT",
            description: "Audífonos inalámbricos JBL con sonido envolvente.",
            price: "179900",
            stock: 20,
            category: "Audio",
        },
        {
            name: "JBL Flip 6",
            description: "Parlante portátil Bluetooth resistente al agua.",
            price: "499900",
            stock: 9,
            category: "Audio",
        },
        {
            name: "Sony WH-CH520",
            description: "Audífonos inalámbricos Sony con batería de larga duración.",
            price: "199900",
            stock: 13,
            category: "Audio",
        },
        {
            name: "Xiaomi Redmi Buds 5",
            description: "Audífonos inalámbricos compactos con cancelación de ruido.",
            price: "159900",
            stock: 17,
            category: "Audio",
        },
        {
            name: "Mouse Logitech M170",
            description: "Mouse inalámbrico Logitech de diseño compacto.",
            price: "49900",
            stock: 35,
            category: "Periféricos",
        },
        {
            name: "Teclado Logitech K380",
            description: "Teclado inalámbrico multidispositivo.",
            price: "169900",
            stock: 15,
            category: "Periféricos",
        },
        {
            name: "Mouse Gamer Redragon",
            description: "Mouse gamer con iluminación RGB y precisión ajustable.",
            price: "119900",
            stock: 18,
            category: "Periféricos",
        },
        {
            name: "Monitor LG 24 pulgadas",
            description: "Monitor LG Full HD de 24 pulgadas.",
            price: "649900",
            stock: 8,
            category: "Monitores",
        },
        {
            name: "Monitor Samsung 27 pulgadas",
            description: "Monitor Samsung Full HD de 27 pulgadas.",
            price: "899900",
            stock: 6,
            category: "Monitores",
        },
        {
            name: "Monitor ASUS TUF Gaming",
            description: "Monitor ASUS Gaming con alta frecuencia de actualización.",
            price: "1399900",
            stock: 4,
            category: "Monitores",
        },
    ];

    let createdProducts = 0;
    let existingProducts = 0;

    for (const product of products) {
        const categoryId = categoryIds.get(product.category);

        if (!categoryId) {
            throw new Error(
                `No se encontró la categoría: ${product.category}`
            );
        }

        const existingProduct = await prisma.product.findFirst({
            where: {
                name: product.name,
                categoryId,
            },
        });

        if (existingProduct) {
            existingProducts++;
            continue;
        }

        await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                categoryId,
            },
        });

        createdProducts++;
    }
}

main()
    .catch((error) => {
        console.error("Error ejecutando el seed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });