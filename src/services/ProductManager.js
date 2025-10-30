import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generateId } from "../utils/idGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, "../data/products.json");

export class ProductManager {
  constructor(filePath = DATA_PATH) {
    this.filePath = filePath;
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

  async getAll() {
    return this.#readFile();
  }

  async getById(id) {
    const products = await this.#readFile();
    return products.find((p) => String(p.id) === String(id)) || null;
  }

  async addProduct(product) {
    // Validaciones mínimas
    const required = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
    ];
    for (const f of required)
      if (!(f in product)) {
        const e = new Error(`Missing required field: ${f}`);
        e.status = 400;
        throw e;
      }

    const products = await this.#readFile();

    if (products.some((p) => p.code === product.code)) {
      const e = new Error("Product code already exists");
      e.status = 400;
      throw e;
    }

    const newProduct = { id: generateId(), ...product };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async updateProduct(id, changes) {
    if ("id" in changes) {
      const e = new Error("id cannot be modified");
      e.status = 400;
      throw e;
    }

    const products = await this.#readFile();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;

    products[idx] = { ...products[idx], ...changes };
    await this.#writeFile(products);
    return products[idx];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;

    const [deleted] = products.splice(idx, 1);
    await this.#writeFile(products);
    return deleted;
  }
}
