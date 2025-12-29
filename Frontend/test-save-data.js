const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./backend/config/db');

// Load environment variables
dotenv.config();

// Define a simple test schema
const TestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Test = mongoose.model('Test', TestSchema);

async function runTest() {
  try {
    // Connect to the database
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Create a test document
    const testData = new Test({
      name: 'test_entry',
      value: 'This is a test value ' + Date.now()
    });
    
    // Save the document
    const savedData = await testData.save();
    console.log('✅ Data saved successfully:');
    console.log(savedData);
    
    // Verify we can retrieve the data
    const retrievedData = await Test.findById(savedData._id);
    console.log('✅ Data retrieved successfully:');
    console.log(retrievedData);
    
    console.log('Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during test:');
    console.error(error);
    process.exit(1);
  }
}

runTest();