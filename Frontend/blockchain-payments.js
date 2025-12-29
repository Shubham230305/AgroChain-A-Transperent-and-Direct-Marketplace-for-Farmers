// Blockchain Payments JavaScript

// Global Variables
let walletData = {
    totalBalance: 125000,
    escrowBalance: 45000,
    availableBalance: 80000,
    transactions: [],
    userRole: 'farmer', // 'farmer' or 'buyer'
    walletAddress: generateWalletAddress()
};

let currentTransaction = null;
let isLoading = false;

// Utility Functions
function generateWalletAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

function generateTransactionHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

function formatCrypto(amount, crypto = 'ETH') {
    return `${amount.toFixed(4)} ${crypto}`;
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span class="toast-message">${message}</span>
        </div>
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
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function showLoading(message = 'Processing...', showProgress = false) {
    const overlay = document.getElementById('loadingOverlay');
    const loadingMessage = overlay.querySelector('p');
    const progressBar = overlay.querySelector('.progress-fill');
    const progressText = overlay.querySelector('.progress-text');
    
    loadingMessage.textContent = message;
    
    if (showProgress) {
        overlay.querySelector('.loading-progress').style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
    } else {
        overlay.querySelector('.loading-progress').style.display = 'none';
    }
    
    overlay.classList.add('active');
    isLoading = true;
    
    if (showProgress) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 200);
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('active');
    isLoading = false;
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Wallet Management Functions
function updateWalletDisplay() {
    const totalElement = document.getElementById('totalBalance');
    const escrowElement = document.getElementById('escrowBalance');
    const availableElement = document.getElementById('availableBalance');
    
    if (totalElement) {
        totalElement.innerHTML = `
            <div class="balance-amount">${formatCurrency(walletData.totalBalance)}</div>
            <div class="balance-crypto">
                <span>≈</span>
                <span class="crypto-value">${formatCrypto(walletData.totalBalance / 150000)}</span>
            </div>
        `;
    }
    
    if (escrowElement) {
        escrowElement.innerHTML = `
            <div class="balance-amount">${formatCurrency(walletData.escrowBalance)}</div>
            <div class="balance-crypto">
                <span>≈</span>
                <span class="crypto-value">${formatCrypto(walletData.escrowBalance / 150000)}</span>
            </div>
        `;
    }
    
    if (availableElement) {
        availableElement.innerHTML = `
            <div class="balance-amount">${formatCurrency(walletData.availableBalance)}</div>
            <div class="balance-crypto">
                <span>≈</span>
                <span class="crypto-value">${formatCrypto(walletData.availableBalance / 150000)}</span>
            </div>
        `;
    }
    
    // Update wallet address display
    const walletAddressElement = document.getElementById('walletAddress');
    if (walletAddressElement) {
        walletAddressElement.textContent = walletData.walletAddress;
    }
}

function refreshWallet() {
    showLoading('Refreshing wallet...');
    
    setTimeout(() => {
        // Simulate small balance changes
        const change = (Math.random() - 0.5) * 1000;
        walletData.totalBalance += change;
        walletData.availableBalance += change;
        
        updateWalletDisplay();
        hideLoading();
        showToast('Wallet refreshed successfully', 'success');
    }, 2000);
}

// Transaction Management Functions
function generateSampleTransactions() {
    const transactions = [
        {
            id: 'TXN001',
            type: 'payment',
            status: 'completed',
            amount: 25000,
            description: 'Payment for Wheat Crop',
            from: '0x742d35cc6634c0532925a3b844bc9e7595f2b9e1',
            to: walletData.walletAddress,
            hash: generateTransactionHash(),
            timestamp: new Date(Date.now() - 86400000),
            crop: 'Wheat',
            quantity: '500kg'
        },
        {
            id: 'TXN002',
            type: 'escrow',
            status: 'pending',
            amount: 15000,
            description: 'Escrow for Rice Crop',
            from: walletData.walletAddress,
            to: '0x8ba1f109551bd432803012645hac136c82c3e8c9',
            hash: generateTransactionHash(),
            timestamp: new Date(Date.now() - 172800000),
            crop: 'Rice',
            quantity: '300kg'
        },
        {
            id: 'TXN003',
            type: 'withdrawal',
            status: 'completed',
            amount: 35000,
            description: 'Withdrawal to Bank',
            from: walletData.walletAddress,
            to: 'Bank Account ****1234',
            hash: generateTransactionHash(),
            timestamp: new Date(Date.now() - 259200000),
            crop: null,
            quantity: null
        },
        {
            id: 'TXN004',
            type: 'escrow',
            status: 'released',
            amount: 20000,
            description: 'Released Escrow for Cotton',
            from: '0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c',
            to: walletData.walletAddress,
            hash: generateTransactionHash(),
            timestamp: new Date(Date.now() - 345600000),
            crop: 'Cotton',
            quantity: '400kg'
        },
        {
            id: 'TXN005',
            type: 'payment',
            status: 'pending',
            amount: 18000,
            description: 'Payment for Soybean',
            from: walletData.walletAddress,
            to: '0x742d35cc6634c0532925a3b844bc9e7595f2b9e1',
            hash: generateTransactionHash(),
            timestamp: new Date(Date.now() - 432000000),
            crop: 'Soybean',
            quantity: '250kg'
        }
    ];
    
    return transactions;
}

function renderTransactions(transactions = null) {
    const container = document.getElementById('transactionsContainer');
    if (!container) return;
    
    const transactionsToRender = transactions || walletData.transactions;
    
    if (transactionsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history" style="font-size: 3rem; color: var(--hash-gray); margin-bottom: 1rem;"></i>
                <h3>No transactions found</h3>
                <p>Your transaction history will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactionsToRender.map(transaction => `
        <div class="transaction-item ${transaction.status}" data-transaction-id="${transaction.id}">
            <div class="transaction-icon">
                <i class="fas ${getTransactionIcon(transaction.type)}"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-header">
                    <h4>${transaction.description}</h4>
                    <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                        ${transaction.amount > 0 ? '+' : ''}${formatCurrency(transaction.amount)}
                    </div>
                </div>
                <div class="transaction-info">
                    <span class="transaction-type">${transaction.type.toUpperCase()}</span>
                    <span>${formatDate(transaction.timestamp)}</span>
                    ${transaction.crop ? `<span>• ${transaction.crop}</span>` : ''}
                    ${transaction.quantity ? `<span>• ${transaction.quantity}</span>` : ''}
                </div>
                <div class="transaction-status">
                    <div class="status-badge ${transaction.status}">
                        <i class="fas ${getStatusIcon(transaction.status)}"></i>
                        ${transaction.status.toUpperCase()}
                    </div>
                    ${renderTransactionActions(transaction)}
                </div>
                <div class="transaction-hash">
                    <span class="hash-label">Blockchain Hash:</span>
                    <div class="hash-container">
                        <span class="hash-text">${transaction.hash}</span>
                        <button class="copy-btn" onclick="copyHash('${transaction.hash}')" title="Copy hash">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getTransactionIcon(type) {
    const icons = {
        payment: 'fa-money-bill-wave',
        escrow: 'fa-lock',
        withdrawal: 'fa-university',
        deposit: 'fa-arrow-down'
    };
    return icons[type] || 'fa-exchange-alt';
}

function getStatusIcon(status) {
    const icons = {
        pending: 'fa-clock',
        completed: 'fa-check-circle',
        released: 'fa-unlock',
        failed: 'fa-times-circle'
    };
    return icons[status] || 'fa-question-circle';
}

function renderTransactionActions(transaction) {
    if (transaction.status === 'pending') {
        if (walletData.userRole === 'buyer' && transaction.type === 'escrow') {
            return `
                <div class="transaction-actions">
                    <button class="action-btn small success" onclick="releaseEscrow('${transaction.id}')">
                        <i class="fas fa-unlock"></i>
                        Release
                    </button>
                </div>
            `;
        } else if (walletData.userRole === 'buyer' && transaction.type === 'payment') {
            return `
                <div class="transaction-actions">
                    <button class="action-btn small primary" onclick="completePayment('${transaction.id}')">
                        <i class="fas fa-check"></i>
                        Pay
                    </button>
                </div>
            `;
        }
    }
    return '';
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

function copyHash(hash) {
    navigator.clipboard.writeText(hash).then(() => {
        showToast('Hash copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = event.target.closest('.copy-btn');
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    }).catch(() => {
        showToast('Failed to copy hash', 'error');
    });
}

function filterTransactions() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    let filtered = walletData.transactions;
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    renderTransactions(filtered);
}

// Payment Functions
function showAddFundsModal() {
    showModal('addFundsModal');
}

function showWithdrawModal() {
    showModal('withdrawModal');
}

function showTransactionConfirmation(transaction) {
    currentTransaction = transaction;
    
    const modal = document.getElementById('transactionModal');
    const details = modal.querySelector('.confirmation-details');
    
    details.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Transaction ID:</span>
            <span class="detail-value">${transaction.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${transaction.type.toUpperCase()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Amount:</span>
            <span class="detail-value">${formatCurrency(transaction.amount)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${transaction.description}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Blockchain Fee:</span>
            <span class="detail-value">${formatCurrency(50)}</span>
        </div>
        <div class="detail-row total-row">
            <span class="detail-label">Total:</span>
            <span class="detail-value">${formatCurrency(transaction.amount + 50)}</span>
        </div>
    `;
    
    showModal('transactionModal');
}

function confirmTransaction() {
    if (!currentTransaction) return;
    
    showLoading('Processing transaction...', true);
    
    setTimeout(() => {
        // Update transaction status
        const transaction = walletData.transactions.find(t => t.id === currentTransaction.id);
        if (transaction) {
            transaction.status = 'completed';
            transaction.hash = generateTransactionHash();
            transaction.timestamp = new Date();
        }
        
        // Update wallet balances
        if (currentTransaction.type === 'payment' && currentTransaction.amount < 0) {
            walletData.availableBalance += currentTransaction.amount;
            walletData.totalBalance += currentTransaction.amount;
        } else if (currentTransaction.type === 'escrow' && currentTransaction.amount > 0) {
            walletData.escrowBalance += currentTransaction.amount;
            walletData.availableBalance -= currentTransaction.amount;
        }
        
        hideLoading();
        hideModal('transactionModal');
        updateWalletDisplay();
        renderTransactions();
        
        showToast('Transaction completed successfully!', 'success');
        currentTransaction = null;
    }, 3000);
}

function addFunds() {
    const amount = parseFloat(document.getElementById('addAmount').value);
    const method = document.getElementById('paymentMethod').value;
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    showLoading('Processing payment...', true);
    
    setTimeout(() => {
        // Create new transaction
        const newTransaction = {
            id: `TXN${String(walletData.transactions.length + 1).padStart(3, '0')}`,
            type: 'deposit',
            status: 'completed',
            amount: amount,
            description: `Deposit via ${method.toUpperCase()}`,
            from: method.toUpperCase(),
            to: walletData.walletAddress,
            hash: generateTransactionHash(),
            timestamp: new Date(),
            crop: null,
            quantity: null
        };
        
        walletData.transactions.unshift(newTransaction);
        walletData.totalBalance += amount;
        walletData.availableBalance += amount;
        
        hideLoading();
        hideModal('addFundsModal');
        
        updateWalletDisplay();
        renderTransactions();
        
        // Reset form
        document.getElementById('addAmount').value = '';
        document.getElementById('paymentMethod').value = 'upi';
        
        showToast(`₹${amount.toLocaleString()} added successfully!`, 'success');
    }, 2500);
}

function withdrawFunds() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('withdrawMethod').value;
    const account = document.getElementById('withdrawAccount').value;
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    if (amount > walletData.availableBalance) {
        showToast('Insufficient balance', 'error');
        return;
    }
    
    if (!account) {
        showToast('Please enter account details', 'error');
        return;
    }
    
    showLoading('Processing withdrawal...', true);
    
    setTimeout(() => {
        // Create new transaction
        const newTransaction = {
            id: `TXN${String(walletData.transactions.length + 1).padStart(3, '0')}`,
            type: 'withdrawal',
            status: 'completed',
            amount: -amount,
            description: `Withdrawal to ${method.toUpperCase()}`,
            from: walletData.walletAddress,
            to: `${method.toUpperCase()} ${account}`,
            hash: generateTransactionHash(),
            timestamp: new Date(),
            crop: null,
            quantity: null
        };
        
        walletData.transactions.unshift(newTransaction);
        walletData.totalBalance -= amount;
        walletData.availableBalance -= amount;
        
        hideLoading();
        hideModal('withdrawModal');
        
        updateWalletDisplay();
        renderTransactions();
        
        // Reset form
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('withdrawAccount').value = '';
        
        showToast(`₹${amount.toLocaleString()} withdrawn successfully!`, 'success');
    }, 3000);
}

function releaseEscrow(transactionId) {
    const transaction = walletData.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    showTransactionConfirmation({
        id: transactionId,
        type: 'escrow',
        amount: transaction.amount,
        description: `Release escrow for ${transaction.crop}`
    });
}

function completePayment(transactionId) {
    const transaction = walletData.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    showTransactionConfirmation({
        id: transactionId,
        type: 'payment',
        amount: -transaction.amount,
        description: `Complete payment for ${transaction.crop}`
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wallet data
    walletData.transactions = generateSampleTransactions();
    
    // Update displays
    updateWalletDisplay();
    renderTransactions();
    
    // Event listeners for wallet actions
    document.getElementById('refreshWallet')?.addEventListener('click', refreshWallet);
    document.getElementById('addFundsBtn')?.addEventListener('click', showAddFundsModal);
    document.getElementById('withdrawBtn')?.addEventListener('click', showWithdrawModal);
    
    // Transaction filters
    document.getElementById('statusFilter')?.addEventListener('change', filterTransactions);
    document.getElementById('typeFilter')?.addEventListener('change', filterTransactions);
    
    // Modal controls
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.closest('.modal-overlay').id;
            hideModal(modalId);
        });
    });
    
    // Modal overlay clicks
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
    
    // Transaction actions
    document.getElementById('confirmTransaction')?.addEventListener('click', confirmTransaction);
    document.getElementById('addFundsConfirm')?.addEventListener('click', addFunds);
    document.getElementById('withdrawConfirm')?.addEventListener('click', withdrawFunds);
    
    // Quick actions
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function() {
            const action = this.dataset.action;
            switch(action) {
                case 'transfer':
                    showToast('Transfer feature coming soon!', 'info');
                    break;
                case 'escrow':
                    showToast('Escrow feature coming soon!', 'info');
                    break;
                case 'history':
                    document.getElementById('transactionsContainer').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'settings':
                    showToast('Wallet settings coming soon!', 'info');
                    break;
            }
        });
    });
    
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('paymentMethod').value = this.dataset.method;
        });
    });
    
    // Form validation
    document.getElementById('addAmount')?.addEventListener('input', function() {
        const amount = parseFloat(this.value);
        const confirmBtn = document.getElementById('addFundsConfirm');
        confirmBtn.disabled = !amount || amount <= 0;
    });
    
    document.getElementById('withdrawAmount')?.addEventListener('input', function() {
        const amount = parseFloat(this.value);
        const confirmBtn = document.getElementById('withdrawConfirm');
        confirmBtn.disabled = !amount || amount <= 0 || amount > walletData.availableBalance;
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                hideModal(modal.id);
            });
        }
    });
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        if (!isLoading) {
            refreshWallet();
        }
    }, 30000);
    
    // Add animations
    setTimeout(() => {
        document.querySelectorAll('.balance-card, .transaction-item, .action-card').forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('slide-in-up');
        });
    }, 100);
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for external use
window.blockchainPayments = {
    walletData,
    updateWalletDisplay,
    renderTransactions,
    showToast,
    showLoading,
    hideLoading,
    showModal,
    hideModal,
    copyHash,
    formatCurrency,
    formatCrypto
};