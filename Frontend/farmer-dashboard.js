// Enhanced Farmer Dashboard JavaScript

// Global variables
let currentUser = null;
let notifications = [];
let marketPrices = [];
let dashboardData = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadDashboardData();
    loadNotifications();
    loadMarketPrices();
    
    // Auto refresh every 30 seconds
    setInterval(() => {
        loadNotifications();
        loadMarketPrices();
    }, 30000);
});

// Initialize dashboard
function initializeDashboard() {
    // Load user data from localStorage
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'राम पाटील',
        email: 'ram.patil@agrochain.com',
        phone: '+91 9876543210',
        walletBalance: 25480,
        profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Q0FGNTIiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDMwSDMwVjI1QzMwIDIyIDI4IDIwIDI1IDIwSDE1QzEyIDIwIDEwIDIyIDEwIDI1VjMwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+'
    };
    
    updateUserInfo();
    updateWalletBalance();
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    
    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
    
    // Action cards
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function() {
            const action = this.dataset.action;
            handleActionCard(action);
        });
    });
    
    // Notification system
    const notificationBtn = document.querySelector('.notification-btn');
    const markAllRead = document.querySelector('.mark-all-read');
    
    if (notificationBtn) notificationBtn.addEventListener('click', toggleNotifications);
    if (markAllRead) markAllRead.addEventListener('click', markAllNotificationsRead);
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Sidebar menu items
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleSidebarNavigation(this.dataset.page);
        });
    });
    
    // Form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // User profile dropdown
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) userProfile.addEventListener('click', toggleUserDropdown);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Update menu toggle icon
    const menuToggle = document.querySelector('.menu-toggle i');
    if (sidebar.classList.contains('active')) {
        menuToggle.classList.remove('fa-bars');
        menuToggle.classList.add('fa-times');
    } else {
        menuToggle.classList.remove('fa-times');
        menuToggle.classList.add('fa-bars');
    }
}

// Update user information
function updateUserInfo() {
    if (currentUser) {
        document.querySelector('.user-name').textContent = currentUser.name;
        document.querySelector('.user-role').textContent = 'कृषी उत्पादक';
        document.querySelector('.sidebar-profile h3').textContent = currentUser.name;
        document.querySelector('.sidebar-profile p').textContent = currentUser.phone;
        
        if (currentUser.profileImage) {
            document.querySelector('.user-avatar').src = currentUser.profileImage;
            document.querySelector('.profile-img').src = currentUser.profileImage;
        }
    }
}

// Update wallet balance
function updateWalletBalance() {
    if (currentUser) {
        document.querySelector('.wallet-amount').textContent = `₹${currentUser.walletBalance.toLocaleString()}`;
    }
}

// Handle action card clicks
function handleActionCard(action) {
    switch(action) {
        case 'list-crop':
            showListCropModal();
            break;
        case 'market-prices':
            showMarketPrices();
            break;
        case 'view-buyers':
            showBuyersList();
            break;
        case 'track-orders':
            showOrdersTracking();
            break;
    }
}

// Show list crop modal
function showListCropModal() {
    const modal = document.getElementById('listCropModal');
    modal.style.display = 'block';
    
    // Add animation
    setTimeout(() => {
        modal.querySelector('.modal-content').style.animation = 'modalSlideIn 0.3s ease';
    }, 10);
}

// Show market prices
function showMarketPrices() {
    const section = document.querySelector('.market-prices-section');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
    
    // Add loading animation
    const cards = section.querySelectorAll('.forecast-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        }, index * 100);
    });
}

// Show buyers list
function showBuyersList() {
    // Simulate loading buyers
    showNotification('info', 'खरेदीदार शोधत आहे...', 'आपल्या शेतमालासाठी योग्य खरेदीदार शोधत आहोत');
    
    setTimeout(() => {
        showNotification('success', '५ खरेदीदार सापडले', 'ताजे भाजीपाला खरेदीदार तयार आहेत');
    }, 2000);
}

// Show orders tracking
function showOrdersTracking() {
    showNotification('info', 'ऑर्डर ट्रॅकिंग', 'आपल्या सर्व ऑर्डरची माहिती लोड होत आहे');
    
    // Update recent activity
    addActivity('order', 'ऑर्डर #1234 साठी ट्रॅकिंग माहिती पाहिली');
}

// Load dashboard data
function loadDashboardData() {
    // Simulate API call
    dashboardData = {
        totalCrops: 12,
        activeListings: 5,
        totalOrders: 28,
        pendingPayments: 3,
        recentActivities: [
            { type: 'sale', message: 'टोमॅटोची विक्री झाली - ₹1,200', time: '2 तासांपूर्वी' },
            { type: 'order', message: 'नवीन ऑर्डर मिळाली - भोपळा', time: '4 तासांपूर्वी' },
            { type: 'payment', message: 'पैसे जमा झाले - ₹2,500', time: '1 दिवसांपूर्वी' }
        ]
    };
    
    updateStats();
    updateRecentActivity();
}

// Update statistics
function updateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = dashboardData.totalCrops;
        statNumbers[1].textContent = dashboardData.activeListings;
        statNumbers[2].textContent = dashboardData.totalOrders;
        statNumbers[3].textContent = dashboardData.pendingPayments;
    }
}

// Update recent activity
function updateRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = '';
    
    dashboardData.recentActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.appendChild(activityItem);
    });
}

// Create activity item
function createActivityItem(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    
    const iconClass = getActivityIcon(activity.type);
    const iconColor = getActivityIconColor(activity.type);
    
    div.innerHTML = `
        <div class="activity-icon ${iconColor}">
            <i class="${iconClass}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.message}</h4>
            <p class="activity-time">${activity.time}</p>
        </div>
    `;
    
    return div;
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        sale: 'fas fa-shopping-cart',
        order: 'fas fa-box',
        payment: 'fas fa-rupee-sign',
        crop: 'fas fa-seedling',
        notification: 'fas fa-bell'
    };
    return icons[type] || 'fas fa-info-circle';
}

// Get activity icon color
function getActivityIconColor(type) {
    const colors = {
        sale: 'success',
        order: 'info',
        payment: 'success',
        crop: 'success',
        notification: 'warning'
    };
    return colors[type] || 'info';
}

// Add activity
function addActivity(type, message) {
    const activity = {
        type: type,
        message: message,
        time: 'आत्ता'
    };
    
    const activityList = document.querySelector('.activity-list');
    const activityItem = createActivityItem(activity);
    
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Remove old activities if more than 5
    const activities = activityList.querySelectorAll('.activity-item');
    if (activities.length > 5) {
        activities[activities.length - 1].remove();
    }
}

// Load notifications
function loadNotifications() {
    // Simulate API call
    notifications = [
        {
            id: 1,
            type: 'bid',
            title: 'नवीन बिड',
            message: 'टोमॅटोसाठी ₹45/kg दराने बिड आली आहे',
            time: '5 मिनिटांपूर्वी',
            unread: true
        },
        {
            id: 2,
            type: 'payment',
            title: 'पैसे जमा झाले',
            message: '₹2,500 आपल्या वॉलेटमध्ये जमा झाले',
            time: '1 तासांपूर्वी',
            unread: true
        },
        {
            id: 3,
            type: 'price',
            title: 'भाव वाढला',
            message: 'भोपळ्याचा भाव ₹2/kg ने वाढला',
            time: '2 तासांपूर्वी',
            unread: false
        }
    ];
    
    updateNotificationUI();
}

// Update notification UI
function updateNotificationUI() {
    const notificationList = document.querySelector('.notification-list');
    const notificationBadge = document.querySelector('.notification-badge');
    
    notificationList.innerHTML = '';
    
    const unreadCount = notifications.filter(n => n.unread).length;
    
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = 'block';
    } else {
        notificationBadge.style.display = 'none';
    }
    
    notifications.forEach(notification => {
        const notificationItem = createNotificationItem(notification);
        notificationList.appendChild(notificationItem);
    });
}

// Create notification item
function createNotificationItem(notification) {
    const div = document.createElement('div');
    div.className = `notification-item ${notification.unread ? 'unread' : ''}`;
    div.dataset.id = notification.id;
    
    const iconClass = getNotificationIcon(notification.type);
    
    div.innerHTML = `
        <div class="notification-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification-content">
            <p>${notification.message}</p>
            <div class="notification-time">${notification.time}</div>
        </div>
    `;
    
    div.addEventListener('click', () => markNotificationRead(notification.id));
    
    return div;
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        bid: 'fas fa-hand-paper',
        payment: 'fas fa-rupee-sign',
        price: 'fas fa-chart-line',
        order: 'fas fa-box',
        crop: 'fas fa-seedling'
    };
    return icons[type] || 'fas fa-info-circle';
}

// Toggle notifications dropdown
function toggleNotifications() {
    const dropdown = document.querySelector('.notification-dropdown');
    dropdown.classList.toggle('active');
    
    // Close if clicking outside
    if (dropdown.classList.contains('active')) {
        setTimeout(() => {
            document.addEventListener('click', closeNotificationsOnClickOutside);
        }, 100);
    }
}

// Close notifications on click outside
function closeNotificationsOnClickOutside(e) {
    const dropdown = document.querySelector('.notification-dropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (!dropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        dropdown.classList.remove('active');
        document.removeEventListener('click', closeNotificationsOnClickOutside);
    }
}

// Mark notification as read
function markNotificationRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.unread = false;
        updateNotificationUI();
    }
}

// Mark all notifications as read
function markAllNotificationsRead() {
    notifications.forEach(notification => {
        notification.unread = false;
    });
    updateNotificationUI();
}

// Show notification
function showNotification(type, title, message) {
    const notification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: 'आत्ता',
        unread: true
    };
    
    notifications.unshift(notification);
    updateNotificationUI();
    
    // Show toast notification
    showToast(type, message);
}

// Show toast notification
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Load market prices
function loadMarketPrices() {
    // Simulate API call with AI predictions
    marketPrices = [
        {
            crop: 'टोमॅटो',
            currentPrice: 45,
            predictedPrice: 52,
            trend: 'up',
            confidence: 85
        },
        {
            crop: 'भोपळा',
            currentPrice: 32,
            predictedPrice: 28,
            trend: 'down',
            confidence: 72
        },
        {
            crop: 'कांदा',
            currentPrice: 38,
            predictedPrice: 42,
            trend: 'up',
            confidence: 78
        }
    ];
    
    updateMarketPricesUI();
}

// Update market prices UI
function updateMarketPricesUI() {
    const forecastGrid = document.querySelector('.price-forecast-grid');
    forecastGrid.innerHTML = '';
    
    marketPrices.forEach(price => {
        const forecastCard = createForecastCard(price);
        forecastGrid.appendChild(forecastCard);
    });
}

// Create forecast card
function createForecastCard(price) {
    const div = document.createElement('div');
    div.className = 'forecast-card';
    
    const trendIcon = price.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
    const trendColor = price.trend === 'up' ? 'positive' : 'negative';
    const trendText = price.trend === 'up' ? 'वाढण्याची शक्यता' : 'कमी होण्याची शक्यता';
    
    div.innerHTML = `
        <div class="crop-info">
            <div class="crop-icon">🌱</div>
            <div>
                <h4>${price.crop}</h4>
                <div class="current-price">सध्याचा भाव: ₹${price.currentPrice}/kg</div>
            </div>
        </div>
        <div class="price-trend">
            <div class="prediction ${trendColor}">
                <i class="fas ${trendIcon}"></i>
                ₹${Math.abs(price.predictedPrice - price.currentPrice)}/kg ${trendText}
            </div>
        </div>
        <div class="forecast-prediction">
            <small>AI अंदाज - ${price.confidence}% खात्री</small>
        </div>
    `;
    
    return div;
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        // Simulate search
        showNotification('info', 'शोध सुरू आहे', `"${searchTerm}" साठी निकाल शोधत आहोत`);
        
        setTimeout(() => {
            showNotification('success', 'शोध पूर्ण झाला', `${Math.floor(Math.random() * 10) + 1} निकाल सापडले`);
        }, 1500);
    }
}

// Handle sidebar navigation
function handleSidebarNavigation(page) {
    toggleSidebar();
    
    switch(page) {
        case 'dashboard':
            // Already on dashboard
            break;
        case 'crops':
            showNotification('info', 'पिके', 'आपली सर्व पिके दाखवत आहे');
            break;
        case 'market':
            showMarketPrices();
            break;
        case 'orders':
            showOrdersTracking();
            break;
        case 'buyers':
            showBuyersList();
            break;
        case 'analytics':
            showNotification('info', 'अॅनालिटिक्स', 'आपल्या शेतीचा अहेतवादी अहवाल');
            break;
        case 'settings':
            showNotification('info', 'सेटिंग्ज', 'सेटिंग्ज पृष्ठ उघडत आहे');
            break;
        case 'help':
            showNotification('info', 'मदत', 'मदत आणि समर्थन पृष्ठ');
            break;
        case 'logout':
            handleLogout();
            break;
    }
}

// Handle form submissions
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Simulate form processing
    showNotification('info', 'प्रक्रिया सुरू आहे', 'आपली माहिती प्रक्रिया होत आहे');
    
    setTimeout(() => {
        showNotification('success', 'यशस्वी', 'ऑपरेशन यशस्वीरित्या पूर्ण झाले');
        closeModal();
        form.reset();
    }, 2000);
}

// Close modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Toggle user dropdown
function toggleUserDropdown() {
    // Simulate user dropdown
    showNotification('info', 'वापरकर्ता प्रोफाइल', 'प्रोफाइल सेटिंग्ज उघडत आहे');
}

// Handle logout
function handleLogout() {
    if (confirm('आपण निश्चितपणे लॉगआउट करू इच्छिता?')) {
        localStorage.removeItem('currentUser');
        showNotification('success', 'लॉगआउट', 'यशस्वीरित्या लॉगआउट झाले');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + M for menu
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleSidebar();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
        document.querySelector('.notification-dropdown').classList.remove('active');
    }
    
    // Ctrl/Cmd + / for search
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.querySelector('.search-bar input').focus();
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('mr-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('mr-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('mr-IN', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Add CSS for toast notifications
const toastStyles = `
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    color: #333;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 3000;
    transform: translateX(400px);
    transition: all 0.3s ease;
    border-left: 4px solid #4CAF50;
}

.toast.show {
    transform: translateX(0);
}

.toast-success {
    border-left-color: #4CAF50;
}

.toast-error {
    border-left-color: #f44336;
}

.toast-info {
    border-left-color: #2196F3;
}

.toast-warning {
    border-left-color: #FF9800;
}

.toast i {
    font-size: 16px;
}

.toast-success i {
    color: #4CAF50;
}

.toast-error i {
    color: #f44336;
}

.toast-info i {
    color: #2196F3;
}

.toast-warning i {
    color: #FF9800;
}
`;

// Add toast styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);