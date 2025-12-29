// Define API URL at the top of the file - only if not already defined
if (typeof API_URL === 'undefined') {
    var API_URL = 'http://localhost:8000';
}

// AgroChain - Agricultural Marketplace JavaScript

// Language translations
const translations = {
    en: {
        appTitle: "AgroChain",
        appSubtitle: "Your Agricultural Marketplace",
        loginTitle: "Login",
        loginPhoneEmailLabel: "Phone/Email",
        loginPasswordLabel: "Password",
        forgotPassword: "Forgot Password?",
        loginButton: "Login",
        orText: "Or login with",
        noAccountText: "Don't have an account?",
        signupButton: "Sign Up",
        signupTitle: "Sign Up",
        signupNameLabel: "Full Name",
        signupAadhaarLabel: "Aadhaar/ID Number",
        signupPhoneLabel: "Phone Number",
        signupEmailLabel: "Email",
        signupPasswordLabel: "Password",
        signupConfirmPasswordLabel: "Confirm Password",
        createAccountButton: "Create Account",
        haveAccountText: "Already have an account?",
        backToLoginButton: "Back to Login",
        forgotPasswordTitle: "Forgot Password?",
        forgotPasswordText: "Enter your phone or email to reset your password",
        resetPasswordButton: "Send Reset Link"
    },
    mr: {
        appTitle: "अॅग्रोचेन",
        appSubtitle: "तुमचे कृषी बाजारपेठ",
        loginTitle: "लॉगिन",
        loginPhoneEmailLabel: "फोन/ईमेल",
        loginPasswordLabel: "पासवर्ड",
        forgotPassword: "पासवर्ड विसरलात?",
        loginButton: "लॉगिन करा",
        orText: "किंवा लॉगिन करा",
        noAccountText: "खाते नाही?",
        signupButton: "साइन अप करा",
        signupTitle: "साइन अप करा",
        signupNameLabel: "पूर्ण नाव",
        signupAadhaarLabel: "आधार/आयडी क्रमांक",
        signupPhoneLabel: "फोन क्रमांक",
        signupEmailLabel: "ईमेल",
        signupPasswordLabel: "पासवर्ड",
        signupConfirmPasswordLabel: "पासवर्ड पुष्टी करा",
        createAccountButton: "खाते तयार करा",
        haveAccountText: "आधीच खाते आहे?",
        backToLoginButton: "लॉगिनवर परत जा",
        forgotPasswordTitle: "पासवर्ड विसरलात?",
        forgotPasswordText: "तुमचा फोन किंवा ईमेल प्रविष्ट करा पासवर्ड रीसेट करण्यासाठी",
        resetPasswordButton: "रीसेट लिंक पाठवा"
    },
    hi: {
        appTitle: "एग्रोचेन",
        appSubtitle: "आपकी कृषि बाजार",
        loginTitle: "लॉगिन",
        loginPhoneEmailLabel: "फोन/ईमेल",
        loginPasswordLabel: "पासवर्ड",
        forgotPassword: "पासवर्ड भूल गए?",
        loginButton: "लॉगिन करें",
        orText: "या लॉगिन करें",
        noAccountText: "खाता नहीं है?",
        signupButton: "साइन अप करें",
        signupTitle: "साइन अप करें",
        signupNameLabel: "पूरा नाम",
        signupAadhaarLabel: "आधार/आईडी नंबर",
        signupPhoneLabel: "फोन नंबर",
        signupEmailLabel: "ईमेल",
        signupPasswordLabel: "पासवर्ड",
        signupConfirmPasswordLabel: "पासवर्ड की पुष्टि करें",
        createAccountButton: "खाता बनाएं",
        haveAccountText: "पहले से खाता है?",
        backToLoginButton: "लॉगिन पर वापस जाएं",
        forgotPasswordTitle: "पासवर्ड भूल गए?",
        forgotPasswordText: "अपना फोन या ईमेल दर्ज करें पासवर्ड रीसेट करने के लिए",
        resetPasswordButton: "रीसेट लिंक भेजें"
    }
};

// Current language
let currentLanguage = 'en';

// Change language function
function changeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        currentLanguage = languageSelect.value;
        updateLanguage();
    }
}

// Update language throughout the page
function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Update all text elements with null checks
    const elements = {
        'appTitle': t.appTitle,
        'appSubtitle': t.appSubtitle,
        'loginTitle': t.loginTitle,
        'loginPhoneEmailLabel': t.loginPhoneEmailLabel,
        'loginPasswordLabel': t.loginPasswordLabel,
        'forgotPassword': t.forgotPassword,
        'orText': t.orText,
        'noAccountText': t.noAccountText,
        'signupButton': t.signupButton,
        'signupTitle': t.signupTitle,
        'signupNameLabel': t.signupNameLabel,
        'signupAadhaarLabel': t.signupAadhaarLabel,
        'signupPhoneLabel': t.signupPhoneLabel,
        'signupEmailLabel': t.signupEmailLabel,
        'signupPasswordLabel': t.signupPasswordLabel,
        'signupConfirmPasswordLabel': t.signupConfirmPasswordLabel,
        'haveAccountText': t.haveAccountText,
        'backToLoginButton': t.backToLoginButton,
        'forgotPasswordTitle': t.forgotPasswordTitle,
        'forgotPasswordText': t.forgotPasswordText,
        'resetPasswordButton': t.resetPasswordButton
    };
    
    for (const [id, text] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
    
    // Update button HTML with icons
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.innerHTML = `<i class="fas fa-sign-in-alt"></i> ${t.loginButton}`;
    }
    
    const createAccountButton = document.getElementById('createAccountButton');
    if (createAccountButton) {
        createAccountButton.innerHTML = `<i class="fas fa-user-plus"></i> ${t.createAccountButton}`;
    }
}

// Toggle between login and signup forms
function showSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function showLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show forgot password modal
function showForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'block';
}

function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
}

// Form validation functions
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateAadhaar(aadhaar) {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const phoneEmail = document.getElementById('loginPhoneEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!phoneEmail) {
        showAlert('Please enter phone or email');
        return;
    }
    
    if (!password) {
        showAlert('Please enter password');
        return;
    }
    
    // Validate phone or email format
    const isPhone = /^[0-9]+$/.test(phoneEmail);
    if (isPhone && !validatePhone(phoneEmail)) {
        showAlert('Please enter a valid phone number');
        return;
    }
    
    if (!isPhone && !validateEmail(phoneEmail)) {
        showAlert('Please enter a valid email address');
        return;
    }
    
    // Simulate login process
    simulateLogin(phoneEmail, password);
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const aadhaar = document.getElementById('signupAadhaar').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!name) {
        showAlert('Please enter your full name');
        return;
    }
    
    if (!aadhaar) {
        showAlert('Please enter Aadhaar/ID number');
        return;
    }
    
    if (!validateAadhaar(aadhaar)) {
        showAlert('Please enter a valid 12-digit Aadhaar number');
        return;
    }
    
    if (!phone) {
        showAlert('Please enter phone number');
        return;
    }
    
    if (!validatePhone(phone)) {
        showAlert('Please enter a valid 10-digit phone number');
        return;
    }
    
    if (!email) {
        showAlert('Please enter email address');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showAlert('Please enter password');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match');
        return;
    }
    
    // Simulate signup process
    simulateSignup(name, aadhaar, phone, email, password);
}

// Simulate login process
function simulateLogin(phoneEmail, password) {
    const loginButton = document.getElementById('loginButton');
    loginButton.classList.add('loading');
    loginButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
        
        // Simulate successful login
        showAlert('Login successful! Redirecting to dashboard...', 'success');
        
        // Save login state and redirect to main hub after 2 seconds
        setTimeout(() => {
            localStorage.setItem('agrochain-current-user', phoneEmail);
            window.location.href = 'project-index.html';
        }, 2000);
    }, 2000);
}

// Process signup with real API call
function simulateSignup(name, aadhaar, phone, email, password) {
    const createAccountButton = document.getElementById('createAccountButton');
    createAccountButton.classList.add('loading');
    createAccountButton.disabled = true;
    
    console.log('Sending signup data to:', `${API_URL}/api/auth/register`);
    
    // Make actual API call to register endpoint
    fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email,
            phone,
            password,
            aadhaar
            // role omitted to use backend default ('buyer')
        })
    })
    .then(response => {
        console.log('Signup response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Signup response data:', data);
        createAccountButton.classList.remove('loading');
        createAccountButton.disabled = false;
        
        if (data.success) {
            // Successful signup
            showAlert('Account created successfully! Please login...', 'success');
            // Clear form and show login
            document.getElementById('signupFormElement').reset();
            showLogin();
        } else {
            // Failed signup
            showAlert(data.message || 'Registration failed. Please try again later.', 'error');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        createAccountButton.classList.remove('loading');
        createAccountButton.disabled = false;
        showAlert('Registration failed. Please try again later.', 'error');
    });
}

// Google login simulation
function googleLogin() {
    showAlert('Google login coming soon!', 'info');
}

// SMS login simulation
function smsLogin() {
    showAlert('SMS login coming soon!', 'info');
}

// Reset password simulation
function resetPassword() {
    const input = document.getElementById('forgotPasswordInput').value.trim();
    
    if (!input) {
        showAlert('Please enter phone or email');
        return;
    }
    
    // Simulate password reset
    showAlert('Password reset link sent to your phone/email!', 'success');
    closeForgotPassword();
}

// Show alert messages
function showAlert(message, type = 'error') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Style the alert
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    // Set background color based on type
    if (type === 'success') {
        alert.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        alert.style.backgroundColor = '#f44336';
    } else if (type === 'info') {
        alert.style.backgroundColor = '#2196F3';
    }
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('forgotPasswordModal');
    if (event.target === modal) {
        closeForgotPassword();
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set default language - only if languageSelect exists
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        currentLanguage = languageSelect.value;
        updateLanguage();
    }
    
    // Add input formatting with null checks
    const signupPhone = document.getElementById('signupPhone');
    if (signupPhone) {
        signupPhone.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }
    
    const signupAadhaar = document.getElementById('signupAadhaar');
    if (signupAadhaar) {
        signupAadhaar.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 12) {
                this.value = this.value.slice(0, 12);
            }
        });
    }
    
    const loginPhoneEmail = document.getElementById('loginPhoneEmail');
    if (loginPhoneEmail) {
        loginPhoneEmail.addEventListener('input', function(e) {
            // Allow both phone and email formats
            if (/^[0-9]+$/.test(this.value)) {
                // If only numbers, treat as phone
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            }
        });
    }
});