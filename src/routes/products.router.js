import { Router } from "express";

const router = Router();

// GET /api/products
router.get("/", (req, res) => {
  res.json({ message: "Listado de productos (endpoint funcionando)" });
});

// GET /api/products/:pid
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  res.json({ message: `Detalle del producto con id ${pid}` });
});

export default router;
