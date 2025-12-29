// Main Dashboard JavaScript

// Global Variables
let currentModule = 'dashboard';
let isSidebarCollapsed = false;
let activeIframe = null;
let notifications = [
    {
        id: 1,
        type: 'success',
        title: 'New Crop Listed',
        message: 'Your wheat crop has been successfully listed',
        time: '2 minutes ago',
        read: false,
        icon: 'fa-leaf'
    },
    {
        id: 2,
        type: 'info',
        title: 'Payment Received',
        message: '₹15,000 received for rice transaction',
        time: '1 hour ago',
        read: false,
        icon: 'fa-coins'
    },
    {
        id: 3,
        type: 'warning',
        title: 'Cooperative Update',
        message: 'New member joined your cooperative',
        time: '3 hours ago',
        read: true,
        icon: 'fa-handshake'
    }
];

// Module Configuration
const modules = {
    'dashboard': {
        title: 'AgroChain Dashboard',
        breadcrumb: ['Home', 'Dashboard'],
        url: null,
        description: 'Main dashboard with overview'
    },
    'crop-listing': {
        title: 'Crop Listing',
        breadcrumb: ['Modules', 'Crop Listing'],
        url: 'crop-listing.html',
        description: 'Manage and list your crops'
    },
    'blockchain-payments': {
        title: 'Blockchain Payments',
        breadcrumb: ['Modules', 'Blockchain Payments'],
        url: 'blockchain-payments.html',
        description: 'Secure payment processing'
    },
    'iot-traceability': {
        title: 'IoT Traceability',
        breadcrumb: ['Modules', 'IoT Traceability'],
        url: 'iot-traceability.html',
        description: 'Track crops with IoT sensors'
    },
    'market-forecast': {
        title: 'Market Forecast',
        breadcrumb: ['Modules', 'Market Forecast'],
        url: 'market-forecast.html',
        description: 'AI-powered market insights'
    },
    'cooperative-marketplace': {
        title: 'Cooperative Marketplace',
        breadcrumb: ['Modules', 'Cooperative Marketplace'],
        url: 'cooperative-marketplace.html',
        description: 'Join farmer cooperatives'
    },
    'analytics-reports': {
        title: 'Analytics & Reports',
        breadcrumb: ['Modules', 'Analytics & Reports'],
        url: 'analytics-reports.html',
        description: 'Comprehensive analytics'
    },
    'support-feedback': {
        title: 'Support & Feedback',
        breadcrumb: ['Modules', 'Support & Feedback'],
        url: 'support-feedback.html',
        description: 'Get help and provide feedback'
    }
};

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const menuItems = document.querySelectorAll('.menu-item');
const moduleCards = document.querySelectorAll('.module-card');
const moduleButtons = document.querySelectorAll('.module-btn');
const currentModuleTitle = document.getElementById('currentModuleTitle');
const breadcrumb = document.getElementById('breadcrumb');
const moduleContainer = document.getElementById('moduleContainer');
const moduleIframeContainer = document.getElementById('moduleIframeContainer');
const globalSearch = document.getElementById('globalSearch');
const notificationBtn = document.getElementById('notificationBtn');
const quickActionsBtn = document.getElementById('quickActionsBtn');
const notificationBadge = document.getElementById('notificationBadge');
const notificationsPanel = document.getElementById('notificationsPanel');
const quickActionsPanel = document.getElementById('quickActionsPanel');
const closeNotifications = document.getElementById('closeNotifications');
const closeQuickActions = document.getElementById('closeQuickActions');
const loadingOverlay = document.getElementById('loadingOverlay');
const themeToggle = document.getElementById('themeToggle');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    updateNotifications();
    loadTheme();
});

function initializeDashboard() {
    // Set initial module
    setModule('dashboard');
    
    // Update notification badge
    updateNotificationBadge();
    
    // Initialize tooltips and animations
    initializeAnimations();
}

function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const module = this.dataset.module;
            if (module) {
                setModule(module);
            }
        });
    });
    
    // Module cards
    moduleCards.forEach(card => {
        card.addEventListener('click', function() {
            const module = this.dataset.module;
            if (module) {
                setModule(module);
            }
        });
    });
    
    // Module buttons
    moduleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.module-card');
            const module = card.dataset.module;
            if (module) {
                setModule(module);
            }
        });
    });
    
    // Global search
    globalSearch.addEventListener('input', handleGlobalSearch);
    globalSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // Panels
    notificationBtn.addEventListener('click', toggleNotificationsPanel);
    quickActionsBtn.addEventListener('click', toggleQuickActionsPanel);
    closeNotifications.addEventListener('click', closeNotificationsPanel);
    closeQuickActions.addEventListener('click', closeQuickActionsPanel);
    
    // Theme toggle
    themeToggle.addEventListener('change', toggleTheme);
    
    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.notifications-panel') && !e.target.closest('#notificationBtn')) {
            closeNotificationsPanel();
        }
        if (!e.target.closest('.quick-actions-panel') && !e.target.closest('#quickActionsBtn')) {
            closeQuickActionsPanel();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'b':
                    e.preventDefault();
                    toggleSidebar();
                    break;
                case 'k':
                    e.preventDefault();
                    globalSearch.focus();
                    break;
                case 'n':
                    e.preventDefault();
                    toggleNotificationsPanel();
                    break;
                case 'q':
                    e.preventDefault();
                    toggleQuickActionsPanel();
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeAllPanels();
                    if (currentModule !== 'dashboard') {
                        setModule('dashboard');
                    }
                    break;
            }
        }
    });
    
    // Mobile sidebar handling
    handleMobileSidebar();
    
    // Window resize handling
    window.addEventListener('resize', handleResize);
}

// Module Management
function setModule(moduleName) {
    if (!modules[moduleName]) return;
    
    showLoading();
    
    setTimeout(() => {
        currentModule = moduleName;
        const module = modules[moduleName];
        
        // Update UI
        updateActiveMenuItem(moduleName);
        updateTitle(module.title);
        updateBreadcrumb(module.breadcrumb);
        
        // Load module content
        if (moduleName === 'dashboard') {
            showDashboard();
        } else {
            loadModuleInIframe(module.url, moduleName);
        }
        
        hideLoading();
    }, 300);
}

function updateActiveMenuItem(moduleName) {
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.module === moduleName) {
            item.classList.add('active');
        }
    });
}

function updateTitle(title) {
    currentModuleTitle.textContent = title;
    document.title = `${title} - AgroChain`;
}

function updateBreadcrumb(breadcrumbItems) {
    breadcrumb.innerHTML = breadcrumbItems.map((item, index) => {
        if (index === breadcrumbItems.length - 1) {
            return `<span>${item}</span>`;
        }
        return `<span>${item}</span><i class="fas fa-chevron-right"></i>`;
    }).join('');
}

function showDashboard() {
    // Hide iframe container
    moduleIframeContainer.classList.remove('active');
    
    // Show dashboard content
    document.querySelectorAll('.module-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('dashboard-module').classList.add('active');
    
    // Update URL without reload
    history.pushState({ module: 'dashboard' }, '', '#dashboard');
}

function loadModuleInIframe(url, moduleName) {
    // Hide dashboard content
    document.querySelectorAll('.module-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove existing iframe
    if (activeIframe) {
        activeIframe.remove();
    }
    
    // Create new iframe
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'module-iframe';
    iframe.id = `iframe-${moduleName}`;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-module-btn';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => setModule('dashboard');
    
    // Clear container and add new elements
    moduleIframeContainer.innerHTML = '';
    moduleIframeContainer.appendChild(closeBtn);
    moduleIframeContainer.appendChild(iframe);
    
    // Show iframe container
    moduleIframeContainer.classList.add('active');
    
    // Update active iframe reference
    activeIframe = iframe;
    
    // Update URL
    history.pushState({ module: moduleName }, '', `#${moduleName}`);
    
    // Handle iframe load events
    iframe.addEventListener('load', function() {
        hideLoading();
        // Add custom styling to iframe content if needed
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
                // You can inject custom CSS or scripts here if needed
                console.log(`Module ${moduleName} loaded successfully`);
            }
        } catch (e) {
            console.log(`Module ${moduleName} loaded (cross-origin restrictions apply)`);
        }
    });
    
    iframe.addEventListener('error', function() {
        hideLoading();
        showToast(`Failed to load module: ${moduleName}`, 'error');
    });
}

// Sidebar Functions
function toggleSidebar() {
    isSidebarCollapsed = !isSidebarCollapsed;
    sidebar.classList.toggle('collapsed', isSidebarCollapsed);
    
    // Save preference
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
}

function handleMobileSidebar() {
    // Add mobile-specific sidebar handling
    const mediaQuery = window.matchMedia('(max-width: 576px)');
    
    function handleMobileChange(e) {
        if (e.matches) {
            // Mobile mode - sidebar is hidden by default
            sidebar.classList.add('mobile-hidden');
            
            // Add overlay for mobile sidebar
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                display: none;
            `;
            document.body.appendChild(overlay);
            
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
                overlay.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
            });
            
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
                overlay.style.display = 'none';
            });
        }
    }
    
    mediaQuery.addListener(handleMobileChange);
    handleMobileChange(mediaQuery);
}

// Search Functions
function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) return;
    
    // Search through modules
    const searchResults = Object.keys(modules).filter(moduleName => {
        const module = modules[moduleName];
        return module.title.toLowerCase().includes(query) || 
               module.description.toLowerCase().includes(query);
    });
    
    // You could show search results in a dropdown here
    console.log('Search results:', searchResults);
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Implement search functionality
    showToast(`Searching for: "${query}"`, 'info');
    
    // You could implement a search results page or module
    setTimeout(() => {
        showToast(`Found results for "${query}"`, 'success');
    }, 1000);
}

// Notification Functions
function updateNotifications() {
    const unreadCount = notifications.filter(n => !n.read).length;
    notificationBadge.textContent = unreadCount;
    notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    
    renderNotifications();
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    notificationBadge.textContent = unreadCount;
    notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

function renderNotifications() {
    const notificationList = notificationsPanel.querySelector('.notification-list');
    if (!notificationList) return;
    
    notificationList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${!notification.read ? 'unread' : ''}" data-id="${notification.id}">
            <div class="notification-icon">
                <i class="fas ${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
        </div>
    `).join('');
    
    // Add click handlers to mark as read
    notificationList.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            markNotificationAsRead(id);
        });
    });
}

function markNotificationAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
        notification.read = true;
        updateNotifications();
        showToast('Notification marked as read', 'success');
    }
}

function toggleNotificationsPanel() {
    const isOpen = notificationsPanel.classList.contains('active');
    closeAllPanels();
    if (!isOpen) {
        notificationsPanel.classList.add('active');
    }
}

function closeNotificationsPanel() {
    notificationsPanel.classList.remove('active');
}

// Quick Actions Functions
function toggleQuickActionsPanel() {
    const isOpen = quickActionsPanel.classList.contains('active');
    closeAllPanels();
    if (!isOpen) {
        quickActionsPanel.classList.add('active');
    }
}

function closeQuickActionsPanel() {
    quickActionsPanel.classList.remove('active');
}

function closeAllPanels() {
    closeNotificationsPanel();
    closeQuickActionsPanel();
}

// Theme Functions
function toggleTheme() {
    const isDark = themeToggle.checked;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update iframe themes if loaded
    if (activeIframe) {
        try {
            const iframeDoc = activeIframe.contentDocument || activeIframe.contentWindow.document;
            if (iframeDoc) {
                iframeDoc.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            }
        } catch (e) {
            console.log('Could not update iframe theme (cross-origin restrictions)');
        }
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeToggle.checked = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Utility Functions
function showLoading(message = 'Loading module...') {
    const spinner = loadingOverlay.querySelector('.loading-spinner p');
    spinner.textContent = message;
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast ${type}`;
    toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getToastColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 3000;
        max-width: 300px;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    toastContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Animate in
    setTimeout(() => {
        toastContainer.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toastContainer.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toastContainer.parentElement) {
                toastContainer.remove();
            }
        }, 300);
    }, duration);
}

function getToastColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function initializeAnimations() {
    // Add stagger animation to cards
    const cards = document.querySelectorAll('.stat-card, .module-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function handleResize() {
    // Handle responsive behavior
    const width = window.innerWidth;
    
    if (!sidebar) return; // Add null check
    
    if (width <= 576) {
        // Mobile mode
        if (!sidebar.classList.contains('mobile-hidden')) {
            sidebar.classList.add('mobile-hidden');
        }
    } else {
        // Desktop mode
        sidebar.classList.remove('mobile-hidden');
        sidebar.classList.remove('mobile-open');
        
        // Remove mobile overlay if exists
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

// Service Worker Registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.module) {
        setModule(e.state.module);
    } else {
        setModule('dashboard');
    }
});

// Auto-refresh functionality
setInterval(function() {
    // Update stats, notifications, etc.
    updateNotificationBadge();
    
    // You could also refresh module data here
    if (currentModule !== 'dashboard') {
        // Refresh current module if needed
        console.log('Auto-refresh: checking for updates...');
    }
}, 30000); // Refresh every 30 seconds

// Quick Action Functions
function quickAction(actionType) {
    showLoading('Processing action...');
    
    setTimeout(() => {
        hideLoading();
        
        switch(actionType) {
            case 'add-crop':
                setModule('crop-listing');
                showToast('Opening Crop Listing module...', 'info');
                break;
                
            case 'view-reports':
                setModule('analytics-reports');
                showToast('Opening Analytics & Reports...', 'info');
                break;
                
            case 'market-insights':
                setModule('market-forecast');
                showToast('Opening Market Forecast...', 'info');
                break;
                
            case 'payment-history':
                setModule('blockchain-payments');
                showToast('Opening Blockchain Payments...', 'info');
                break;
                
            case 'trace-crop':
                setModule('iot-traceability');
                showToast('Opening IoT Traceability...', 'info');
                break;
                
            case 'cooperative':
                setModule('cooperative-marketplace');
                showToast('Opening Cooperative Marketplace...', 'info');
                break;
                
            default:
                showToast('Action not implemented yet', 'warning');
        }
    }, 500);
}

// Export functions for global access
window.AgroChainDashboard = {
    setModule,
    showToast,
    showLoading,
    hideLoading,
    updateNotifications,
    quickAction
};