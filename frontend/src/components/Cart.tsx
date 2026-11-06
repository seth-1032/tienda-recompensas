
import type { CartResponse } from "../types/product";

interface CartProps {
    cart: CartResponse | null;
    loading: boolean;
    error: string | null;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

const formatPrice = (price: string) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 2,
    }).format(Number(price));
};

const Cart = ({
    cart,
    loading,
    error,
    onUpdateQuantity,
    onRemove,
}: CartProps) => {

    if (loading)
        return <p className="cart-message">Cargando carrito...</p>;

    if (error)
        return <p className="cart-message error">{error}</p>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="cart-empty">
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos del catálogo para comenzar.</p>
            </div>
        );
    }

    return (
        <section className="cart-container">
            <div className="cart-items">
                {cart.items.map((item) => (
                    <article className="cart-item" key={item.id}>
                        <div className="cart-item-image">
                            {item.image ? (
                                <img src={item.image} alt={item.name} />
                            ) : (
                                <span>Sin imagen</span>
                            )}
                        </div>

                        <div className="cart-item-info">
                            <span>{item.category}</span>
                            <h3>{item.name}</h3>
                            <p>{formatPrice(item.unitPrice)}</p>
                        </div>

                        <div className="cart-item-actions">
                            <div className="quantity-control">
                                <button
                                    type="button"
                                    disabled={item.quantity <= 1}
                                    onClick={() =>
                                        onUpdateQuantity(
                                            item.productId,
                                            item.quantity - 1
                                        )
                                    }
                                > −
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    type="button" onClick={() =>
                                        onUpdateQuantity(
                                            item.productId,
                                            item.quantity + 1
                                        )
                                    }
                                >
                                    +
                                </button>
                            </div>

                            <strong>{formatPrice(item.subtotal)}</strong>

                            <button
                                type="button"
                                className="remove-item"
                                onClick={() => onRemove(item.productId)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </article>
                ))}

            </div>

            <aside className="cart-summary">
                <h3>Resumen de compra</h3>
                <div className="cart-total">
                    <span>Total</span>
                    <strong>{formatPrice(cart.total)}</strong>
                </div>

                <div className="cart-points">
                    <span>Mis puntos acumulados</span>
                    <strong>{cart.pointsBalance} puntos</strong>
                </div>
            </aside>
        </section>
    );
};

export default Cart;
