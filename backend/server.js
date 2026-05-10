const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const DB_FILE = path.join(__dirname, 'db.json');
const SECRET_KEY = 'HCI_SUPER_SECRET_KEY';

// Initialize DB
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], products: [], carts: {}, favorites: {}, logs: [] }));
}

function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Dummy products array for UX Testing
const productsList = [
    { id: 1, name: "AeroStep Pro X2 Koşu Ayakkabısı", altName: "SportRun Pro Series 2 Beyaz", emoji: "👟", brand: "NikeStar", category: "Ayakkabı", price: 1299, fakeDiscount: 35, oldPrice: 1999, rating: 4.9, reviews: 284, stock: 3, viewers: 23, color: "Beyaz/Mavi", packageNote: "2'li Paket Fiyatı", bestSeller: true },
    { id: 2, name: "UrbanStep Classic Sneaker Beyaz", altName: "Casual White Runner V3", emoji: "👟", brand: "AdiStep", category: "Ayakkabı", price: 849, fakeDiscount: 29, oldPrice: 1200, rating: 4.8, reviews: 156, stock: 8, viewers: 14, color: "Beyaz", packageNote: null, bestSeller: false },
    { id: 3, name: "FlexRun Trail 500 Spor Ayakkabı", altName: "FlexRun Outdoor 500", emoji: "👟", brand: "PumaStar", category: "Ayakkabı", price: 1650, fakeDiscount: 21, oldPrice: 2100, rating: 5.0, reviews: 412, stock: 2, viewers: 31, color: "Siyah/Turuncu", packageNote: null, bestSeller: true },
    { id: 5, name: "SmartWatch Ultra Pro 7 Akıllı Saat", altName: "AkıllıSaat Pro X2 Series 7", emoji: "⌚", brand: "TechWear", category: "Elektronik", price: 2499, fakeDiscount: 29, oldPrice: 3499, rating: 4.8, reviews: 521, stock: 5, viewers: 42, color: "Siyah", packageNote: "Şarj Aleti Dahil Paket", bestSeller: true },
    { id: 8, name: "DryFit Performans Spor Tişört", altName: "ActiveWear DryFit Tee Pro", emoji: "👕", brand: "SportWear", category: "Giyim", price: 299, fakeDiscount: 34, oldPrice: 450, rating: 5.0, reviews: 334, stock: 7, viewers: 12, color: "Mavi/Gri", packageNote: "3'lü Paket Fiyatı", bestSeller: true }
];

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Erişim reddedildi. Lütfen giriş yapın.' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Geçersiz Token.' });
        req.user = user;
        next();
    });
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// 1. REGISTER
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Bu email zaten kullanılıyor.' });
    }

    // DARK PATTERN AT BACKEND: Unexplained strict password requirements
    // We enforce it, but the UI might just say "Invalid password"
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
        return res.status(400).json({ error: 'Şifreniz güvenlik standartlarımızı karşılamıyor.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, SECRET_KEY, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// 2. LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Email veya şifre hatalı.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// 3. GET PRODUCTS
app.get('/products', (req, res) => {
    res.json(productsList);
});

// 4. SYNC CART
app.post('/cart', authenticateToken, (req, res) => {
    const { cartItems } = req.body;
    const db = readDB();
    db.carts[req.user.id] = cartItems;
    writeDB(db);
    res.json({ success: true, message: 'Sepet güncellendi.' });
});

// 5. SYNC FAVORITES
app.post('/favorites', authenticateToken, (req, res) => {
    const { favoriteIds } = req.body;
    const db = readDB();
    db.favorites[req.user.id] = favoriteIds;
    writeDB(db);
    res.json({ success: true, message: 'Favoriler güncellendi.' });
});

// 6. LOG USER ACTIONS (UX RESEARCH)
app.post('/logs', authenticateToken, (req, res) => {
    const { action, taskId, isError } = req.body;
    const db = readDB();
    db.logs.push({
        userId: req.user.id,
        action,
        taskId: taskId || null,
        isError: isError || false,
        timestamp: new Date().toISOString()
    });
    writeDB(db);
    res.json({ success: true });
});

// 7. GET MY PROFILE DATA
app.get('/me', authenticateToken, (req, res) => {
    const db = readDB();
    const cart = db.carts[req.user.id] || [];
    const favorites = db.favorites[req.user.id] || [];
    const userLogs = db.logs.filter(l => l.userId === req.user.id).slice(-20); // Top 20 recent actions
    res.json({ user: req.user, cart, favorites, logs: userLogs });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
