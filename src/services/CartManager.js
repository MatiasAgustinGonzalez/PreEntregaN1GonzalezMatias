import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generateId } from "../utils/idGenerator.js";
import { ProductManager } from "./ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, "../data/carts.json");

export class CartManager {
  constructor(filePath = DATA_PATH) {
    this.filePath = filePath;
    this.productManager = new ProductManager(); // para validar productos
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data || "[]");
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  async #writeFile(data) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.#readFile();
    const cart = { id: generateId(), products: [] };
    carts.push(cart);
    await this.#writeFile(carts);
    return cart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find((c) => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readFile();
    const idx = carts.findIndex((c) => String(c.id) === String(cartId));
    if (idx === -1) return null;

    // Validar que el producto exista
    const prod = await this.productManager.getById(productId);
    if (!prod) {
      const e = new Error("Product to add not found");
      e.status = 404;
      throw e;
    }

    const cart = carts[idx];
    const lineIdx = cart.products.findIndex(
      (p) => String(p.product) === String(productId)
    );

    if (lineIdx === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[lineIdx].quantity += 1;
    }

    carts[idx] = cart;
    await this.#writeFile(carts);
    return cart;
  }
}
