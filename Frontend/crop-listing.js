// Global Variables
let currentUser = {
    name: "राहुल पाटील",
    location: "पुणे, महाराष्ट्र",
    profileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Q0FGNTIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA3LjEgMTQgNkMxNCA0LjkgMTMuMSA0IDEyIDRDMTAuOSA0IDEwIDQuOSAxMCA2QzEwIDcuMSAxMC45IDggMTIgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxNEM4LjEzIDE0IDUgMTYuMTMgNSAyMEg3QzcgMTcuMjQgOS4yNCAxNSAxMiAxNUMxNC43NiAxNSAxNyAxNy4yNCAxNyAyMEgxOUMxOSAxNi4xMyAxNS44NyAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K"
};

let uploadedPhoto = null;
let cropData = {};
let iotSensorData = {
    optimal: { temperature: 18, humidity: 65, quality: "उत्कृष्ट" },
    good: { temperature: 20, humidity: 70, quality: "चांगली" },
    warning: { temperature: 23, humidity: 75, quality: "साधारण" },
    critical: { temperature: 26, humidity: 80, quality: "खराब" },
    "no-sensor": { temperature: "--", humidity: "--", quality: "माहिती नाही" }
};

// DOM Elements
const cropListingForm = document.getElementById('cropListingForm');
const cropPhotoInput = document.getElementById('cropPhoto');
const photoUploadArea = document.getElementById('photoUploadArea');
const photoPreview = document.getElementById('photoPreview');
const previewImage = document.getElementById('previewImage');
const removePhotoBtn = document.getElementById('removePhoto');
const storageStatusSelect = document.getElementById('storageStatus');
const iotStatusDisplay = document.getElementById('iotStatusDisplay');
const confirmationModal = document.getElementById('confirmationModal');
const toast = document.getElementById('toast');

// Load current user from localStorage
function loadCurrentUser() {
    const userData = localStorage.getItem('agrochain-user');
    const currentUserLogin = localStorage.getItem('agrochain-current-user');
    
    if (userData) {
        currentUser = JSON.parse(userData);
    } else if (currentUserLogin) {
        // Fallback to basic user info if full user data not available
        currentUser = {
            name: currentUserLogin,
            location: "पुणे, महाराष्ट्र",
            profileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Q0FGNTIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA3LjEgMTQgNkMxNCA0LjkgMTMuMSA0IDEyIDRDMTAgNCAxMCA0LjkgMTAgNkMxMCA3LjEgMTAuOSA4IDEyIDhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMyAxNCA1IDE2LjEzIDUgMjBIN0M3IDE3LjI0IDkuMjQgMTUgMTIgMTVDMTQuNzYgMTUgMTcgMTcuMjQgMTcgMjBIMTlDMTkgMTYuMTMgMTUuODcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+Cg=="
        };
    } else {
        // Default user for testing
        currentUser = {
            name: "राहुल पाटील",
            location: "पुणे, महाराष्ट्र",
            profileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Q0FGNTIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA3LjEgMTQgNkMxNCA0LjkgMTMuMSA0IDEyIDRDMTAgNCAxMCA0LjkgMTAgNkMxMCA3LjEgMTAuOSA4IDEyIDhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMyAxNCA1IDE2LjEzIDUgMjBIN0M3IDE3LjI0IDkuMjQgMTUgMTIgMTVDMTQuNzYgMTUgMTcgMTcuMjQgMTcgMjBIMTlDMTkgMTYuMTMgMTUuODcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+Cg=="
        };
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    initializeForm();
    setupEventListeners();
    setDefaultDates();
    loadUserLocation();
});

// Initialize form with default values
function initializeForm() {
    // Set current date as default for harvest date
    const today = new Date();
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    
    document.getElementById('harvestDate').max = maxDate.toISOString().split('T')[0];
    document.getElementById('harvestDate').min = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 days ago
}

// Setup all event listeners
function setupEventListeners() {
    // Photo upload
    photoUploadArea.addEventListener('click', () => cropPhotoInput.click());
    cropPhotoInput.addEventListener('change', handlePhotoUpload);
    removePhotoBtn.addEventListener('click', removePhoto);

    // Storage status change
    storageStatusSelect.addEventListener('change', handleStorageStatusChange);

    // Form submission
    cropListingForm.addEventListener('submit', handleFormSubmit);

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeConfirmationModal);
    document.getElementById('addAnotherCrop').addEventListener('click', addAnotherCrop);
    document.getElementById('goToDashboard').addEventListener('click', goToDashboard);

    // Location button
    document.getElementById('getLocation').addEventListener('click', getCurrentLocation);

    // Real-time validation
    setupRealTimeValidation();
}

// Set default dates
function setDefaultDates() {
    const today = new Date();
    const harvestDate = today.toISOString().split('T')[0];
    document.getElementById('harvestDate').value = harvestDate;
}

// Load user's saved location
function loadUserLocation() {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        document.getElementById('location').value = savedLocation;
    }
}

// Handle photo upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showToast('कृपया JPG, PNG किंवा WebP स्वरूपातील फोटो अपलोड करा', 'error');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showToast('फोटोचा आकार 5MB पेक्षा कमी असावा', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedPhoto = e.target.result;
        previewImage.src = uploadedPhoto;
        photoUploadArea.style.display = 'none';
        photoPreview.style.display = 'block';
        showToast('फोटो यशस्वीरित्या अपलोड झाला', 'success');
    };
    reader.readAsDataURL(file);
}

// Remove uploaded photo
function removePhoto() {
    uploadedPhoto = null;
    cropPhotoInput.value = '';
    photoPreview.style.display = 'none';
    photoUploadArea.style.display = 'block';
    showToast('फोटो काढून टाकला', 'info');
}

// Handle storage status change
function handleStorageStatusChange(event) {
    const selectedStatus = event.target.value;
    
    if (selectedStatus && selectedStatus !== 'no-sensor') {
        const sensorData = iotSensorData[selectedStatus];
        
        document.getElementById('temperature').textContent = sensorData.temperature;
        document.getElementById('humidity').textContent = sensorData.humidity;
        document.getElementById('quality').textContent = sensorData.quality;
        
        iotStatusDisplay.style.display = 'block';
        
        // Update status color based on selection
        updateIOTStatusColor(selectedStatus);
    } else {
        iotStatusDisplay.style.display = 'none';
    }
}

// Update IoT status display color
function updateIOTStatusColor(status) {
    const statusDisplay = document.getElementById('iotStatusDisplay');
    
    // Remove previous status classes
    statusDisplay.classList.remove('status-optimal', 'status-good', 'status-warning', 'status-critical');
    
    // Add appropriate status class
    if (status === 'optimal') {
        statusDisplay.classList.add('status-optimal');
        statusDisplay.style.borderLeftColor = '#27ae60';
    } else if (status === 'good') {
        statusDisplay.classList.add('status-good');
        statusDisplay.style.borderLeftColor = '#3498db';
    } else if (status === 'warning') {
        statusDisplay.classList.add('status-warning');
        statusDisplay.style.borderLeftColor = '#f39c12';
    } else if (status === 'critical') {
        statusDisplay.classList.add('status-critical');
        statusDisplay.style.borderLeftColor = '#e74c3c';
    }
}

// Get current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('तुमच्या ब्राउजरमध्ये लोकेशन सपोर्ट नाही', 'error');
        return;
    }

    showToast('तुमचे स्थान मिळवत आहे...', 'info');

    navigator.geolocation.getCurrentPosition(
        function(position) {
            // In a real app, you would reverse geocode these coordinates
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // For demo purposes, we'll use a default location
            const locationText = `पुणे, महाराष्ट्र (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
            document.getElementById('location').value = locationText;
            
            // Save to localStorage
            localStorage.setItem('userLocation', locationText);
            
            showToast('स्थान यशस्वीरित्या मिळवले', 'success');
        },
        function(error) {
            let errorMessage = 'स्थान मिळवता आले नाही';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'स्थान परवानगी नाकारली';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'स्थान उपलब्ध नाही';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'स्थान मिळवण्यात वेळ लागला';
                    break;
            }
            
            showToast(errorMessage, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// Setup real-time validation
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Remove previous validation classes
    field.classList.remove('error', 'success');
    
    // Basic validation rules
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'हे फील्ड आवश्यक आहे';
    } else if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (numValue <= 0) {
            isValid = false;
            errorMessage = 'मूल्य 0 पेक्षा जास्त असावे';
        }
    } else if (field.id === 'pricePerKg' && value) {
        const price = parseFloat(value);
        if (price < 1 || price > 1000) {
            isValid = false;
            errorMessage = 'किंमत ₹1 ते ₹1000 दरम्यान असावी';
        }
    } else if (field.id === 'quantity' && value) {
        const quantity = parseFloat(value);
        if (quantity < 1 || quantity > 10000) {
            isValid = false;
            errorMessage = 'प्रमाण 1 ते 10000 दरम्यान असावे';
        }
    } else if (field.id === 'harvestDate' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        if (selectedDate > maxDate) {
            isValid = false;
            errorMessage = 'काढणीची तारीख 30 दिवसांपेक्षा जास्त नसावी';
        }
        
        if (selectedDate < new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
            isValid = false;
            errorMessage = 'काढणीची तारीख 7 दिवसांपेक्षा जुनी नसावी';
        }
    }
    
    // Apply validation classes
    if (isValid && value) {
        field.classList.add('success');
    } else if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Clear field error
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    // Remove error message if exists
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
        showToast('कृपया सर्व आवश्यक फील्ड भरा', 'error');
        return;
    }
    
    // Check if photo is uploaded
    if (!uploadedPhoto) {
        showToast('कृपया पिकाचा फोटो अपलोड करा', 'error');
        return;
    }
    
    // Collect form data
    collectFormData();
    
    // Show loading state
    showLoadingState();
    
    try {
        // Get authentication token
        const token = localStorage.getItem('agrochain-token') || sessionStorage.getItem('agrochain-token');
        if (!token) {
            throw new Error('Authentication required. Please login again.');
        }
        
        // Prepare data for API
        const cropDataForAPI = {
            name: cropData.cropName,
            description: cropData.additionalDetails || `${cropData.cropNameMarathi} - ${cropData.quantity} ${cropData.unitMarathi}`,
            quantity: parseFloat(cropData.quantity),
            unit: cropData.unit,
            price: parseFloat(cropData.pricePerKg),
            location: cropData.location,
            harvestDate: cropData.harvestDate,
            images: [cropData.photo], // Store base64 image
            quality: 'B', // Default quality
            organic: false, // Default to non-organic
            status: 'available'
        };
        
        // Make API call to save crop
        const API_URL = 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/marketplace/crops`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cropDataForAPI)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save crop listing');
        }
        
        const result = await response.json();
        
        hideLoadingState();
        showConfirmationModal();
        resetForm();
        
        // Also save to localStorage as backup
        saveCropListing();
        
        showToast('पिक यशस्वीरित्या सूचीबद्ध झाले!', 'success');
        
    } catch (error) {
        hideLoadingState();
        console.error('Error saving crop:', error);
        showToast(`त्रुटी: ${error.message}`, 'error');
        
        // Fallback to localStorage if API fails
        showConfirmationModal();
        resetForm();
        saveCropListing();
    }
}

// Validate entire form
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Collect form data
function collectFormData() {
    cropData = {
        cropName: document.getElementById('cropName').value,
        cropNameMarathi: document.getElementById('cropName').options[document.getElementById('cropName').selectedIndex].text,
        quantity: document.getElementById('quantity').value,
        unit: document.getElementById('unit').value,
        unitMarathi: document.getElementById('unit').options[document.getElementById('unit').selectedIndex].text,
        pricePerKg: document.getElementById('pricePerKg').value,
        location: document.getElementById('location').value,
        harvestDate: document.getElementById('harvestDate').value,
        storageStatus: document.getElementById('storageStatus').value,
        additionalDetails: document.getElementById('additionalDetails').value,
        photo: uploadedPhoto,
        listedDate: new Date().toISOString().split('T')[0],
        farmerName: currentUser.name
    };
    
    // Add IoT sensor data if available
    if (cropData.storageStatus && cropData.storageStatus !== 'no-sensor') {
        const sensorData = iotSensorData[cropData.storageStatus];
        cropData.sensorData = sensorData;
    }
}

// Show loading state
function showLoadingState() {
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> सूचीबद्ध करत आहे...';
}

// Hide loading state
function hideLoadingState() {
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'पिके सूचीबद्ध करा';
}

// Show confirmation modal
function showConfirmationModal() {
    const confirmationDetails = document.getElementById('confirmationDetails');
    
    // Populate confirmation details
    confirmationDetails.innerHTML = `
        <div class="confirmation-item">
            <strong>पिक:</strong> ${cropData.cropNameMarathi}
        </div>
        <div class="confirmation-item">
            <strong>प्रमाण:</strong> ${cropData.quantity} ${cropData.unitMarathi}
        </div>
        <div class="confirmation-item">
            <strong>किंमत:</strong> ₹${cropData.pricePerKg}/किलो
        </div>
        <div class="confirmation-item">
            <strong>स्थान:</strong> ${cropData.location}
        </div>
        <div class="confirmation-item">
            <strong>काढणी तारीख:</strong> ${formatDate(cropData.harvestDate)}
        </div>
        ${cropData.storageStatus ? `<div class="confirmation-item"><strong>साठवण स्थिती:</strong> ${document.getElementById('storageStatus').options[document.getElementById('storageStatus').selectedIndex].text}</div>` : ''}
    `;
    
    confirmationModal.style.display = 'block';
    
    // Save to localStorage (in a real app, this would be an API call)
    saveCropListing();
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.style.display = 'none';
}

// Add another crop
function addAnotherCrop() {
    closeConfirmationModal();
    // Form is already reset, just show success message
    showToast('नवीन पिक सूचीबद्ध करण्यासाठी फॉर्म तयार आहे', 'success');
}

// Go to dashboard
function goToDashboard() {
    // Save any draft data
    saveDraftData();
    
    // Navigate to dashboard
    window.location.href = 'farmer-dashboard.html';
}

// Reset form
function resetForm() {
    cropListingForm.reset();
    uploadedPhoto = null;
    photoPreview.style.display = 'none';
    photoUploadArea.style.display = 'block';
    iotStatusDisplay.style.display = 'none';
    
    // Clear validation classes
    document.querySelectorAll('.form-input, .form-select').forEach(field => {
        field.classList.remove('error', 'success');
    });
    
    // Remove error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    
    // Reset dates
    setDefaultDates();
}

// Save crop listing to localStorage
function saveCropListing() {
    let cropListings = JSON.parse(localStorage.getItem('cropListings') || '[]');
    
    // Add unique ID
    cropData.id = 'crop_' + Date.now();
    cropData.status = 'active';
    cropData.views = 0;
    cropData.inquiries = 0;
    
    cropListings.unshift(cropData); // Add to beginning
    
    // Keep only last 50 listings
    if (cropListings.length > 50) {
        cropListings = cropListings.slice(0, 50);
    }
    
    localStorage.setItem('cropListings', JSON.stringify(cropListings));
    
    // Also save to recent activity
    saveToRecentActivity(cropData);
}

// Save to recent activity
function saveToRecentActivity(cropData) {
    let recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    
    const activity = {
        id: 'activity_' + Date.now(),
        type: 'crop_listed',
        title: `${cropData.cropNameMarathi} सूचीबद्ध`,
        description: `${cropData.quantity} ${cropData.unitMarathi} ₹${cropData.pricePerKg}/किलो`,
        date: new Date().toISOString(),
        status: 'success'
    };
    
    recentActivity.unshift(activity);
    
    // Keep only last 20 activities
    if (recentActivity.length > 20) {
        recentActivity = recentActivity.slice(0, 20);
    }
    
    localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
}

// Save draft data
function saveDraftData() {
    const formData = new FormData(cropListingForm);
    const draftData = {};
    
    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }
    
    if (uploadedPhoto) {
        draftData.photo = uploadedPhoto;
    }
    
    localStorage.setItem('cropListingDraft', JSON.stringify(draftData));
}

// Load draft data
function loadDraftData() {
    const draftData = localStorage.getItem('cropListingDraft');
    if (draftData) {
        const data = JSON.parse(draftData);
        
        // Populate form fields
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field && key !== 'photo') {
                field.value = data[key];
            }
        });
        
        // Handle photo
        if (data.photo) {
            uploadedPhoto = data.photo;
            previewImage.src = uploadedPhoto;
            photoUploadArea.style.display = 'none';
            photoPreview.style.display = 'block';
        }
        
        // Handle storage status
        if (data.storageStatus) {
            document.getElementById('storageStatus').value = data.storageStatus;
            handleStorageStatusChange({ target: { value: data.storageStatus } });
        }
        
        showToast('ड्राफ्ट डेटा लोड केला', 'info');
    }
}

// Utility Functions
function showToast(message, type = 'info') {
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set icon based on type
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'warning') icon = '⚠️';
    
    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    
    // Remove previous classes
    toast.classList.remove('success', 'error', 'info', 'warning');
    toast.classList.add(type);
    
    // Show toast
    toast.style.display = 'flex';
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('mr-IN', options);
}

// Auto-save functionality
let autoSaveTimer;
function setupAutoSave() {
    // Clear existing timer
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
    }
    
    // Set new timer for 30 seconds
    autoSaveTimer = setTimeout(() => {
        saveDraftData();
        showToast('ड्राफ्ट स्वयंचलितपणे जतन केला', 'info');
    }, 30000); // 30 seconds
}

// Add auto-save to form inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('input', setupAutoSave);
        input.addEventListener('change', setupAutoSave);
    });
});

// Load draft on page load
window.addEventListener('load', function() {
    setTimeout(loadDraftData, 1000); // Load after 1 second
});

// Handle browser back button
window.addEventListener('beforeunload', function(event) {
    // Save draft before leaving
    saveDraftData();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + S for save draft
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveDraftData();
        showToast('ड्राफ्ट जतन केला', 'success');
    }
    
    // Escape to close modal
    if (event.key === 'Escape') {
        if (confirmationModal.style.display === 'block') {
            closeConfirmationModal();
        }
    }
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .confirmation-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid #e0e6ed;
    }
    
    .confirmation-item:last-child {
        border-bottom: none;
    }
    
    .status-optimal { background-color: #d4edda; }
    .status-good { background-color: #d1ecf1; }
    .status-warning { background-color: #fff3cd; }
    .status-critical { background-color: #f8d7da; }
`;
document.head.appendChild(style);