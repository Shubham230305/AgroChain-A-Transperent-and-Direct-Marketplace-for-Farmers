// Test script to verify crop listing API functionality
const axios = require('axios');

const API_URL = 'http://localhost:3001';

// Test data for crop creation
const testCropData = {
    name: 'Test Onion',
    description: 'Fresh onions from local farm',
    quantity: 50,
    unit: 'kg',
    price: 25,
    location: 'Pune, Maharashtra',
    harvestDate: '2024-01-15',
    images: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='],
    quality: 'A',
    organic: true,
    status: 'available'
};

async function testCropAPI() {
    try {
        console.log('Testing crop listing API...');
        
        // First, test login to get token
        console.log('1. Testing login...');
        const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
            loginInput: 'direct-test@example.com',
            password: 'password123'
        });
        
        if (loginResponse.data.success) {
            const token = loginResponse.data.token;
            console.log('✓ Login successful, token received');
            
            // Test crop creation
            console.log('2. Testing crop creation...');
            const cropResponse = await axios.post(
                `${API_URL}/api/marketplace/crops`,
                testCropData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (cropResponse.data.success) {
                console.log('✓ Crop created successfully');
                console.log('Crop ID:', cropResponse.data.data._id);
                console.log('Crop details:', cropResponse.data.data);
            } else {
                console.log('✗ Crop creation failed:', cropResponse.data.message);
            }
            
            // Test getting all crops
            console.log('3. Testing get all crops...');
            const getCropsResponse = await axios.get(`${API_URL}/api/marketplace/crops`);
            
            if (getCropsResponse.data.success) {
                console.log('✓ Retrieved crops successfully');
                console.log('Total crops:', getCropsResponse.data.count);
                console.log('Crops:', getCropsResponse.data.data);
            } else {
                console.log('✗ Failed to retrieve crops:', getCropsResponse.data.message);
            }
            
        } else {
            console.log('✗ Login failed:', loginResponse.data.message);
        }
        
    } catch (error) {
        console.error('API test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run the test
testCropAPI();