import { Router } from "express";

const router = Router();

// POST /api/carts
router.post("/", (req, res) => {
  res.json({ message: "Nuevo carrito creado (endpoint funcionando)" });
});

// GET /api/carts/:cid
router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  res.json({ message: `Carrito con id ${cid}` });
});

export default router;
