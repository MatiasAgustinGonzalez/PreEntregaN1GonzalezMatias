import { Router } from "express";
import { CartManager } from "../services/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// crear carrito
router.post("/", async (req, res, next) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({ message: "Cart created", payload: cart });
  } catch (err) {
    next(err);
  }
});

// lista productos del carrito
router.get("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json({ payload: cart.products });
  } catch (err) {
    next(err);
  }
});

// agrega/incrementa
router.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const updated = await cartManager.addProductToCart(cid, pid);
    if (!updated) return res.status(404).json({ error: "Cart not found" });
    res
      .status(201)
      .json({ message: "Product added to cart", payload: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
