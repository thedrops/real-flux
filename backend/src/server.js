require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.method !== 'GET' ? req.body : undefined,
    query: Object.keys(req.query).length ? req.query : undefined
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send({ message: 'Internal server error', error: err.message });
});

// Database connection and sync
async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync without force to preserve data
    await db.sequelize.sync({ force: false });
    console.log('Database synchronized');    
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
}

// Start server function
async function startServer() {
  await initializeDatabase();
  const PORT = process.env.PORT || 3000;
  return app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Only start the server if we're not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export for testing
module.exports = { app, initializeDatabase };
