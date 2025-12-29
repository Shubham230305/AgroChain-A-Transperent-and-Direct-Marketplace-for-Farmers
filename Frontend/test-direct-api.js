const axios = require('axios');

// Test user data with unique email and phone
const testUser = {
  name: 'Final Test User',
  email: `final-test-${Date.now()}@example.com`,
  phone: `98765${Math.floor(10000 + Math.random() * 90000)}`,
  password: 'password123',
  aadhaar: '123456789012',
  role: 'farmer'
};

// Direct API test with axios
async function testDirectAPI() {
  try {
    console.log('Testing direct API connection to http://localhost:5000/api/auth/register');
    
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/api/auth/register',
      headers: { 'Content-Type': 'application/json' },
      data: testUser
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', response.data);
    
    if (response.status === 201 || response.status === 200) {
      console.log('✅ SUCCESS: User registration API working correctly!');
    } else {
      console.log('❌ ERROR: Unexpected response status:', response.status);
    }
  } catch (error) {
    console.log('❌ ERROR: API test failed');
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received from server');
    } else {
      // Something happened in setting up the request
      console.log('Error message:', error.message);
    }
  }
}

// Run the test
testDirectAPI();