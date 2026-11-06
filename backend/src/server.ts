import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import categoryRoutes from "./routes/category.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta para verificar el estado de la API
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "API funcionando correctamente"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Rutas de productos
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Rutas de categorías
app.use("/api/categories", categoryRoutes);