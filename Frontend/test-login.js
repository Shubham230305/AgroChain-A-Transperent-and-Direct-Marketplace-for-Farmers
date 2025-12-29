const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./backend/config/db');
const User = require('./backend/models/User');

// Load environment variables
dotenv.config();

async function testLogin() {
  try {
    // Connect to the database
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Create a test user
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    // Check if test user already exists
    let testUser = await User.findOne({ email: testEmail });
    
    if (!testUser) {
      console.log('Creating test user...');
      // Create a new test user using the User model (which will hash the password)
      testUser = await User.create({
        name: 'Test User',
        email: testEmail,
        phone: '1234567890',
        password: testPassword,
        role: 'buyer'
      });
      console.log('✅ Test user created successfully');
    } else {
      console.log('✅ Test user already exists');
    }
    
    // Simulate login request
    console.log('Testing login with credentials:', { loginInput: testEmail, password: testPassword });
    
    // Find the user
    const user = await User.findOne({
      $or: [{ email: testEmail }, { phone: testEmail }]
    }).select('+password');
    
    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }
    
    // Check password using the model's method
    const isMatch = await user.matchPassword(testPassword);
    
    if (isMatch) {
      console.log('✅ Login successful!');
      console.log('User details:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      console.error('❌ Password does not match');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during test:');
    console.error(error);
    process.exit(1);
  }
}

testLogin();