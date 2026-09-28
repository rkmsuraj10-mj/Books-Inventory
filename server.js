require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- MIDDLEWARE ---

// Authenticate JWT Token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// Role-Based Authorization
const authorize = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Admin override or specific permission check
            if (req.user.role === 'Administrator') return next();

            const result = await pool.query(`
                SELECT p.name FROM role_permissions rp
                JOIN permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = (SELECT id FROM roles WHERE name = $1) AND p.name = $2
            `, [req.user.role, requiredPermission]);

            if (result.rows.length === 0) {
                return res.status(403).json({ error: 'You do not have permission to perform this action.' });
            }
            next();
        } catch (err) {
            res.status(500).json({ error: 'Authorization error.' });
        }
    };
};

// Audit Logger
const logAudit = async (userId, action, module, recordId, description, ip) => {
    await pool.query(
        'INSERT INTO audit_logs (user_id, action, module, record_id, description, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, action, module, recordId, description, ip]
    );
};

// --- AUTHENTICATION ROUTES ---

// Initial Setup - Only runs if 0 users exist
app.post('/api/setup', async (req, res) => {
    const { full_name, username, email, password } = req.body;
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) > 0) return res.status(403).json({ error: 'Setup already complete.' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (full_name, username, email, password_hash, role_id) VALUES ($1, $2, $3, $4, 1) RETURNING id',
        [full_name, username, email, hash]
    );
    await logAudit(result.rows[0].id, 'Setup', 'System', result.rows[0].id, 'Initial Administrator created', req.ip);
    res.json({ message: 'Setup complete. Please log in.' });
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(`
            SELECT u.*, r.name as role_name FROM users u 
            JOIN roles r ON u.role_id = r.id WHERE u.username = $1 OR u.email = $1
        `, [username]);

        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        if (user.status !== 'Active') return res.status(403).json({ error: 'Account is inactive. Contact Administrator.' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials.' });

        await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
        await logAudit(user.id, 'Login', 'Authentication', user.id, 'Successful login', req.ip);

        // Fetch permissions for frontend UI rendering
        const perms = await pool.query(`
            SELECT p.name FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE rp.role_id = $1
        `, [user.role_id]);

        const token = jwt.sign({ id: user.id, role: user.role_name }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, name: user.full_name, role: user.role_name, permissions: perms.rows.map(p => p.name) } });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// --- USER MANAGEMENT ROUTES ---

app.get('/api/users', authenticate, authorize('user.view'), async (req, res) => {
    const result = await pool.query('SELECT u.id, u.full_name, u.username, u.email, u.status, u.last_login_at, r.name as role FROM users u JOIN roles r ON u.role_id = r.id');
    res.json(result.rows);
});

app.post('/api/users', authenticate, authorize('user.create'), async (req, res) => {
    const { full_name, username, email, password, role_id } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (full_name, username, email, password_hash, role_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [full_name, username, email, hash, role_id, req.user.id]
        );
        await logAudit(req.user.id, 'Create', 'Users', result.rows[0].id, `Created user ${username}`, req.ip);
        res.json({ message: 'User created successfully.' });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: 'Username or email already exists.' });
        res.status(500).json({ error: 'Error creating user.' });
    }
});

app.put('/api/users/:id/status', authenticate, authorize('user.edit'), async (req, res) => {
    const { status } = req.body;
    // Prevent deactivating the last active Admin
    if (status === 'Inactive') {
        const admins = await pool.query(`SELECT count(*) FROM users WHERE role_id = 1 AND status = 'Active'`);
        const target = await pool.query(`SELECT role_id FROM users WHERE id = $1`, [req.params.id]);
        if (target.rows[0].role_id === 1 && parseInt(admins.rows[0].count) <= 1) {
            return res.status(400).json({ error: 'Cannot deactivate the last active Administrator.' });
        }
    }
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', [status, req.params.id]);
    await logAudit(req.user.id, 'StatusChange', 'Users', req.params.id, `Changed status to ${status}`, req.ip);
    res.json({ message: 'User status updated.' });
});

// --- INVENTORY ROUTES ---

app.get('/api/books', authenticate, authorize('book.view'), async (req, res) => {
    const result = await pool.query('SELECT * FROM books ORDER BY name ASC');
    res.json(result.rows);
});

app.post('/api/books', authenticate, authorize('book.create'), async (req, res) => {
    const { code, name, author, publisher, category, price, openingStock, minStock } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO books (code, name, author, publisher, category, price, opening_stock, min_stock, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            [code, name, author, publisher, category, price, openingStock, minStock, req.user.id]
        );
        await logAudit(req.user.id, 'Create', 'Books', result.rows[0].id, `Added book: ${code}`, req.ip);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/transactions', authenticate, authorize('transaction.view'), async (req, res) => {
    const result = await pool.query(`
        SELECT t.*, b.name as book_name, b.code as book_code 
        FROM transactions t JOIN books b ON t.book_id = b.id ORDER BY t.date DESC, t.created_at DESC
    `);
    res.json(result.rows);
});

app.post('/api/transactions', authenticate, authorize('transaction.create'), async (req, res) => {
    const { bookId, type, quantity, date, remarks } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO transactions (book_id, type, quantity, date, remarks, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [bookId, type, quantity, date, remarks, req.user.id]
        );
        await logAudit(req.user.id, 'Create', 'Transactions', result.rows[0].id, `Added ${type} for Book ID ${bookId}`, req.ip);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/audit-logs', authenticate, authorize('audit.view'), async (req, res) => {
    const result = await pool.query(`
        SELECT a.*, u.full_name as user_name FROM audit_logs a 
        LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 100
    `);
    res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BookFlow API running on port ${PORT}`));
