const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');

// Load environment variables
dotenv.config();

console.log('Testing MongoDB connection...');
console.log(`Attempting to connect to: ${process.env.MONGODB_URI}`);

// Test the connection
connectDB()
  .then((conn) => {
    console.log('✅ MongoDB connection successful!');
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed!');
    console.error('Error details:', err.message);
    process.exit(1);
  });