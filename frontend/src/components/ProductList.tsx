
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    onAddToCart: (product: Product) => void;
}

const ProductList = ({
    products,
    loading,
    error,
    onAddToCart,
}: ProductListProps) => {

    if (loading)
        return (<p className="catalog-message">Cargando productos...</p>);

    if (error)
        return (<p className="catalog-message error">{error}</p>);

    if (products.length === 0)
        return (<p className="catalog-message">No se encontraron productos.</p>);

    return (
        <section className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </section>
    );
};

export default ProductList;
