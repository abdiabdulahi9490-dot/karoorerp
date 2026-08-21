// app.js - Application entrypoint
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Security
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session (MemoryStore used for scaffold only — replace in production)
app.use(session({
  name: 'erp_session',
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }
}));

// Attach user if session exists
const { attachUser } = require('./server/middleware/auth');
app.use(attachUser);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Database (ensures pool is initialized)
const db = require('./server/config/database');

// Routes
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/dashboard', require('./server/routes/dashboard'));
app.use('/api/products', require('./server/routes/inventory'));
app.use('/api/customers', require('./server/routes/customers'));
app.use('/api/suppliers', require('./server/routes/suppliers'));
app.use('/api/sales', require('./server/routes/sales'));
app.use('/api/purchases', require('./server/routes/purchases'));
app.use('/api/expenses', require('./server/routes/expenses'));
app.use('/api/accounting', require('./server/routes/accounting'));
app.use('/api/reports', require('./server/routes/reports'));
app.use('/api/users', require('./server/routes/users'));
app.use('/api/receipt', require('./server/routes/receipt'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
const { errorHandler } = require('./server/middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ERP app listening on port ${PORT}`);
});
