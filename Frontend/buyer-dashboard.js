// Buyer Dashboard JavaScript

// Global Variables
let currentUser = {
    name: "राजेश शर्मा",
    role: "खरेदीदार",
    profileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyMTk2RjMiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDMwSDMwVjI1QzMwIDIyIDI4IDIwIDI1IDIwSDE1QzEyIDIwIDEwIDIyIDEwIDI1VjMwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
    cart: [],
    notifications: [],
    orders: [],
    favorites: []
};

let allCrops = [];
let filteredCrops = [];
let currentFilters = {
    search: '',
    minPrice: 0,
    maxPrice: 500,
    freshness: ['today', 'yesterday'],
    certifications: [],
    traceability: 'full',
    location: '',
    category: '',
    sortBy: 'relevance'
};

let currentView = 'grid';
let currentPage = 1;
const itemsPerPage = 12;

// Sample Crop Data
const sampleCrops = [
    {
        id: 1,
        name: "ताजी टोमॅटो",
        category: "vegetables",
        price: 25,
        quantity: 500,
        unit: "kg",
        location: "पुणे",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZjFmOGUxIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9Ijc1IiByPSI0MCIgZmlsbD0iI2ZmNjM0NyIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIxNSIgZmlsbD0iI2ZmODA0NyIvPgo8Y2lyY2xlIGN4PSIxMjAiIGN5PSI2MCIgcj0iMTUiIGZpbGw9IiNmZjgwNDciLz4KPHN2Zz4K",
        seller: {
            name: "शिवाजी पाटील",
            rating: 4.8,
            location: "पुणे",
            verified: true
        },
        freshness: "today",
        certifications: ["organic", "gap"],
        traceability: "full",
        description: "100% जैविक टोमॅटो, आजच्या सकाळी काढलेली",
        features: ["organic", "fresh"]
    },
    {
        id: 2,
        name: "गोड संत्री",
        category: "fruits",
        price: 45,
        quantity: 200,
        unit: "kg",
        location: "नाशिक",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZmZmM2UwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9Ijc1IiByPSIzNSIgZmlsbD0iI2ZmOTgwMCIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjY1IiByPSI4IiBmaWxsPSIjZmZmZmZmIi8+CjxjaXJjbGUgY3g9IjExMCIgY3k9IjY1IiByPSI4IiBmaWxsPSIjZmZmZmZmIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjkwIiByPSIxMiIgZmlsbD0iI2ZmNjM0NyIvPgo8L3N2Zz4K",
        seller: {
            name: "मनीषा देशमुख",
            rating: 4.6,
            location: "नाशिक",
            verified: true
        },
        freshness: "yesterday",
        certifications: ["fssai"],
        traceability: "full",
        description: "रसाळ आणि गोड संत्री, थेट फार्ममधून",
        features: ["sweet", "fresh"]
    }
];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadSampleData();
    applyFilters();
});

function initializeDashboard() {
    // Initialize user info
    updateUserInfo();
    
    // Initialize cart
    updateCartDisplay();
    
    // Initialize notifications
    loadNotifications();
    
    // Initialize filters
    initializeFilters();
    
    // Show welcome message
    showToast('स्वागत आहे, ' + currentUser.name + '!', 'success');
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            currentFilters.search = this.value.toLowerCase();
            applyFilters();
        }, 300));
    }
    
    // Filter toggle
    const filterToggle = document.getElementById('filterToggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', toggleFiltersSidebar);
    }
    
    // Cart functionality
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCartSidebar);
    }
    
    // Notification functionality
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotificationDropdown);
    }
    
    // View toggle
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    if (gridView) {
        gridView.addEventListener('click', () => setView('grid'));
    }
    if (listView) {
        listView.addEventListener('click', () => setView('list'));
    }
    
    // Sort functionality
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            currentFilters.sortBy = this.value;
            applyFilters();
        });
    }
    
    // Filter controls
    setupFilterListeners();
    
    // Quick actions
    setupQuickActionListeners();
    
    // Modal controls
    setupModalListeners();
    
    // Overlay click
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closeAllSidebars);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllSidebars();
            closeAllModals();
        }
    });
}

function setupFilterListeners() {
    // Price range sliders
    const minPriceRange = document.getElementById('minPriceRange');
    const maxPriceRange = document.getElementById('maxPriceRange');
    
    if (minPriceRange && maxPriceRange) {
        minPriceRange.addEventListener('input', updatePriceRange);
        maxPriceRange.addEventListener('input', updatePriceRange);
    }
    
    // Filter checkboxes
    const freshnessCheckboxes = document.querySelectorAll('input[name="freshness"]');
    const certificationCheckboxes = document.querySelectorAll('input[name="certifications"]');
    const locationSelect = document.getElementById('locationFilter');
    const categorySelect = document.getElementById('categoryFilter');
    
    freshnessCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    certificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    if (locationSelect) {
        locationSelect.addEventListener('change', applyFilters);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', applyFilters);
    }
    
    // Filter actions
    const clearFilters = document.getElementById('clearFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAllFilters);
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
}

function setupQuickActionListeners() {
    const myOrdersBtn = document.getElementById('myOrdersBtn');
    const paymentHistoryBtn = document.getElementById('paymentHistoryBtn');
    const savedSearchesBtn = document.getElementById('savedSearchesBtn');
    const compareBtn = document.getElementById('compareBtn');
    
    if (myOrdersBtn) {
        myOrdersBtn.addEventListener('click', () => {
            showToast('माझ्या ऑर्डर पृष्ठावर नेव्हिगेट करीत आहे...', 'info');
            // Navigate to orders page
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 1000);
        });
    }
    
    if (paymentHistoryBtn) {
        paymentHistoryBtn.addEventListener('click', () => {
            showToast('पेमेंट इतिहास पृष्ठावर नेव्हिगेट करीत आहे...', 'info');
            // Navigate to payment history page
            setTimeout(() => {
                window.location.href = 'payment-history.html';
            }, 1000);
        });
    }
    
    if (savedSearchesBtn) {
        savedSearchesBtn.addEventListener('click', () => {
            showToast('जतन केलेल्या शोध पृष्ठावर नेव्हिगेट करीत आहे...', 'info');
            // Navigate to saved searches page
            setTimeout(() => {
                window.location.href = 'saved-searches.html';
            }, 1000);
        });
    }
    
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            showToast('तुलना सुविधा लवकरच येत आहे...', 'info');
        });
    }
}

function setupModalListeners() {
    // Close modal buttons
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Buy now form
    const buyForm = document.getElementById('buyForm');
    if (buyForm) {
        buyForm.addEventListener('submit', handleBuyNow);
    }
    
    // Negotiate form
    const negotiateForm = document.getElementById('negotiateForm');
    if (negotiateForm) {
        negotiateForm.addEventListener('submit', handleNegotiatePrice);
    }
    
    // Quantity change handlers
    const quantity = document.getElementById('quantity');
    if (quantity) {
        quantity.addEventListener('input', updateTotalPrice);
    }
}

// Sample Data Loading
function loadSampleData() {
    allCrops = [...sampleCrops];
    filteredCrops = [...allCrops];
    
    // Add some sample notifications
    currentUser.notifications = [
        {
            id: 1,
            type: 'bid',
            title: 'नवीन बिड',
            message: 'तुमच्या टोमॅटोवर नवीन बिड आली आहे',
            time: '५ मिनिटांपूर्वी',
            read: false
        },
        {
            id: 2,
            type: 'price',
            title: 'किंमत अपडेट',
            message: 'टोमॅटोच्या किंमतीत घट झाली आहे',
            time: '१ तासापूर्वी',
            read: false
        }
    ];
    
    updateNotificationDisplay();
}

// Search and Filter Functions
function applyFilters() {
    // Collect filter values
    collectFilterValues();
    
    // Apply filters
    filteredCrops = allCrops.filter(crop => {
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const matchesSearch = crop.name.toLowerCase().includes(searchTerm) ||
                                crop.category.toLowerCase().includes(searchTerm) ||
                                crop.location.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
        
        // Price filter
        if (crop.price < currentFilters.minPrice || crop.price > currentFilters.maxPrice) {
            return false;
        }
        
        // Location filter
        if (currentFilters.location && crop.location !== currentFilters.location) {
            return false;
        }
        
        // Category filter
        if (currentFilters.category && crop.category !== currentFilters.category) {
            return false;
        }
        
        return true;
    });
    
    // Apply sorting
    applySorting();
    
    // Update display
    updateCropDisplay();
    updateResultsInfo();
}

function collectFilterValues() {
    // Freshness
    const freshnessCheckboxes = document.querySelectorAll('input[name="freshness"]:checked');
    currentFilters.freshness = Array.from(freshnessCheckboxes).map(cb => cb.value);
    
    // Certifications
    const certificationCheckboxes = document.querySelectorAll('input[name="certifications"]:checked');
    currentFilters.certifications = Array.from(certificationCheckboxes).map(cb => cb.value);
    
    // Location and Category
    const locationSelect = document.getElementById('locationFilter');
    const categorySelect = document.getElementById('categoryFilter');
    
    if (locationSelect) currentFilters.location = locationSelect.value;
    if (categorySelect) currentFilters.category = categorySelect.value;
}

function applySorting() {
    switch (currentFilters.sortBy) {
        case 'price-low':
            filteredCrops.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCrops.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredCrops.sort((a, b) => b.seller.rating - a.seller.rating);
            break;
        default: // relevance
            break;
    }
}

function updateCropDisplay() {
    const cropGrid = document.getElementById('cropGrid');
    if (!cropGrid) return;
    
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const cropsToShow = filteredCrops.slice(startIndex, endIndex);
    
    cropGrid.innerHTML = '';
    
    if (cropsToShow.length === 0) {
        cropGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>कोणतीही पिके सापडली नाहीत</h3>
                <p>कृपया तुमचे फिल्टर्स बदला किंवा शोध शब्द बदला.</p>
            </div>
        `;
        return;
    }
    
    cropsToShow.forEach(crop => {
        const cropCard = createCropCard(crop);
        cropGrid.appendChild(cropCard);
    });
}

function createCropCard(crop) {
    const card = document.createElement('div');
    card.className = 'crop-card';
    card.dataset.cropId = crop.id;
    
    const isInCart = currentUser.cart.some(item => item.id === crop.id);
    
    card.innerHTML = `
        <div class="crop-badge ${crop.features[0] || 'fresh'}">${getFeatureLabel(crop.features[0])}</div>
        <img src="${crop.image}" alt="${crop.name}" class="crop-image">
        <div class="crop-content">
            <div class="crop-header">
                <h3 class="crop-name">${crop.name}</h3>
                <span class="crop-category">${getCategoryLabel(crop.category)}</span>
            </div>
            <div class="crop-details">
                <div class="crop-price">₹${crop.price}/${crop.unit}</div>
                <div class="crop-quantity">उपलब्ध: ${crop.quantity} ${crop.unit}</div>
                <div class="crop-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${crop.location}
                </div>
            </div>
            <div class="crop-features">
                ${crop.features.map(feature => `<span class="feature-tag">${getFeatureLabel(feature)}</span>`).join('')}
            </div>
            <div class="seller-info">
                <div class="seller-avatar">${crop.seller.name.charAt(0)}</div>
                <div class="seller-details">
                    <div class="seller-name">${crop.seller.name}</div>
                    <div class="seller-rating">
                        <span class="rating-stars">${getStarRating(crop.seller.rating)}</span>
                        <span>${crop.seller.rating}</span>
                        <span>(${getRandomReviewCount()} समीक्षा)</span>
                    </div>
                </div>
            </div>
            <div class="crop-actions">
                <button class="action-btn btn-buy" onclick="openBuyNowModal(${crop.id})">
                    <i class="fas fa-shopping-cart"></i>
                    आता खरेदी करा
                </button>
                <button class="action-btn btn-negotiate" onclick="openNegotiateModal(${crop.id})">
                    <i class="fas fa-handshake"></i>
                    किंमत चर्चा करा
                </button>
                <button class="action-btn btn-cart ${isInCart ? 'added' : ''}" onclick="toggleCartItem(${crop.id})">
                    <i class="fas fa-${isInCart ? 'check' : 'plus'}"></i>
                    ${isInCart ? 'कार्टमध्ये आहे' : 'कार्टमध्ये जोडा'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getCategoryLabel(category) {
    const labels = {
        'vegetables': 'भाजीपाला',
        'fruits': 'फळे',
        'grains': 'धान्य',
        'spices': 'मसाले',
        'pulses': 'कडधान्य'
    };
    return labels[category] || category;
}

function getFeatureLabel(feature) {
    const labels = {
        'organic': 'जैविक',
        'fresh': 'ताजे',
        'sweet': 'गोड',
        'spicy': 'तिखट',
        'premium': 'प्रीमियम',
        'nutritious': 'पोषणमूल्य',
        'pure': 'शुद्ध',
        'medicinal': 'औषधी'
    };
    return labels[feature] || feature;
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '☆';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

function getRandomReviewCount() {
    return Math.floor(Math.random() * 50) + 10;
}

// UI Update Functions
function updateUserInfo() {
    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userName) userName.textContent = currentUser.name;
    if (userRole) userRole.textContent = currentUser.role;
    if (userAvatar) userAvatar.src = currentUser.profileImage;
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = currentUser.cart.length;
    }
    
    const total = currentUser.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = `₹${total}`;
    }
}

function updateNotificationDisplay() {
    const notificationBadge = document.getElementById('notificationBadge');
    
    if (notificationBadge) {
        const unreadCount = currentUser.notifications.filter(n => !n.read).length;
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function updateResultsInfo() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${filteredCrops.length} पिके सापडली`;
    }
}

// Sidebar and Modal Functions
function toggleFiltersSidebar() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    const overlay = document.getElementById('overlay');
    
    if (filtersSidebar && overlay) {
        filtersSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function toggleCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function toggleNotificationDropdown() {
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (notificationDropdown) {
        notificationDropdown.classList.toggle('active');
    }
}

function closeAllSidebars() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    const cartSidebar = document.getElementById('cartSidebar');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const overlay = document.getElementById('overlay');
    
    if (filtersSidebar) filtersSidebar.classList.remove('active');
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (notificationDropdown) notificationDropdown.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
}

// Filter Functions
function updatePriceRange() {
    const minPriceRange = document.getElementById('minPriceRange');
    const maxPriceRange = document.getElementById('maxPriceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const minPriceDisplay = document.getElementById('minPriceDisplay');
    const maxPriceDisplay = document.getElementById('maxPriceDisplay');
    
    if (minPriceRange && maxPriceRange && minPrice && maxPrice && minPriceDisplay && maxPriceDisplay) {
        let minVal = parseInt(minPriceRange.value);
        let maxVal = parseInt(maxPriceRange.value);
        
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
        }
        
        currentFilters.minPrice = minVal;
        currentFilters.maxPrice = maxVal;
        
        minPrice.value = minVal;
        maxPrice.value = maxVal;
        minPriceRange.value = minVal;
        maxPriceRange.value = maxVal;
        
        minPriceDisplay.textContent = minVal;
        maxPriceDisplay.textContent = maxVal;
        
        applyFilters();
    }
}

function clearAllFilters() {
    // Reset filter values
    currentFilters = {
        search: '',
        minPrice: 0,
        maxPrice: 500,
        freshness: ['today', 'yesterday'],
        certifications: [],
        traceability: 'full',
        location: '',
        category: '',
        sortBy: 'relevance'
    };
    
    // Reset UI elements
    document.getElementById('searchInput').value = '';
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 500;
    document.getElementById('minPriceRange').value = 0;
    document.getElementById('maxPriceRange').value = 500;
    document.getElementById('minPriceDisplay').textContent = 0;
    document.getElementById('maxPriceDisplay').textContent = 500;
    document.getElementById('locationFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortBy').value = 'relevance';
    
    applyFilters();
    showToast('सर्व फिल्टर्स साफ केले', 'info');
}

// View Functions
function setView(viewType) {
    currentView = viewType;
    const cropGrid = document.getElementById('cropGrid');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    
    if (cropGrid) {
        cropGrid.className = viewType === 'grid' ? 'crop-grid' : 'crop-grid list-view';
    }
    
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.classList.toggle('active', viewType === 'grid');
        listViewBtn.classList.toggle('active', viewType === 'list');
    }
    
    applyFilters();
}

// Cart Functions
function toggleCartItem(cropId) {
    const crop = allCrops.find(c => c.id === cropId);
    if (!crop) return;
    
    const existingItem = currentUser.cart.find(item => item.id === cropId);
    
    if (existingItem) {
        // Remove from cart
        currentUser.cart = currentUser.cart.filter(item => item.id !== cropId);
        showToast(`${crop.name} कार्टमधून काढले`, 'info');
    } else {
        // Add to cart
        currentUser.cart.push({
            ...crop,
            quantity: 1
        });
        showToast(`${crop.name} कार्टमध्ये जोडले`, 'success');
    }
    
    updateCartDisplay();
    updateCropDisplay(); // Refresh to update button states
}

// Modal Functions
function openBuyNowModal(cropId) {
    const crop = allCrops.find(c => c.id === cropId);
    if (!crop) return;
    
    const modal = document.getElementById('buyNowModal');
    const modalCropImage = document.getElementById('modalCropImage');
    const modalCropName = document.getElementById('modalCropName');
    const modalCropSeller = document.getElementById('modalCropSeller');
    const modalCropPrice = document.getElementById('modalCropPrice');
    const quantity = document.getElementById('quantity');
    
    if (modal && modalCropImage && modalCropName && modalCropSeller && modalCropPrice && quantity) {
        modalCropImage.src = crop.image;
        modalCropName.textContent = crop.name;
        modalCropSeller.textContent = `विक्रेता: ${crop.seller.name}`;
        modalCropPrice.textContent = `किंमत: ₹${crop.price}/${crop.unit}`;
        quantity.max = crop.quantity;
        quantity.value = 1;
        
        modal.dataset.cropId = cropId; // Store crop ID for form submission
        modal.classList.add('active');
        
        updateTotalPrice();
    }
}

function openNegotiateModal(cropId) {
    const crop = allCrops.find(c => c.id === cropId);
    if (!crop) return;
    
    const modal = document.getElementById('negotiateModal');
    const currentPrice = document.getElementById('currentPrice');
    const offeredPrice = document.getElementById('offeredPrice');
    const negotiateQuantity = document.getElementById('negotiateQuantity');
    
    if (modal && currentPrice && offeredPrice && negotiateQuantity) {
        currentPrice.textContent = `₹${crop.price}/${crop.unit}`;
        offeredPrice.value = Math.floor(crop.price * 0.9); // Suggest 10% less
        negotiateQuantity.max = crop.quantity;
        negotiateQuantity.value = 1;
        
        modal.dataset.cropId = cropId; // Store crop ID for form submission
        modal.classList.add('active');
    }
}

function updateTotalPrice() {
    const quantity = document.getElementById('quantity');
    const totalPrice = document.getElementById('totalPrice');
    const modal = document.getElementById('buyNowModal');
    const cropId = parseInt(modal.dataset.cropId);
    const currentCrop = allCrops.find(c => c.id === cropId);
    
    if (quantity && totalPrice && currentCrop) {
        const total = currentCrop.price * parseInt(quantity.value || 0);
        totalPrice.textContent = `₹${total}`;
    }
}

function handleBuyNow(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const quantity = parseInt(formData.get('quantity'));
    const deliveryDate = formData.get('deliveryDate');
    const deliveryLocation = formData.get('deliveryLocation');
    const modal = document.getElementById('buyNowModal');
    const cropId = parseInt(modal.dataset.cropId);
    const crop = allCrops.find(c => c.id === cropId);
    
    if (!crop) return;
    
    // Create order
    const order = {
        id: Date.now(),
        cropId: cropId,
        cropName: crop.name,
        quantity: quantity,
        price: crop.price,
        total: crop.price * quantity,
        deliveryDate: deliveryDate,
        deliveryLocation: deliveryLocation,
        status: 'pending',
        orderDate: new Date().toISOString(),
        seller: crop.seller
    };
    
    currentUser.orders.push(order);
    
    // Remove from cart if exists
    currentUser.cart = currentUser.cart.filter(item => item.id !== cropId);
    
    closeAllModals();
    updateCartDisplay();
    updateCropDisplay();
    
    showToast(`ऑर्डर यशस्वीरित्या ठेवली! ऑर्डर क्रमांक: #${order.id}`, 'success');
    
    // Reset form
    form.reset();
}

function handleNegotiatePrice(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const offeredPrice = parseFloat(formData.get('offeredPrice'));
    const quantity = parseInt(formData.get('quantity'));
    const message = formData.get('message');
    const modal = document.getElementById('negotiateModal');
    const cropId = parseInt(modal.dataset.cropId);
    const crop = allCrops.find(c => c.id === cropId);
    
    if (!crop) return;
    
    // Create negotiation request
    const negotiation = {
        id: Date.now(),
        cropId: cropId,
        cropName: crop.name,
        offeredPrice: offeredPrice,
        quantity: quantity,
        message: message,
        status: 'pending',
        createdDate: new Date().toISOString(),
        seller: crop.seller
    };
    
    // Add to notifications
    currentUser.notifications.unshift({
        id: Date.now(),
        type: 'negotiation',
        title: 'किंमत चर्चा पाठवली',
        message: `${crop.name} साठी ₹${offeredPrice} ची ऑफर पाठवली`,
        time: 'आत्ताच',
        read: false
    });
    
    closeAllModals();
    updateNotificationDisplay();
    
    showToast(`किंमत चर्चा पाठवली! विक्रेत्याचा प्रतिसाद प्रतीक्षेत आहे`, 'success');
    
    // Reset form
    form.reset();
}

// Notification Functions
function markNotificationAsRead(notificationId) {
    const notification = currentUser.notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        updateNotificationDisplay();
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to container or body
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Initialize filters
function initializeFilters() {
    // Set default filter values
    currentFilters.freshness = ['today', 'yesterday'];
    currentFilters.traceability = 'full';
    currentFilters.minPrice = 0;
    currentFilters.maxPrice = 500;
}

// Cart Functions
function updateCartQuantity(cropId, newQuantity) {
    const cartItem = currentUser.cart.find(item => item.id === cropId);
    if (cartItem) {
        cartItem.quantity = Math.max(1, parseInt(newQuantity) || 1);
        updateCartDisplay();
        updateCartTotal();
        showToast('कार्ट अद्ययावत केले', 'success');
    }
}

function removeCartItem(cropId) {
    currentUser.cart = currentUser.cart.filter(item => item.id !== cropId);
    updateCartDisplay();
    updateCartTotal();
    showToast('वस्तू कार्टमधून काढली', 'success');
}

function toggleCartItem(cropId) {
    const existingItem = currentUser.cart.find(item => item.id === cropId);
    const crop = allCrops.find(c => c.id === cropId);
    
    if (!crop) return;
    
    if (existingItem) {
        currentUser.cart = currentUser.cart.filter(item => item.id !== cropId);
        showToast('कार्टमधून काढले', 'info');
    } else {
        currentUser.cart.push({
            id: cropId,
            name: crop.name,
            price: crop.price,
            quantity: 1,
            image: crop.image,
            seller: crop.seller
        });
        showToast('कार्टमध्ये जोडले', 'success');
    }
    
    updateCartDisplay();
    updateCartTotal();
}

function updateCartTotal() {
    const total = currentUser.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = `₹${total}`;
    }
}

// Load notifications
function loadNotifications() {
    updateNotificationDisplay();
}

// Global functions for HTML onclick handlers
window.toggleCartItem = toggleCartItem;
window.openBuyNowModal = openBuyNowModal;
window.openNegotiateModal = openNegotiateModal;
window.updateCartQuantity = updateCartQuantity;
window.removeCartItem = removeCartItem;
window.markNotificationAsRead = markNotificationAsRead;