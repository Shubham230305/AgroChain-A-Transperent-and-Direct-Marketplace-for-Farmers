// Cooperative Marketplace JavaScript

// Global Variables
let cooperatives = [];
let bulkListings = [];
let leaderboardData = [];
let chatMessages = [];
let currentUser = {
    id: 'user_001',
    name: 'Rajesh Kumar',
    type: 'buyer', // 'buyer' or 'farmer'
    cooperatives: ['coop_001', 'coop_002']
};

let currentChatGroup = 'general';
let selectedListing = null;
let isLoading = false;

// Utility Functions
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showLoading(show = true) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        loadingOverlay.classList.add('active');
        isLoading = true;
    } else {
        loadingOverlay.classList.remove('active');
        isLoading = false;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Mock Data Generation
function generateMockData() {
    // Generate cooperatives
    cooperatives = [
        {
            id: 'coop_001',
            name: 'Green Valley Farmers Coop',
            location: 'Punjab',
            crops: ['wheat', 'rice'],
            members: 45,
            totalVolume: 1250,
            rating: 4.8,
            description: 'Leading wheat and rice cooperative in Punjab'
        },
        {
            id: 'coop_002',
            name: 'Western Cotton Alliance',
            location: 'Gujarat',
            crops: ['cotton', 'soybean'],
            members: 32,
            totalVolume: 890,
            rating: 4.6,
            description: 'Premium cotton and soybean producers'
        },
        {
            id: 'coop_003',
            name: 'Sahyadri Organic Coop',
            location: 'Maharashtra',
            crops: ['sugarcane', 'rice'],
            members: 28,
            totalVolume: 720,
            rating: 4.7,
            description: 'Organic farming specialists'
        },
        {
            id: 'coop_004',
            name: 'Rajasthan Grain Union',
            location: 'Rajasthan',
            crops: ['wheat', 'corn'],
            members: 38,
            totalVolume: 1100,
            rating: 4.5,
            description: 'Traditional grain farming cooperative'
        }
    ];

    // Generate bulk listings
    bulkListings = [
        {
            id: 'listing_001',
            cooperative: cooperatives[0],
            crop: 'wheat',
            variety: 'HD-2967',
            quantity: 150, // tons
            price: 2100, // per quintal
            quality: 'Premium',
            location: 'Ludhiana, Punjab',
            harvestDate: '2024-01-15',
            expiryDate: '2024-02-15',
            activeBids: 12,
            status: 'active',
            description: 'High quality wheat from fertile Punjab lands'
        },
        {
            id: 'listing_002',
            cooperative: cooperatives[1],
            crop: 'cotton',
            variety: 'Bt-Cotton',
            quantity: 85, // tons
            price: 5800, // per quintal
            quality: 'Grade A',
            location: 'Ahmedabad, Gujarat',
            harvestDate: '2024-01-10',
            expiryDate: '2024-02-10',
            activeBids: 8,
            status: 'active',
            description: 'Premium cotton with excellent fiber quality'
        },
        {
            id: 'listing_003',
            cooperative: cooperatives[2],
            crop: 'rice',
            variety: 'Basmati',
            quantity: 95, // tons
            price: 4200, // per quintal
            quality: 'Premium',
            location: 'Nashik, Maharashtra',
            harvestDate: '2024-01-20',
            expiryDate: '2024-02-20',
            activeBids: 15,
            status: 'active',
            description: 'Authentic Basmati rice from Sahyadri region'
        },
        {
            id: 'listing_004',
            cooperative: cooperatives[3],
            crop: 'corn',
            variety: 'Sweet Corn',
            quantity: 120, // tons
            price: 1800, // per quintal
            quality: 'Food Grade',
            location: 'Jaipur, Rajasthan',
            harvestDate: '2024-01-12',
            expiryDate: '2024-02-12',
            activeBids: 6,
            status: 'active',
            description: 'Fresh sweet corn perfect for processing'
        },
        {
            id: 'listing_005',
            cooperative: cooperatives[0],
            crop: 'rice',
            variety: 'IR-64',
            quantity: 200, // tons
            price: 2300, // per quintal
            quality: 'Standard',
            location: 'Amritsar, Punjab',
            harvestDate: '2024-01-18',
            expiryDate: '2024-02-18',
            activeBids: 20,
            status: 'active',
            description: 'High-yield IR-64 rice variety'
        }
    ];

    // Generate leaderboard data
    leaderboardData = [
        { rank: 1, cooperative: cooperatives[0], volume: 1250, transactions: 45, rating: 4.8 },
        { rank: 2, cooperative: cooperatives[3], volume: 1100, transactions: 38, rating: 4.5 },
        { rank: 3, cooperative: cooperatives[1], volume: 890, transactions: 32, rating: 4.6 },
        { rank: 4, cooperative: cooperatives[2], volume: 720, transactions: 28, rating: 4.7 }
    ];

    // Generate chat messages
    chatMessages = {
        general: [
            {
                id: 'msg_001',
                author: 'Rajesh Kumar',
                text: 'What are the current market rates for wheat in Punjab?',
                timestamp: Date.now() - 120000
            },
            {
                id: 'msg_002',
                author: 'Priya Sharma',
                text: 'Wheat prices are around ₹2100-2200 per quintal depending on quality.',
                timestamp: Date.now() - 60000
            },
            {
                id: 'msg_003',
                author: 'Amit Patel',
                text: 'Green Valley Coop has good quality wheat available in bulk.',
                timestamp: Date.now() - 30000
            }
        ],
        wheat: [
            {
                id: 'msg_004',
                author: 'Suresh Singh',
                text: 'Looking for premium wheat varieties for export. Any recommendations?',
                timestamp: Date.now() - 180000
            }
        ],
        rice: [
            {
                id: 'msg_005',
                author: 'Ramesh Yadav',
                text: 'Planning harvest schedule for Basmati rice. Any market insights?',
                timestamp: Date.now() - 240000
            }
        ]
    };
}

// DOM Elements
const elements = {
    activeCoops: document.getElementById('activeCoops'),
    totalListings: document.getElementById('totalListings'),
    activeBids: document.getElementById('activeBids'),
    totalVolume: document.getElementById('totalVolume'),
    listingsContainer: document.getElementById('listingsContainer'),
    leaderboardContainer: document.getElementById('leaderboardContainer'),
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendMessage: document.getElementById('sendMessage'),
    
    // Filters
    cropFilter: document.getElementById('cropFilter'),
    locationFilter: document.getElementById('locationFilter'),
    quantityFilter: document.getElementById('quantityFilter'),
    timeframeFilter: document.getElementById('timeframeFilter'),
    
    // Modals
    createCoopModal: document.getElementById('createCoopModal'),
    joinCoopModal: document.getElementById('joinCoopModal'),
    collectiveBidModal: document.getElementById('collectiveBidModal'),
    
    // Buttons
    createCoopBtn: document.getElementById('createCoopBtn'),
    joinCoopBtn: document.getElementById('joinCoopBtn'),
    
    // Forms
    createCoopForm: document.getElementById('createCoopForm'),
    collectiveBidForm: document.getElementById('collectiveBidForm')
};

// Render Functions
function renderStats() {
    elements.activeCoops.textContent = cooperatives.length;
    elements.totalListings.textContent = bulkListings.length;
    elements.activeBids.textContent = bulkListings.reduce((sum, listing) => sum + listing.activeBids, 0);
    elements.totalVolume.textContent = formatCurrency(leaderboardData.reduce((sum, item) => sum + (item.volume * 100), 0));
}

function renderBulkListings(listings = bulkListings) {
    if (listings.length === 0) {
        elements.listingsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No listings found</h3>
                <p>Try adjusting your filters or check back later.</p>
            </div>
        `;
        return;
    }

    elements.listingsContainer.innerHTML = listings.map(listing => `
        <div class="listing-card" data-id="${listing.id}">
            <div class="listing-header">
                <div class="listing-cooperative">
                    <div class="coop-avatar">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="coop-info">
                        <h4>${listing.cooperative.name}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${listing.location}</p>
                    </div>
                </div>
                <div class="listing-badge">${listing.quality}</div>
            </div>
            
            <div class="listing-details">
                <div class="detail-item">
                    <i class="fas fa-seedling"></i>
                    <span><strong>${listing.crop.charAt(0).toUpperCase() + listing.crop.slice(1)}</strong> (${listing.variety})</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-weight"></i>
                    <span class="listing-quantity">${listing.quantity} tons</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-rupee-sign"></i>
                    <span class="listing-price">${formatCurrency(listing.price)}/quintal</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Harvest: ${new Date(listing.harvestDate).toLocaleDateString()}</span>
                </div>
            </div>
            
            <p class="listing-description">${listing.description}</p>
            
            <div class="listing-footer">
                <div class="listing-stats">
                    <span><i class="fas fa-gavel"></i> ${listing.activeBids} active bids</span>
                    <span><i class="fas fa-clock"></i> Expires: ${new Date(listing.expiryDate).toLocaleDateString()}</span>
                </div>
                <div class="listing-actions">
                    <button class="btn-bid" onclick="openCollectiveBid('${listing.id}')">
                        <i class="fas fa-gavel"></i> Place Bid
                    </button>
                    <button class="btn-view" onclick="viewListingDetails('${listing.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderLeaderboard() {
    elements.leaderboardContainer.innerHTML = leaderboardData.map(item => `
        <div class="leaderboard-item">
            <div class="rank-badge rank-${item.rank <= 3 ? item.rank : 'other'}">
                #${item.rank}
            </div>
            <div class="coop-details">
                <div class="coop-name">${item.cooperative.name}</div>
                <div class="coop-stats">
                    <span><i class="fas fa-users"></i> ${item.cooperative.members} members</span>
                    <span><i class="fas fa-star"></i> ${item.rating}/5</span>
                </div>
            </div>
            <div class="coop-volume">
                <div>${formatNumber(item.volume)} tons</div>
                <small>${item.transactions} deals</small>
            </div>
        </div>
    `).join('');
}

function renderChatMessages(groupId = currentChatGroup) {
    const messages = chatMessages[groupId] || [];
    
    if (messages.length === 0) {
        elements.chatMessages.innerHTML = `
            <div class="empty-chat">
                <i class="fas fa-comments"></i>
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
        return;
    }

    elements.chatMessages.innerHTML = messages.map(msg => `
        <div class="message">
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${msg.author}</span>
                    <span class="message-time">${formatTime(msg.timestamp)}</span>
                </div>
                <div class="message-text">${msg.text}</div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    
    return new Date(timestamp).toLocaleDateString();
}

// Filter Functions
function applyFilters() {
    const cropFilter = elements.cropFilter.value;
    const locationFilter = elements.locationFilter.value;
    const quantityFilter = elements.quantityFilter.value;
    
    let filteredListings = bulkListings.filter(listing => {
        // Crop filter
        if (cropFilter && listing.crop !== cropFilter) return false;
        
        // Location filter
        if (locationFilter && !listing.location.toLowerCase().includes(locationFilter)) return false;
        
        // Quantity filter
        if (quantityFilter) {
            if (quantityFilter === 'small' && listing.quantity > 50) return false;
            if (quantityFilter === 'medium' && (listing.quantity <= 50 || listing.quantity > 200)) return false;
            if (quantityFilter === 'large' && listing.quantity <= 200) return false;
        }
        
        return true;
    });
    
    renderBulkListings(filteredListings);
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openCollectiveBid(listingId) {
    selectedListing = bulkListings.find(l => l.id === listingId);
    if (!selectedListing) return;
    
    const bidInfo = document.getElementById('bidInfo');
    bidInfo.innerHTML = `
        <div class="bid-listing-info">
            <h4>${selectedListing.cooperative.name}</h4>
            <p>${selectedListing.crop.charAt(0).toUpperCase() + selectedListing.crop.slice(1)} - ${selectedListing.variety}</p>
            <p>Available: ${selectedListing.quantity} tons at ${formatCurrency(selectedListing.price)}/quintal</p>
        </div>
    `;
    
    // Reset form
    document.getElementById('bidAmount').value = '';
    document.getElementById('bidQuantity').value = '';
    document.getElementById('bidMessage').value = '';
    
    openModal('collectiveBidModal');
}

function viewListingDetails(listingId) {
    const listing = bulkListings.find(l => l.id === listingId);
    if (!listing) return;
    
    showToast('Listing details view - Coming soon!', 'info');
}

// Chat Functions
function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    const newMessage = {
        id: generateId('msg'),
        author: currentUser.name,
        text: message,
        timestamp: Date.now()
    };
    
    if (!chatMessages[currentChatGroup]) {
        chatMessages[currentChatGroup] = [];
    }
    
    chatMessages[currentChatGroup].push(newMessage);
    elements.chatInput.value = '';
    
    renderChatMessages(currentChatGroup);
    showToast('Message sent!', 'success');
}

function switchChatGroup(groupId) {
    currentChatGroup = groupId;
    
    // Update active state
    document.querySelectorAll('.chat-group').forEach(group => {
        group.classList.remove('active');
    });
    document.querySelector(`[data-group="${groupId}"]`).classList.add('active');
    
    renderChatMessages(groupId);
}

// Form Handlers
function handleCreateCoop(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const coopData = {
        name: formData.get('coopName'),
        location: formData.get('coopLocation'),
        crops: Array.from(formData.getAll('coopCrops')),
        description: formData.get('coopDescription')
    };
    
    showLoading(true);
    
    setTimeout(() => {
        const newCoop = {
            id: generateId('coop'),
            ...coopData,
            members: 1,
            totalVolume: 0,
            rating: 5.0
        };
        
        cooperatives.push(newCoop);
        
        showLoading(false);
        closeModal('createCoopModal');
        showToast('Cooperative created successfully!', 'success');
        
        // Update stats and re-render
        renderStats();
        renderLeaderboard();
        
        e.target.reset();
    }, 1500);
}

function handleCollectiveBid(e) {
    e.preventDefault();
    
    if (!selectedListing) return;
    
    const formData = new FormData(e.target);
    const bidData = {
        amount: parseFloat(formData.get('bidAmount')),
        quantity: parseFloat(formData.get('bidQuantity')),
        message: formData.get('bidMessage')
    };
    
    if (bidData.quantity > selectedListing.quantity) {
        showToast('Bid quantity cannot exceed available quantity!', 'error');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        // Update listing bid count
        selectedListing.activeBids++;
        
        showLoading(false);
        closeModal('collectiveBidModal');
        showToast('Collective bid placed successfully!', 'success');
        
        // Re-render listings
        renderBulkListings();
        renderStats();
        
        e.target.reset();
        selectedListing = null;
    }, 1500);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    generateMockData();
    renderStats();
    renderBulkListings();
    renderLeaderboard();
    renderChatMessages();
    
    // Filter listeners
    elements.cropFilter.addEventListener('change', applyFilters);
    elements.locationFilter.addEventListener('change', applyFilters);
    elements.quantityFilter.addEventListener('change', applyFilters);
    
    // Chat listeners
    elements.sendMessage.addEventListener('click', sendChatMessage);
    elements.chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Chat group switching
    document.querySelectorAll('.chat-group').forEach(group => {
        group.addEventListener('click', function() {
            const groupId = this.dataset.group;
            switchChatGroup(groupId);
        });
    });
    
    // Modal listeners
    elements.createCoopBtn.addEventListener('click', () => openModal('createCoopModal'));
    elements.joinCoopBtn.addEventListener('click', () => openModal('joinCoopModal'));
    
    // Close modal buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Form listeners
    elements.createCoopForm.addEventListener('submit', handleCreateCoop);
    elements.collectiveBidForm.addEventListener('submit', handleCollectiveBid);
    
    // Cancel buttons
    document.getElementById('cancelCreateCoop').addEventListener('click', () => closeModal('createCoopModal'));
    document.getElementById('cancelBid').addEventListener('click', () => closeModal('collectiveBidModal'));
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
    
    // Auto-refresh data every 30 seconds
    setInterval(() => {
        // Simulate real-time updates
        bulkListings.forEach(listing => {
            if (Math.random() > 0.8) {
                listing.activeBids += Math.floor(Math.random() * 3);
            }
        });
        
        renderBulkListings();
        renderStats();
    }, 30000);
    
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }
});

// Export functions for external use
window.cooperativeMarketplace = {
    openCollectiveBid,
    viewListingDetails,
    switchChatGroup,
    applyFilters,
    renderBulkListings,
    renderLeaderboard,
    renderChatMessages
};