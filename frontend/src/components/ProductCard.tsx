
import type { Product } from "../types/product";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard = ({
    product,
    onAddToCart,
}: ProductCardProps) => {

    const formattedPrice = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 2,
    }).format(Number(product.price));

    return (
        <article className="product-card">
            <div className="product-image">
                {product.image ?
                    (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        <span>Sin imagen</span>
                    )}
            </div>

            <div className="product-info">
                <span className="product-category"> {product.category.name} </span>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description || "Sin descripción disponible."}</p>

                <div className="product-footer">
                    <strong>{formattedPrice}</strong>
                    <span className="product-stock">Stock: {product.stock}</span>
                </div>

                <button type="button" disabled={product.stock <= 0} onClick={() => onAddToCart(product)}>
                    {product.stock > 0 ? "Agregar al carrito" : "Agotado"}
                </button>
            </div>

        </article>
    );
};

export default ProductCard;
