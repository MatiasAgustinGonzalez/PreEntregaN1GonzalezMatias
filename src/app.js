import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { ProductManager } from './services/ProductManager.js';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import handlebars from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// guardo io en app para usarlo en rutas HTTP si hace falta emitir
app.set('io', io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routers HTTP
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Not found
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// Socket.io
const productManager = new ProductManager();

io.on('connection', async (socket) => {
  // Envío lista inicial cuando un cliente se conecta
  const products = await productManager.getAll();
  socket.emit('products:update', products);

  // crear/eliminar desde WebSocket
  socket.on('product:create', async (data, cb) => {
    try {
      const created = await productManager.addProduct(data);
      const all = await productManager.getAll();
      io.emit('products:update', all);
      cb?.({ ok: true, created });
    } catch (err) {
      cb?.({ ok: false, error: err.message });
    }
  });

  socket.on('product:delete', async (id, cb) => {
    try {
      const deleted = await productManager.deleteProduct(id);
      if (!deleted) return cb?.({ ok: false, error: 'Product not found' });
      const all = await productManager.getAll();
      io.emit('products:update', all);
      cb?.({ ok: true, deleted });
    } catch (err) {
      cb?.({ ok: false, error: err.message });
    }
  });
});

// Server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
