import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new DatabaseSync(dbPath);

console.log('Connected to SQLite Database at:', dbPath);

// Setup Tables
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL,
      rating REAL DEFAULT 4.5,
      review_count INTEGER DEFAULT 12,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      total_amount REAL NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Placed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );
  `);

  // Check if seed data needed
  const userCountStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const userResult = userCountStmt.get();

  if (userResult.count === 0) {
    console.log('Seeding initial users...');
    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    insertUser.run('Devika Admin', 'admin@lumina.com', 'admin123', 'admin');
    insertUser.run('Alex Johnson', 'user@lumina.com', 'user123', 'user');
  }

  const productCountStmt = db.prepare('SELECT COUNT(*) as count FROM products');
  const productResult = productCountStmt.get();

  if (productResult.count === 0) {
    console.log('Seeding initial products...');
    const insertProduct = db.prepare(`
      INSERT INTO products (name, description, price, category, stock, image, rating, review_count, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedProducts = [
      {
        name: 'Smart Watch Series 5',
        description: 'Vivid OLED fitness tracking, heart monitor, GPS, and water-resistant sleek casing.',
        price: 89.99,
        category: 'Electronics',
        stock: 24,
        image: '/images/smartwatch.jpg',
        rating: 4.8,
        review_count: 128,
        featured: 1
      },
      {
        name: 'Wireless Headphones',
        description: 'Active noise cancellation, studio-grade audio drivers, and 40-hour long-lasting battery.',
        price: 59.99,
        category: 'Electronics',
        stock: 18,
        image: '/images/headphones.jpg',
        rating: 4.7,
        review_count: 98,
        featured: 1
      },
      {
        name: 'Travel Backpack',
        description: 'Durable water-resistant olive green canvas backpack with padded laptop sleeve and ergonomic straps.',
        price: 39.99,
        category: 'Accessories',
        stock: 35,
        image: '/images/backpack.jpg',
        rating: 4.6,
        review_count: 156,
        featured: 1
      },
      {
        name: 'Running Shoes',
        description: 'Ultra-lightweight breathable mesh running sneakers with shock-absorbing cushioned sole.',
        price: 49.99,
        category: 'Sports',
        stock: 22,
        image: '/images/shoes.jpg',
        rating: 4.8,
        review_count: 78,
        featured: 1
      },
      {
        name: 'Luxury Perfume',
        description: 'Exquisite French floral and sandalwood fragrance crafted in a handcrafted glass bottle.',
        price: 29.99,
        category: 'Beauty',
        stock: 40,
        image: '/images/perfume.jpg',
        rating: 4.9,
        review_count: 64,
        featured: 1
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Low-profile anodized aluminum mechanical keyboard with customizable RGB lighting.',
        price: 129.00,
        category: 'Electronics',
        stock: 15,
        image: '/images/keyboard.jpg',
        rating: 4.7,
        review_count: 84,
        featured: 0
      },
      {
        name: 'Smart Ambient Speaker',
        description: 'Cylindrical 360-degree immersive acoustic smart home speaker with glowing ambient halo.',
        price: 79.95,
        category: 'Home & Kitchen',
        stock: 12,
        image: '/images/speaker.jpg',
        rating: 4.8,
        review_count: 53,
        featured: 1
      }
    ];

    for (const p of seedProducts) {
      insertProduct.run(p.name, p.description, p.price, p.category, p.stock, p.image, p.rating, p.review_count, p.featured);
    }
  }

  // Check if sample order needed
  const orderCountStmt = db.prepare('SELECT COUNT(*) as count FROM orders');
  const orderResult = orderCountStmt.get();
  if (orderResult.count === 0) {
    const sampleOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, user_email, customer_name, total_amount, shipping_address, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertOrder.run(sampleOrderId, 'user@lumina.com', 'Alex Johnson', 458.99, '742 Evergreen Terrace, Springfield, OR', 'Credit Card (**** 4242)', 'Shipped');

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertItem.run(sampleOrderId, 1, 'Lumina Wireless Noise-Canceling Headphones', 299.99, 1, '/images/headphones.jpg');
    insertItem.run(sampleOrderId, 3, 'CyberDeck Mechanical Keyboard', 159.00, 1, '/images/keyboard.jpg');
  }
}

initDatabase();

// API ROUTES

// 1. Auth Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);

  if (!user) {
    // Demo auto-registration for user convenience
    const isNewAdmin = email.includes('admin');
    const role = isNewAdmin ? 'admin' : 'user';
    const name = email.split('@')[0].toUpperCase();
    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const result = insertUser.run(name, email, password || 'password', role);
    
    return res.json({
      user: {
        id: result.lastInsertRowid,
        name,
        email,
        role
      },
      token: 'demo-jwt-token-' + result.lastInsertRowid
    });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: 'demo-jwt-token-' + user.id
  });
});

// 2. Get Products (with Search & Category Filter)
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    params.push(Number(minPrice));
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(Number(maxPrice));
  }

  query += ' ORDER BY id DESC';

  const stmt = db.prepare(query);
  const products = stmt.all(...params);
  res.json(products);
});

// 3. Get Product By ID
app.get('/api/products/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const product = stmt.get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 4. Create Product (Admin Only)
app.post('/api/products', (req, res) => {
  const { name, description, price, category, stock, image, featured } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const defaultImage = image || '/images/headphones.jpg';
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, category, stock, image, rating, review_count, featured)
    VALUES (?, ?, ?, ?, ?, ?, 5.0, 1, ?)
  `);

  const result = stmt.run(
    name,
    description || '',
    Number(price),
    category,
    Number(stock || 0),
    defaultImage,
    featured ? 1 : 0
  );

  const newProdStmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const newProduct = newProdStmt.get(result.lastInsertRowid);
  res.status(201).json(newProduct);
});

// 5. Update Product (Admin Only)
app.put('/api/products/:id', (req, res) => {
  const { name, description, price, category, stock, image, featured } = req.body;
  const productId = req.params.id;

  const checkStmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const existing = checkStmt.get(productId);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updateStmt = db.prepare(`
    UPDATE products
    SET name = ?, description = ?, price = ?, category = ?, stock = ?, image = ?, featured = ?
    WHERE id = ?
  `);

  updateStmt.run(
    name !== undefined ? name : existing.name,
    description !== undefined ? description : existing.description,
    price !== undefined ? Number(price) : existing.price,
    category !== undefined ? category : existing.category,
    stock !== undefined ? Number(stock) : existing.stock,
    image !== undefined ? image : existing.image,
    featured !== undefined ? (featured ? 1 : 0) : existing.featured,
    productId
  );

  const updated = checkStmt.get(productId);
  res.json(updated);
});

// 6. Delete Product (Admin Only)
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const result = stmt.run(productId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully', id: Number(productId) });
});

// 7. Get Orders (Filter by user email or return all)
app.get('/api/orders', (req, res) => {
  const { email } = req.query;
  let query = 'SELECT * FROM orders';
  const params = [];

  if (email) {
    query += ' WHERE user_email = ?';
    params.push(email);
  }

  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  const orders = stmt.all(...params);

  // Fetch items for each order
  const getItemStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  const fullOrders = orders.map(order => {
    const items = getItemStmt.all(order.id);
    return { ...order, items };
  });

  res.json(fullOrders);
});

// 8. Create Order
app.post('/api/orders', (req, res) => {
  const { user_email, customer_name, total_amount, shipping_address, payment_method, items } = req.body;

  if (!user_email || !items || !items.length) {
    return res.status(400).json({ error: 'User email and items are required' });
  }

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, user_email, customer_name, total_amount, shipping_address, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Placed')
  `);

  insertOrder.run(orderId, user_email, customer_name || 'Valued Customer', Number(total_amount), shipping_address || 'Default Address', payment_method || 'Card', 'Placed');

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const updateStock = db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?');

  for (const item of items) {
    insertItem.run(orderId, item.product_id, item.name, Number(item.price), Number(item.quantity), item.image);
    updateStock.run(Number(item.quantity), item.product_id);
  }

  const getCreatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const getCreatedItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  res.status(201).json({ ...getCreatedOrder, items: getCreatedItems });
});

// 9. Update Order Tracking Status (Admin Only)
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
  const result = stmt.run(status, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);

  res.json({ ...updatedOrder, items });
});

// 10. Dashboard Stats (Admin)
app.get('/api/stats', (req, res) => {
  const totalRevenue = db.prepare('SELECT SUM(total_amount) as total FROM orders').get().total || 0;
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count || 0;
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count || 0;
  const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock < 10').get().count || 0;

  const categoryStats = db.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all();

  res.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    lowStockCount,
    categoryStats
  });
});

// 11. Get Product Reviews
app.get('/api/products/:id/reviews', (req, res) => {
  const stmt = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC');
  const reviews = stmt.all(req.params.id);
  res.json(reviews);
});

// 12. Add Product Review
app.post('/api/products/:id/reviews', (req, res) => {
  const { author_name, rating, comment } = req.body;
  const productId = req.params.id;

  if (!author_name || !rating || !comment) {
    return res.status(400).json({ error: 'Author name, rating, and comment are required' });
  }

  const insertStmt = db.prepare(`
    INSERT INTO reviews (product_id, author_name, rating, comment)
    VALUES (?, ?, ?, ?)
  `);
  insertStmt.run(productId, author_name, Number(rating), comment);

  // Recalculate average rating & review count for product
  const statsStmt = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?');
  const statsResult = statsStmt.get(productId);

  const updateProd = db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?');
  updateProd.run(Math.round(statsResult.avg_rating * 10) / 10, statsResult.count, productId);

  const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(insertStmt.lastInsertRowid);
  res.status(201).json(newReview);
});

app.listen(PORT, () => {
  console.log(`LUMINA Fullstack E-Commerce Server listening on http://localhost:${PORT}`);
});
