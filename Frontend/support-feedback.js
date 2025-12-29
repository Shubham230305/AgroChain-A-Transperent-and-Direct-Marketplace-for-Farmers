// Support & Feedback JavaScript

// Global Variables
let currentRating = 0;
let chatMessages = [];
let unreadCount = 0;
let isChatOpen = false;
let currentFAQCategory = 'all';
let faqSearchTerm = '';

// FAQ Data
const faqData = [
  {
    category: 'general',
    question: 'What is AgroChain?',
    answer: 'AgroChain is a blockchain-based platform that connects farmers directly with buyers, eliminating intermediaries and ensuring fair pricing. It provides transparency, traceability, and secure payment processing for agricultural transactions.'
  },
  {
    category: 'general',
    question: 'How do I create an account?',
    answer: 'To create an account, click on the "Sign Up" button on the homepage. You\'ll need to provide your basic information, verify your identity, and choose whether you\'re registering as a farmer or buyer. The verification process typically takes 24-48 hours.'
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you a password reset link. The link expires after 24 hours for security reasons.'
  },
  {
    category: 'account',
    question: 'Can I change my account type?',
    answer: 'Yes, you can change your account type by contacting our support team. You\'ll need to provide additional verification documents depending on the new account type you\'re requesting.'
  },
  {
    category: 'payments',
    question: 'How do payments work on AgroChain?',
    answer: 'Payments are processed through secure blockchain transactions. When a buyer places an order, funds are held in escrow until the farmer confirms shipment. Once delivery is confirmed, funds are automatically released to the farmer\'s account.'
  },
  {
    category: 'payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept bank transfers, UPI payments, debit/credit cards, and cryptocurrency payments. All transactions are secured with blockchain technology for maximum security and transparency.'
  },
  {
    category: 'payments',
    question: 'Are there any transaction fees?',
    answer: 'Yes, we charge a small transaction fee of 2-3% to maintain the platform and provide services. The exact fee depends on the transaction amount and payment method used.'
  },
  {
    category: 'crops',
    question: 'How do I list my crops for sale?',
    answer: 'After logging in, go to the "Crop Listing" section. Click on "Add New Crop" and provide details like crop type, quantity, quality grade, expected price, and upload photos. Your listing will be reviewed and approved within a few hours.'
  },
  {
    category: 'crops',
    question: 'What crops can I sell on AgroChain?',
    answer: 'You can sell a wide variety of crops including grains, pulses, vegetables, fruits, spices, and cash crops. Each crop category has specific quality standards and documentation requirements.'
  },
  {
    category: 'crops',
    question: 'How is crop quality verified?',
    answer: 'Crop quality is verified through multiple methods: IoT sensors for real-time monitoring, third-party quality certification, buyer feedback, and our quality assurance team. High-value crops may require additional laboratory testing.'
  },
  {
    category: 'technical',
    question: 'What devices are supported?',
    answer: 'AgroChain is accessible on all modern devices including smartphones, tablets, laptops, and desktop computers. We have responsive web design and mobile apps for both Android and iOS platforms.'
  },
  {
    category: 'technical',
    question: 'How secure is my data?',
    answer: 'We use enterprise-grade security measures including blockchain encryption, SSL certificates, two-factor authentication, and regular security audits. Your data is stored on secure servers with multiple backup systems.'
  },
  {
    category: 'technical',
    question: 'What should I do if the app crashes?',
    answer: 'If the app crashes, try clearing your browser cache and cookies, then restart the application. If the problem persists, contact our technical support team with details about when the crash occurred and what actions you were performing.'
  }
];

// Utility Functions
function showToast(message, type = 'info', duration = 5000) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="fas ${iconMap[type]} toast-icon"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, duration);
}

function showLoading(message = 'Loading...') {
  const overlay = document.getElementById('loadingOverlay');
  const spinner = overlay.querySelector('.loading-spinner p');
  spinner.textContent = message;
  overlay.classList.add('show');
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('show');
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

function formatNumber(number) {
  return new Intl.NumberFormat('en-IN').format(number);
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Form Validation Functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateName(name) {
  return name.trim().length >= 2;
}

function validateFeedback(feedback) {
  return feedback.trim().length >= 10 && feedback.trim().length <= 500;
}

// Star Rating Functions
function initializeStarRating() {
  const starRating = document.getElementById('starRating');
  const stars = starRating.querySelectorAll('.star');
  const inputs = starRating.querySelectorAll('input[type="radio"]');
  
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      currentRating = 5 - index;
      updateStarDisplay();
      clearError('ratingError');
    });
    
    star.addEventListener('mouseenter', () => {
      highlightStars(5 - index);
    });
  });
  
  starRating.addEventListener('mouseleave', () => {
    updateStarDisplay();
  });
  
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      currentRating = parseInt(input.value);
      updateStarDisplay();
      clearError('ratingError');
    });
  });
}

function updateStarDisplay() {
  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach((star, index) => {
    const starValue = 5 - index;
    if (starValue <= currentRating) {
      star.style.color = 'var(--secondary-color)';
    } else {
      star.style.color = 'var(--border-color)';
    }
  });
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach((star, index) => {
    const starValue = 5 - index;
    if (starValue <= rating) {
      star.style.color = 'var(--secondary-color)';
    } else {
      star.style.color = 'var(--border-color)';
    }
  });
}

// Form Validation
function validateForm() {
  let isValid = true;
  
  // Validate name
  const nameInput = document.getElementById('userName');
  const nameError = document.getElementById('nameError');
  if (!validateName(nameInput.value)) {
    showError('nameError', 'Please enter a valid name (at least 2 characters)');
    nameInput.classList.add('error');
    isValid = false;
  } else {
    clearError('nameError');
    nameInput.classList.remove('error');
  }
  
  // Validate email
  const emailInput = document.getElementById('userEmail');
  const emailError = document.getElementById('emailError');
  if (!validateEmail(emailInput.value)) {
    showError('emailError', 'Please enter a valid email address');
    emailInput.classList.add('error');
    isValid = false;
  } else {
    clearError('emailError');
    emailInput.classList.remove('error');
  }
  
  // Validate rating
  const ratingError = document.getElementById('ratingError');
  if (currentRating === 0) {
    showError('ratingError', 'Please select a rating');
    isValid = false;
  } else {
    clearError('ratingError');
  }
  
  // Validate feedback
  const feedbackInput = document.getElementById('feedbackText');
  const feedbackError = document.getElementById('feedbackError');
  if (!validateFeedback(feedbackInput.value)) {
    showError('feedbackError', 'Please enter feedback between 10 and 500 characters');
    feedbackInput.classList.add('error');
    isValid = false;
  } else {
    clearError('feedbackError');
    feedbackInput.classList.remove('error');
  }
  
  return isValid;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = '';
  errorElement.classList.remove('show');
}

// Character Counter
function initializeCharacterCounter() {
  const feedbackText = document.getElementById('feedbackText');
  const charCount = document.getElementById('charCount');
  
  feedbackText.addEventListener('input', () => {
    const length = feedbackText.value.length;
    charCount.textContent = length;
    
    if (length > 450) {
      charCount.style.color = 'var(--warning-color)';
    } else if (length > 400) {
      charCount.style.color = 'var(--secondary-color)';
    } else {
      charCount.style.color = 'var(--text-light)';
    }
  });
}

// FAQ Functions
function initializeFAQ() {
  renderFAQItems();
  initializeFAQSearch();
  initializeFAQCategories();
}

function renderFAQItems() {
  const accordion = document.getElementById('faqAccordion');
  const filteredFAQs = filterFAQs();
  
  accordion.innerHTML = '';
  
  filteredFAQs.forEach((faq, index) => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    faqItem.innerHTML = `
      <div class="faq-question" onclick="toggleFAQ(${index})">
        <h4>${faq.question}</h4>
        <i class="fas fa-chevron-down faq-toggle"></i>
      </div>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    `;
    accordion.appendChild(faqItem);
  });
}

function filterFAQs() {
  return faqData.filter(faq => {
    const matchesCategory = currentFAQCategory === 'all' || faq.category === currentFAQCategory;
    const matchesSearch = faqSearchTerm === '' || 
      faq.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function toggleFAQ(index) {
  const faqItems = document.querySelectorAll('.faq-item');
  const clickedItem = faqItems[index];
  
  // Close all other items
  faqItems.forEach((item, i) => {
    if (i !== index) {
      item.classList.remove('active');
    }
  });
  
  // Toggle clicked item
  clickedItem.classList.toggle('active');
}

function initializeFAQSearch() {
  const searchInput = document.getElementById('faqSearch');
  searchInput.addEventListener('input', (e) => {
    faqSearchTerm = e.target.value;
    renderFAQItems();
  });
}

function initializeFAQCategories() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      // Update current category
      currentFAQCategory = btn.dataset.category;
      // Re-render FAQ items
      renderFAQItems();
    });
  });
}

// Chat Functions
function initializeChat() {
  initializeChatToggle();
  initializeChatControls();
  initializeChatInput();
}

function initializeChatToggle() {
  const chatToggle = document.getElementById('chatToggle');
  const chatWidget = document.getElementById('chatWidget');
  
  chatToggle.addEventListener('click', () => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  });
}

function initializeChatControls() {
  const minimizeBtn = document.getElementById('minimizeChat');
  const closeBtn = document.getElementById('closeChat');
  const chatWidget = document.getElementById('chatWidget');
  
  minimizeBtn.addEventListener('click', () => {
    chatWidget.classList.toggle('minimized');
  });
  
  closeBtn.addEventListener('click', closeChat);
}

function initializeChatInput() {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendMessageBtn');
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  sendBtn.addEventListener('click', sendMessage);
  
  // Enable/disable send button based on input
  chatInput.addEventListener('input', () => {
    sendBtn.disabled = chatInput.value.trim() === '';
  });
}

function openChat() {
  const chatWidget = document.getElementById('chatWidget');
  const chatToggle = document.getElementById('chatToggle');
  const unreadBadge = document.getElementById('unreadBadge');
  
  chatWidget.classList.add('show');
  chatToggle.style.display = 'none';
  isChatOpen = true;
  unreadCount = 0;
  unreadBadge.style.display = 'none';
  unreadBadge.textContent = '0';
  
  // Focus on input
  setTimeout(() => {
    document.getElementById('chatInput').focus();
  }, 300);
}

function closeChat() {
  const chatWidget = document.getElementById('chatWidget');
  const chatToggle = document.getElementById('chatToggle');
  
  chatWidget.classList.remove('show');
  chatToggle.style.display = 'flex';
  isChatOpen = false;
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  
  if (message === '') return;
  
  // Add user message
  addMessage(message, 'user');
  chatInput.value = '';
  
  // Simulate agent response
  setTimeout(() => {
    const responses = [
      "Thank you for your message. How can I assist you today?",
      "I understand your concern. Let me help you with that.",
      "That's a great question! Here's what I can tell you...",
      "I'd be happy to help you with that issue.",
      "Let me check that for you right away."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, 'system');
    
    // Show unread badge if chat is closed
    if (!isChatOpen) {
      unreadCount++;
      const unreadBadge = document.getElementById('unreadBadge');
      unreadBadge.textContent = unreadCount;
      unreadBadge.style.display = 'flex';
    }
  }, 1000 + Math.random() * 2000);
}

function addMessage(text, sender) {
  const chatMessagesContainer = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.innerHTML = `
    <p>${text}</p>
    <span class="message-time">${time}</span>
  `;
  
  chatMessagesContainer.appendChild(messageDiv);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  
  // Store message in the global chatMessages array
  chatMessages.push({ text, sender, time: new Date() });
}

// Modal Functions
function showThankYouModal() {
  const modal = document.getElementById('thankYouModal');
  modal.classList.add('show');
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    closeThankYouModal();
  }, 5000);
}

function closeThankYouModal() {
  const modal = document.getElementById('thankYouModal');
  modal.classList.remove('show');
}

// Contact Button Handlers
function initializeContactButtons() {
  document.getElementById('startChatBtn').addEventListener('click', () => {
    openChat();
    showToast('Chat support is now available', 'info');
  });
  
  document.getElementById('callNowBtn').addEventListener('click', () => {
    showToast('Dialing 1800-AGRO-HELP...', 'info');
    // In a real app, this would trigger a phone call
    setTimeout(() => {
      showToast('Call connected to support team', 'success');
    }, 2000);
  });
  
  document.getElementById('sendEmailBtn').addEventListener('click', () => {
    showToast('Opening email client...', 'info');
    window.location.href = 'mailto:support@agrochain.com';
  });
  
  document.getElementById('contactSupportBtn').addEventListener('click', () => {
    openChat();
    showToast('Connecting you to our support team', 'info');
  });
}

// Form Submission
function initializeFormSubmission() {
  const feedbackForm = document.getElementById('feedbackForm');
  
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please correct the errors in the form', 'error');
      return;
    }
    
    showLoading('Submitting your feedback...');
    
    // Simulate form submission
    setTimeout(() => {
      hideLoading();
      
      // Get form data
      const formData = new FormData(feedbackForm);
      const feedback = {
        name: formData.get('userName'),
        email: formData.get('userEmail'),
        role: formData.get('userRole'),
        rating: currentRating,
        category: formData.get('feedbackCategory'),
        feedback: formData.get('feedbackText'),
        contactMe: formData.get('contactMe') === 'on',
        timestamp: new Date().toISOString()
      };
      
      // Store feedback (in real app, this would be sent to server)
      console.log('Feedback submitted:', feedback);
      localStorage.setItem('lastFeedback', JSON.stringify(feedback));
      
      // Reset form
      feedbackForm.reset();
      currentRating = 0;
      updateStarDisplay();
      document.getElementById('charCount').textContent = '0';
      
      // Show thank you modal
      showThankYouModal();
      
      // Show success toast
      showToast('Thank you for your feedback!', 'success');
      
    }, 2000);
  });
}

// Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  }
}

// Auto-refresh functionality
function initializeAutoRefresh() {
  // Refresh chat status every 30 seconds
  setInterval(() => {
    if (isChatOpen) {
      // Simulate checking agent availability
      const statusIndicator = document.querySelector('.status-indicator');
      const isOnline = Math.random() > 0.1; // 90% chance of being online
      
      if (isOnline) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        document.querySelector('.status-text').textContent = 'Agents Online';
      } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        document.querySelector('.status-text').textContent = 'Agents Offline';
      }
    }
  }, 30000);
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to open chat
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      if (isChatOpen) {
        closeChat();
      } else {
        openChat();
      }
    }
    
    // Escape to close modals and chat
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal.show');
      if (modal) {
        modal.classList.remove('show');
      } else if (isChatOpen) {
        closeChat();
      }
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Support & Feedback screen initialized');
  
  // Initialize all components
  initializeStarRating();
  initializeCharacterCounter();
  initializeFAQ();
  initializeChat();
  initializeContactButtons();
  initializeFormSubmission();
  initializeKeyboardShortcuts();
  
  // Initialize modal close buttons
  document.getElementById('closeThankYou').addEventListener('click', closeThankYouModal);
  
  // Close modal when clicking outside
  document.getElementById('thankYouModal').addEventListener('click', (e) => {
    if (e.target.id === 'thankYouModal') {
      closeThankYouModal();
    }
  });
  
  // Start auto-refresh
  initializeAutoRefresh();
  
  // Register service worker
  registerServiceWorker();
  
  // Show welcome message
  setTimeout(() => {
    showToast('Welcome to AgroChain Support! How can we help you today?', 'info', 8000);
  }, 1000);
  
  // Simulate some initial chat messages
  setTimeout(() => {
    if (!isChatOpen) {
      addMessage("Hi! I'm here to help you with any questions about AgroChain. Feel free to ask!", 'system');
      unreadCount = 1;
      const unreadBadge = document.getElementById('unreadBadge');
      unreadBadge.textContent = unreadCount;
      unreadBadge.style.display = 'flex';
    }
  }, 5000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Page is visible, could refresh data if needed
    console.log('Page became visible');
  } else {
    // Page is hidden, could pause certain activities
    console.log('Page became hidden');
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  showToast('Connection restored! You\'re back online.', 'success');
});

window.addEventListener('offline', () => {
  showToast('Connection lost! Some features may be limited.', 'warning');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail,
    validateName,
    validateFeedback,
    formatCurrency,
    formatNumber,
    showToast,
    showLoading,
    hideLoading
  };
}