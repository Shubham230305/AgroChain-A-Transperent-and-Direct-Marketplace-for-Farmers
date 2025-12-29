const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./backend/config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./backend/routes/authRoutes');
const farmerRoutes = require('./backend/routes/farmerRoutes');
const buyerRoutes = require('./backend/routes/buyerRoutes');
const marketplaceRoutes = require('./backend/routes/marketplaceRoutes');
const paymentRoutes = require('./backend/routes/paymentRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connection established successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentRoutes);

// Serve frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});