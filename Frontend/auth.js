// AgroChain Authentication Module

// Check if user is authenticated
function checkAuthentication() {
    const currentUser = localStorage.getItem('agrochain-current-user');
    if (!currentUser) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('agrochain-current-user');
    localStorage.removeItem('agrochain-remember-login');
    localStorage.removeItem('agrochain-remember-password');
    window.location.href = 'login.html';
}

// Get current user info
function getCurrentUser() {
    return localStorage.getItem('agrochain-current-user');
}

// Initialize authentication check when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Don't check authentication on login page itself
    if (!window.location.pathname.includes('login.html')) {
        checkAuthentication();
    }
});

// Add logout functionality to logout buttons
document.addEventListener('DOMContentLoaded', function() {
    const logoutButtons = document.querySelectorAll('.logout-btn, [onclick*="logout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});