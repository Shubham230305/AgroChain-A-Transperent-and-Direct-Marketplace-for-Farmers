// Test script to directly test the API endpoint
const axios = require('axios');

async function testRegisterAPI() {
  const testUser = {
    name: 'Test User Direct',
    email: 'test-direct@example.com',
    phone: '9876543211',
    password: 'password123',
    aadhaar: '123456789013',
    role: 'farmer'
  };

  console.log('Sending test user data to API...');
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.success) {
      console.log('✅ API test successful! User registered.');
    } else {
      console.log('❌ API test failed:', response.data.message);
    }
  } catch (error) {
    console.error('Error testing API:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testRegisterAPI();