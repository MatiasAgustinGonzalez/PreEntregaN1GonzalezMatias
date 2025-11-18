import { Router } from 'express';
import { ProductManager } from '../services/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Home: lista estática por HTTP
router.get('/', async (req, res, next) => {
    try {
        const products = await productManager.getAll();
        res.render('home', { products });
    } catch (e) { next(e); }
});

// Real-time por websockets
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;