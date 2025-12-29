require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrochain';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Test direct signup
const testDirectSignup = async () => {
  try {
    // Test user data
    const testUser = {
      name: 'Direct Test User',
      email: 'direct-test@example.com',
      phone: '9876543212',
      password: 'password123',
      aadhaar: '123456789014',
      role: 'farmer'
    };

    // Check if test user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Test user already exists, deleting...');
      await User.deleteOne({ email: testUser.email });
      console.log('Test user deleted.');
    }

    // Create new test user directly in the database
    const user = await User.create(testUser);
    console.log('Test user created successfully:');
    console.log({
      name: user.name,
      email: user.email,
      phone: user.phone,
      aadhaar: user.aadhaar,
      role: user.role
    });

    // Verify user was saved to database
    const savedUser = await User.findOne({ email: testUser.email });
    if (savedUser) {
      console.log('✅ Direct signup successful! User saved to database.');
    } else {
      console.log('❌ Direct signup failed! User not found in database.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error testing direct signup: ${error.message}`);
    process.exit(1);
  }
};

// Run the test
connectDB().then(() => {
  console.log('Running direct signup test...');
  testDirectSignup();
});