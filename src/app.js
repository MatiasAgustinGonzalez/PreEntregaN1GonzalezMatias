import express from "express";
import morgan from "morgan";
import cors from "cors";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Not found
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto:${PORT}`);
});
