import { prisma } from "../config/prisma.js";

const POINTS_PER_ACTION = 5;
const DEMO_USER_ID = 1;

interface AddToCartParams {
    productId: number;
    quantity: number;
}

interface UpdateCartItemParams {
    productId: number;
    quantity: number;
}

interface DeleteCartItemParams {
    productId: number;
}

export const addToCart = async ({
    productId,
    quantity,
}: AddToCartParams) => {

    if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(quantity) || quantity < 1)
        throw new Error("INVALID_INPUT");

    return prisma.$transaction(async (tx) => {

        const product = await tx.product.findUnique({ where: { id: productId }, });

        if (!product || !product.active)
            throw new Error("PRODUCT_NOT_AVAILABLE");

        const user = await tx.user.findUnique({ where: { id: DEMO_USER_ID }, });

        if (!user)
            throw new Error("USER_NOT_FOUND");

        const cart = await tx.cart.upsert({
            where: { userId: DEMO_USER_ID },
            update: {},
            create: {
                userId: DEMO_USER_ID,
            },
        });

        const existingItem = await tx.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        const currentQuantity = existingItem?.quantity ?? 0;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > product.stock)
            throw new Error("INSUFFICIENT_STOCK");

        await tx.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            update: {
                quantity: newQuantity,
            },
            create: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });

        const pointsEarned = existingItem ? 0 : POINTS_PER_ACTION;

        const updatedUser = pointsEarned > 0
            ? await tx.user.update({
                where: { id: DEMO_USER_ID },
                data: {
                    points: {
                        increment: pointsEarned,
                    },
                },
            })
            : user;

        return { pointsBalance: updatedUser.points, pointsEarned, };
    });
};

export const getCart = async () => {
    const [user, cart] = await Promise.all([
        prisma.user.findUnique({
            where: { id: DEMO_USER_ID },
            select: {
                points: true,
            },
        }),

        prisma.cart.findUnique({
            where: { userId: DEMO_USER_ID },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    if (!user)
        throw new Error("USER_NOT_FOUND");

    const cartItems = cart?.items ?? [];

    const items = cartItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        image: item.product.image,
        category: item.product.category.name,
        unitPrice: item.product.price.toString(),
        quantity: item.quantity,
        subtotal: item.product.price
            .mul(item.quantity)
            .toString(),
    }));

    const total = cartItems.length > 0
        ? cartItems.reduce(
            (sum, item) => sum.plus(
                item.product.price.mul(item.quantity)
            ),
            cartItems[0].product.price.mul(0)
        ).toString()
        : "0";

    return {
        items,
        total,
        pointsBalance: user.points,
    };
};

export const updateCartItem = async ({
    productId,
    quantity,
}: UpdateCartItemParams) => {

    if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(quantity) || quantity < 1)
        throw new Error("INVALID_INPUT");

    const cart = await prisma.cart.findUnique({ where: { userId: DEMO_USER_ID } });

    if (!cart)
        throw new Error("CART_NOT_FOUND");

    const item = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
        include: {
            product: true,
        },
    });

    if (!item)
        throw new Error("CART_ITEM_NOT_FOUND");

    if (!item.product.active)
        throw new Error("PRODUCT_NOT_AVAILABLE");

    if (quantity > item.product.stock)
        throw new Error("INSUFFICIENT_STOCK");

    const updatedItem = await prisma.cartItem.update({
        where: {
            id: item.id,
        },
        data: {
            quantity,
        },
    });

    return {
        productId,
        quantity: updatedItem.quantity,
        message: "Cantidad actualizada correctamente.",
    };
};


export const deleteCartItem = async ({
    productId,
}: DeleteCartItemParams) => {

    if (!Number.isInteger(productId) || productId < 1)
        throw new Error("INVALID_INPUT");

    return prisma.$transaction(async (tx) => {

        const cart = await tx.cart.findUnique({
            where: { userId: DEMO_USER_ID },
        });

        if (!cart)
            throw new Error("CART_NOT_FOUND");

        const item = await tx.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (!item)
            throw new Error("CART_ITEM_NOT_FOUND");

        const user = await tx.user.findUnique({
            where: { id: DEMO_USER_ID },
        });

        if (!user)
            throw new Error("USER_NOT_FOUND");

        // Evitar que el saldo de puntos sea negativo.
        const pointsDeducted = Math.min(user.points, POINTS_PER_ACTION);

        const updatedUser = pointsDeducted > 0
            ? await tx.user.update({
                where: { id: DEMO_USER_ID },
                data: {
                    points: {
                        decrement: pointsDeducted,
                    },
                },
            })
            : user;

        await tx.cartItem.delete({ where: { id: item.id } });

        return {
            productId,
            pointsBalance: updatedUser.points,
            pointsDeducted,
            message: "Producto eliminado del carrito correctamente.",
        };
    });
};


