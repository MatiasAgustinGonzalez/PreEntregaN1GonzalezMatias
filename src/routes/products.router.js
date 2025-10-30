import { Router } from "express";
import { ProductManager } from "../services/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// GET /api/products
router.get("/", async (req, res, next) => {
  try {
    const products = await productManager.getAll();
    res.status(200).json({ payload: products });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getById(pid);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ payload: product });
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post("/", async (req, res, next) => {
  try {
    const created = await productManager.addProduct(req.body);
    res.status(201).json({ message: "Product created", payload: created });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const updated = await productManager.updateProduct(pid, req.body);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product updated", payload: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const deleted = await productManager.deleteProduct(pid);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
