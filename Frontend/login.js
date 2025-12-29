// Define API URL at the top of the file - only if not already defined
if (typeof API_URL === 'undefined') {
    var API_URL = 'http://localhost:8000';
}

// AgroChain Login JavaScript

// Language translations
const translations = {
    en: {
        appTitle: "AgroChain",
        appSubtitle: "The Future of Agriculture",
        loginInputLabel: "Email or Phone Number",
        passwordLabel: "Password",
        rememberText: "Remember me",
        loginBtnText: "Login",
        forgotLink: "Forgot Password?",
        signupLink: "Create Account",
        demoTitle: "Demo Credentials",
        demoBtnText: "Use Demo Account",
        socialText: "Or login with",
        successText: "Login successful! Redirecting...",
        errorText: "Invalid credentials. Please try again.",
        loadingText: "Logging in...",
        loginInputError: "Please enter a valid email or phone number",
        passwordError: "Password must be at least 6 characters"
    },
    mr: {
        appTitle: "अ‍ॅग्रोचेन",
        appSubtitle: "शेतीचे भविष्य",
        loginInputLabel: "ईमेल किंवा फोन नंबर",
        passwordLabel: "पासवर्ड",
        rememberText: "मला लक्षात ठेवा",
        loginBtnText: "लॉगिन करा",
        forgotLink: "पासवर्ड विसरलात?",
        signupLink: "खाते तयार करा",
        demoTitle: "डेमो क्रेडेन्शियल्स",
        demoBtnText: "डेमो खाते वापरा",
        socialText: "किंवा लॉगिन करा",
        successText: "लॉगिन यशस्वी! रीडायरेक्ट करत आहे...",
        errorText: "अवैध क्रेडेन्शियल्स. कृपया पुन्हा प्रयत्न करा.",
        loadingText: "लॉगिन करत आहे...",
        loginInputError: "कृपया वैध ईमेल किंवा फोन नंबर प्रविष्ट करा",
        passwordError: "पासवर्ड किमान 6 अक्षरे असावी"
    },
    hi: {
        appTitle: "एग्रोचेन",
        appSubtitle: "कृषि का भविष्य",
        loginInputLabel: "ईमेल या फोन नंबर",
        passwordLabel: "पासवर्ड",
        rememberText: "मुझे याद रखें",
        loginBtnText: "लॉगिन करें",
        forgotLink: "पासवर्ड भूल गए?",
        signupLink: "खाता बनाएं",
        demoTitle: "डेमो क्रेडेंशियल्स",
        demoBtnText: "डेमो खाता उपयोग करें",
        socialText: "या लॉगिन करें",
        successText: "लॉगिन सफल! रीडायरेक्ट कर रहा है...",
        errorText: "अमान्य क्रेडेंशियल्स। कृपया पुनः प्रयास करें।",
        loadingText: "लॉगिन कर रहा है...",
        loginInputError: "कृपया वैध ईमेल या फोन नंबर दर्ज करें",
        passwordError: "पासवर्ड कम से कम 6 अक्षर होना चाहिए"
    }
};

// Demo credentials
const demoCredentials = [
    { login: "farmer@demo.com", password: "demo123" },
    { login: "user@agro.com", password: "agro123" },
    { login: "9876543210", password: "demo123" },
    { login: "9123456789", password: "agro123" }
];

// Current language
let currentLang = 'en';

// DOM elements
const loginForm = document.getElementById('loginForm');
const loginInput = document.getElementById('loginInput');
const passwordInput = document.getElementById('password');
const loadingOverlay = document.getElementById('loadingOverlay');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language
    const savedLang = localStorage.getItem('agrochain-lang') || 'en';
    currentLang = savedLang;
    document.getElementById('languageSelect').value = savedLang;
    updateLanguage();
    
    // Load saved credentials if remember me was checked
    const savedLogin = localStorage.getItem('agrochain-remember-login');
    const savedPassword = localStorage.getItem('agrochain-remember-password');
    
    if (savedLogin && savedPassword) {
        loginInput.value = savedLogin;
        passwordInput.value = savedPassword;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('agrochain-token');
    if (token) {
        checkAuthStatus(token);
    }
    
    // Add input event listeners for real-time validation
    loginInput.addEventListener('input', validateLoginInput);
    passwordInput.addEventListener('input', validatePassword);
    
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Forgot password link
    document.getElementById('forgotLink').addEventListener('click', handleForgotPassword);
    
    // Signup link
    document.getElementById('signupLink').addEventListener('click', handleSignup);
    
    // Social login buttons
    document.querySelector('.social-btn.google').addEventListener('click', handleGoogleLogin);
    document.querySelector('.social-btn.phone').addEventListener('click', handlePhoneLogin);
});

// Language change function
function changeLanguage() {
    const selectedLang = document.getElementById('languageSelect').value;
    currentLang = selectedLang;
    localStorage.setItem('agrochain-lang', selectedLang);
    updateLanguage();
}

// Update language on the page
function updateLanguage() {
    const t = translations[currentLang];
    
    // Update all text elements
    document.getElementById('appTitle').textContent = t.appTitle;
    document.getElementById('appSubtitle').textContent = t.appSubtitle;
    document.getElementById('loginInputLabel').textContent = t.loginInputLabel;
    document.getElementById('passwordLabel').textContent = t.passwordLabel;
    document.getElementById('rememberText').textContent = t.rememberText;
    document.getElementById('loginBtnText').textContent = t.loginBtnText;
    document.getElementById('forgotLink').textContent = t.forgotLink;
    document.getElementById('signupLink').textContent = t.signupLink;
    document.getElementById('demoTitle').textContent = t.demoTitle;
    document.getElementById('demoBtnText').textContent = t.demoBtnText;
    document.getElementById('socialText').textContent = t.socialText;
    document.getElementById('successText').textContent = t.successText;
    document.getElementById('errorText').textContent = t.errorText;
    document.getElementById('loadingText').textContent = t.loadingText;
}

// Validate login input (email or phone)
function validateLoginInput() {
    const value = loginInput.value.trim();
    const errorElement = document.getElementById('loginInputError');
    
    if (!value) {
        showError(errorElement, '');
        loginInput.classList.remove('error');
        return false;
    }
    
    // Check if it's email or phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^[6-9]\d{9}$/.test(value);
    
    if (isEmail || isPhone) {
        showError(errorElement, '');
        loginInput.classList.remove('error');
        return true;
    } else {
        showError(errorElement, translations[currentLang].loginInputError);
        loginInput.classList.add('error');
        return false;
    }
}

// Validate password
function validatePassword() {
    const value = passwordInput.value;
    const errorElement = document.getElementById('passwordError');
    
    if (!value) {
        showError(errorElement, '');
        passwordInput.classList.remove('error');
        return false;
    }
    
    if (value.length >= 6) {
        showError(errorElement, '');
        passwordInput.classList.remove('error');
        return true;
    } else {
        showError(errorElement, translations[currentLang].passwordError);
        passwordInput.classList.add('error');
        return false;
    }
}

// Show error message
function showError(element, message) {
    element.textContent = message;
    if (message) {
        element.classList.add('show');
    } else {
        element.classList.remove('show');
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    // Validate inputs
    const isLoginValid = validateLoginInput();
    const isPasswordValid = validatePassword();
    
    if (!isLoginValid || !isPasswordValid) {
        showNotification('error', translations[currentLang].errorText);
        return;
    }
    
    // Show loading
    showLoading(true);
    
    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value;
    
    // Call the backend API
    console.log('Sending login request to:', `${API_URL}/api/auth/login`);
    
    fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loginInput: loginValue,
            password: passwordValue
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Save token and user data
            localStorage.setItem('agrochain-token', data.token);
            localStorage.setItem('agrochain-user', JSON.stringify(data.user));
            
            // Handle remember me
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('agrochain-remember-login', loginValue);
                localStorage.setItem('agrochain-remember-password', passwordValue);
            } else {
                localStorage.removeItem('agrochain-remember-login');
                localStorage.removeItem('agrochain-remember-password');
            }
            
            // Save current user
            localStorage.setItem('agrochain-current-user', loginValue);
            
            // Show success
            showLoading(false);
            showNotification('success', translations[currentLang].successText);
            
            // Redirect based on user role
            setTimeout(() => {
                if (data.user.role === 'farmer') {
                    window.location.href = 'farmer-dashboard.html';
                } else {
                    window.location.href = 'buyer-dashboard.html';
                }
            }, 1500);
        } else {
            showLoading(false);
            showNotification('error', data.message || translations[currentLang].errorText);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showLoading(false);
        showNotification('error', translations[currentLang].errorText);
    });
}

// Toggle password visibility
function togglePassword() {
    const toggleBtn = document.querySelector('.toggle-password');
    const icon = toggleBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Fill demo credentials
function fillDemoCredentials() {
    const randomCred = demoCredentials[Math.floor(Math.random() * demoCredentials.length)];
    loginInput.value = randomCred.login;
    passwordInput.value = randomCred.password;
    
    // Trigger validation
    validateLoginInput();
    validatePassword();
    
    // Show notification
    showNotification('success', 'Demo credentials filled!');
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault();
    
    const loginValue = loginInput.value.trim();
    if (!loginValue) {
        showNotification('error', 'Please enter your email or phone number first');
        loginInput.focus();
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        showNotification('success', 'Password reset link sent to your email/phone!');
    }, 1500);
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    // Redirect to main index.html which has the registration form
    window.location.href = 'index.html#signup';
}

// Handle Google login
function handleGoogleLogin(e) {
    e.preventDefault();
    showNotification('info', 'Google login coming soon!');
}

// Handle phone login
function handlePhoneLogin(e) {
    e.preventDefault();
    showNotification('info', 'Phone OTP login coming soon!');
}

// Show/hide loading overlay
function showLoading(show) {
    if (show) {
        loadingOverlay.style.display = 'flex';
    } else {
        loadingOverlay.style.display = 'none';
    }
}

// Show notification
function showNotification(type, message) {
    const messageElement = type === 'success' ? successMessage : errorMessage;
    const textElement = messageElement.querySelector('p');
    
    textElement.textContent = message;
    messageElement.classList.add('show');
    
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('agrochain-current-user');
    if (currentUser) {
        // User is already logged in, redirect to main hub
        window.location.href = 'project-index.html';
    }
});