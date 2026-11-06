import { useCallback, useEffect, useState } from "react";

import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import Cart from "./components/Cart";

import {
  obtenerProductos,
  obtenerCategorias,
  agregarAlCarrito,
  obtenerCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
} from "./services/api";

import type {
  Category,
  Product,
  CartResponse,
} from "./types/product";

import "./App.css";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionMessage, setActionMessage] = useState("");
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);

  // Estado del carrito
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);

  // Consultar el carrito y actualizar los puntos
  const cargarCarrito = useCallback(async () => {
    try {
      setCartLoading(true);
      setCartError(null);

      const result = await obtenerCarrito();

      setCart(result);
      setPointsBalance(result.pointsBalance);
    } catch (error) {
      setCartError(
        error instanceof Error
          ? error.message
          : "No fue posible cargar el carrito."
      );
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Consultar categorias
  useEffect(() => {
    obtenerCategorias()
      .then(setCategories)
      .catch((error) => {
        console.error("Error al consultar categorias:", error);
      });
  }, []);

  // Consultar productos cuando cambian los filtros o la pagina
  useEffect(() => {
    let cancelled = false;

    const cargarProductos = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await obtenerProductos({
          page,
          limit: 10,
          search,
          categoryId,
        });

        if (!cancelled) {
          setProducts(result.data);
          setTotalPages(result.pagination.totalPages);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "No fue posible cargar los productos."
          );
        }
      } finally {
        if (!cancelled)
          setLoading(false);
      }
    };

    cargarProductos();

    return () => {
      cancelled = true;
    };
  }, [page, search, categoryId]);

  // Consultar el carrito al iniciar la aplicacion
  useEffect(() => {
    void cargarCarrito();
  }, [cargarCarrito]);

  // Agregar un producto al carrito

  const handleAddToCart = async (product: Product) => {
    setActionMessage("");

    // Consultar cuantas unidades del producto ya están en el carrito
    const currentQuantity =
      cart?.items.find((item) => item.productId === product.id)?.quantity ?? 0;

    // Validar el stock antes de enviar la peticion
    if (currentQuantity + 1 > product.stock) {
      setActionMessage("No hay suficiente stock para la cantidad solicitada.");
      return;
    }

    try {
      const result = await agregarAlCarrito(product.id, 1);

      setPointsBalance(result.pointsBalance);

      setActionMessage(
        result.pointsEarned > 0
          ? `${product.name} agregado correctamente. Ganaste ${result.pointsEarned} puntos.`
          : `${product.name}: cantidad actualizada. No se generaron puntos adicionales.`
      );

      await cargarCarrito();
    } catch (error) {
      setActionMessage(
        error instanceof Error
          ? error.message
          : "No fue posible agregar el producto."
      );
    }
  };

  // Actualizar la cantidad de un producto
  const handleUpdateQuantity = async (
    productId: number,
    quantity: number
  ) => {
    // Actualizacion optimista de la cantidad
    setCart((currentCart) =>
      currentCart
        ? {
          ...currentCart,
          items: currentCart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        }
        : currentCart
    );

    try {
      setCartError(null);

      await actualizarCantidadCarrito(productId, quantity);

      // Obtener los totales actualizados desde el backend
      await cargarCarrito();
    } catch (error) {
      await cargarCarrito();

      setCartError(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar la cantidad."
      );
    }
  };

  // Eliminar un producto del carrito
  const handleRemoveItem = async (productId: number) => {
    // Actualizacion optimista: quitar el producto de la vista
    setCart((currentCart) =>
      currentCart
        ? {
          ...currentCart,
          items: currentCart.items.filter(
            (item) => item.productId !== productId
          ),
        }
        : currentCart
    );

    try {
      setCartError(null);

      await eliminarDelCarrito(productId);

      await cargarCarrito();
    } catch (error) {
      await cargarCarrito();

      setCartError(
        error instanceof Error
          ? error.message
          : "No fue posible eliminar el producto."
      );
    }
  };

  // Cantidad total de unidades en el carrito
  const cartCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Tienda de Recompensas</h1>

        <div>
          {pointsBalance !== null && (
            <p>Mis puntos: {pointsBalance}</p>
          )}

          <button
            type="button"
            onClick={() => {
              setShowCart((current) => !current);
              setCartError(null);
            }}
          >
            {showCart
              ? "Volver al catálogo"
              : `Mi carrito (${cartCount})`}
          </button>
        </div>
      </header>

      {showCart ? (
        <section className="catalog">
          <h2>Mi carrito de compras</h2>

          <Cart
            cart={cart}
            loading={cartLoading}
            error={cartError}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        </section>
      ) : (
        <section className="catalog">
          <h2>Catálogo de productos</h2>

          <SearchBar
            search={search}
            categoryId={categoryId}
            categories={categories}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onCategoryChange={(value) => {
              setCategoryId(value);
              setPage(1);
            }}
          />

          {actionMessage && (
            <p className="action-message" role="status">
              {actionMessage}
            </p>
          )}

          <ProductList
            products={products}
            loading={loading}
            error={error}
            onAddToCart={handleAddToCart}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      )}
    </main>
  );
}

export default App;