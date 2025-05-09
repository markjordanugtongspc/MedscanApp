import { signUpUser } from './auth_api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Set up sliding modals
    setupSlidingModals();
    
    // Set up other event listeners
    setupPasswordToggle();
    setupLoginLink();
});

/**
 * Set up sliding modals with proper event listeners
 */
function setupSlidingModals() {
    // Get modal elements
    const validationModal = document.getElementById('validation-modal');
    const successModal = document.getElementById('success-modal');
    const validationOverlay = document.getElementById('validation-overlay');
    const successOverlay = document.getElementById('success-overlay');
    const validationOkBtn = document.getElementById('validation-ok-btn');
    const declineTermsBtn = document.getElementById('decline-terms');
    
    // Function to show validation modal
    window.showValidationModal = function(message) {
        const validationMessage = document.getElementById('validation-message');
        if (validationMessage && message) {
            validationMessage.textContent = message;
        }
        
        if (validationModal) {
            validationModal.style.display = 'block';
            // Use setTimeout to ensure display block is applied before adding the class
            setTimeout(() => {
                validationModal.classList.remove('translate-y-full');
                validationModal.classList.add('translate-y-0');
            }, 10);
        }
    };
    
    // Function to hide validation modal
    window.hideValidationModal = function() {
        if (validationModal) {
            validationModal.classList.remove('translate-y-0');
            validationModal.classList.add('translate-y-full');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                validationModal.style.display = 'none';
            }, 300);
        }
    };
    
    // Function to show success modal (terms)
    window.showSuccessModal = function() {
        if (successModal) {
            successModal.style.display = 'block';
            // Use setTimeout to ensure display block is applied before adding the class
            setTimeout(() => {
                successModal.classList.remove('translate-y-full');
                successModal.classList.add('translate-y-0');
            }, 10);
        }
    };
    
    // Function to hide success modal
    window.hideSuccessModal = function() {
        if (successModal) {
            successModal.classList.remove('translate-y-0');
            successModal.classList.add('translate-y-full');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                successModal.style.display = 'none';
            }, 300);
        }
    };
    
    // Set up event listeners for modal interactions
    if (validationOkBtn) {
        validationOkBtn.addEventListener('click', window.hideValidationModal);
    }
    
    if (validationOverlay) {
        validationOverlay.addEventListener('click', window.hideValidationModal);
    }
    
    if (declineTermsBtn) {
        declineTermsBtn.addEventListener('click', window.hideSuccessModal);
    }
    
    if (successOverlay) {
        successOverlay.addEventListener('click', window.hideSuccessModal);
    }
}

/**
 * Set up password visibility toggle
 */
function setupPasswordToggle() {
    const showPasswordCheckbox = document.getElementById('show-signup-password');
    const passwordField = document.getElementById('signup-password');
    const confirmPasswordField = document.getElementById('signup-confirm-password');

    if (showPasswordCheckbox && passwordField && confirmPasswordField) {
        showPasswordCheckbox.addEventListener('change', function() {
            const type = this.checked ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            confirmPasswordField.setAttribute('type', type);
        });
    } else {
        console.warn("Password toggle elements not found.");
    }
}

/**
 * Set up login link navigation
 */
function setupLoginLink() {
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'login.html';
        });
    }
}

/**
 * Shows validation error modal with specified message
 * @param {string} message - The error message to display
 */
function showValidationError(message) {
    // Use the global showValidationModal function
    window.showValidationModal(message);
}

/**
 * Handle signup form submission
 * @param {Event} event - The form submission event
 */
async function handleSignupSubmit(event) {
    event.preventDefault();

    // Get form inputs
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');

    if (!emailInput || !passwordInput || !confirmPasswordInput) {
        console.error('Form inputs not found');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate form inputs
    if (!email || !password || !confirmPassword) {
        showValidationError('Please fill in all fields.');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showValidationError('Please enter a valid email address.');
        return;
    }

    // Validate email domain
    const allowedDomains = ['@gmail.com', '@yahoo.com', '@yahoomail.com', '@outlook.com'];
    const emailDomain = email.substring(email.indexOf('@')).toLowerCase();
    if (!allowedDomains.includes(emailDomain)) {
        showValidationError('Email domain not allowed. Please use Gmail, Yahoo, or Outlook email.');
        emailInput.value = '';
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        showValidationError('Passwords do not match.');
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        return;
    }

    // Validate password length
    if (password.length < 6) {
        showValidationError('Password must be at least 6 characters long.');
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        return;
    }

    // Show terms and conditions modal
    window.showSuccessModal();
    setupAcceptTermsHandler(email, password);
}

/**
 * Sets up the accept terms button handler
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
function setupAcceptTermsHandler(email, password) {
    const acceptTermsButton = document.getElementById('accept-terms');
    if (acceptTermsButton) {
        // Remove any existing event listeners
        const newAcceptButton = acceptTermsButton.cloneNode(true);
        acceptTermsButton.parentNode.replaceChild(newAcceptButton, acceptTermsButton);
        
        // Add new click handler
        newAcceptButton.addEventListener('click', async () => {
            try {
                const { data, error } = await signUpUser(email, password);

                if (error) {
                    console.error('Error during sign up:', error.message);
                    window.hideSuccessModal();
                    showValidationError(`Signup failed: ${error.message}`);
                } else {
                    console.log('Signup successful:', data);
                    window.location.href = 'verification.html';
                }
            } catch (err) {
                console.error('An unexpected error occurred:', err);
                window.hideSuccessModal();
                showValidationError('An unexpected error occurred. Please try again.');
            }
        });
    } else {
        console.error("Accept terms button not found.");
    }
}

/**
 * Handle back to login button click
 */
function handleBackToLogin() {
    window.location.href = 'login.html';
}

// Expose functions to global scope
window.handleSignupSubmit = handleSignupSubmit;
window.handleBackToLogin = handleBackToLogin;

// ===== LOGIN FUNCTIONALITY =====

import { loginUser } from './auth_api.js';

/**
 * Set up login page functionality
 */
function setupLoginPage() {
    setupLoginSlidingModals();
    setupLoginPasswordToggle();
    setupLoginForm();
}

/**
 * Set up sliding modals for login page
 */
function setupLoginSlidingModals() {
    // Get modal elements
    const validationModal = document.getElementById('validation-modal');
    const validationOverlay = document.getElementById('validation-overlay');
    const validationOkBtn = document.getElementById('validation-ok-btn');
    
    console.log('Setting up login sliding modals with elements:', { validationModal, validationOverlay, validationOkBtn });
    
    // Function to show validation modal
    window.showValidationModal = function(message) {
        console.log('Showing validation modal with message:', message);
        const validationMessage = document.getElementById('validation-message');
        if (validationMessage && message) {
            validationMessage.textContent = message;
        }
        
        if (validationModal) {
            validationModal.style.display = 'block';
            // Use setTimeout to ensure display block is applied before adding the class
            setTimeout(() => {
                validationModal.classList.remove('translate-y-full');
                validationModal.classList.add('translate-y-0');
            }, 10);
        } else {
            console.error('Validation modal element not found');
        }
    };
    
    // Function to hide validation modal
    window.hideValidationModal = function() {
        console.log('Hiding validation modal');
        if (validationModal) {
            validationModal.classList.remove('translate-y-0');
            validationModal.classList.add('translate-y-full');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                validationModal.style.display = 'none';
            }, 300);
        } else {
            console.error('Validation modal element not found when trying to hide');
        }
    };
    
    // Set up event listeners for modal interactions
    if (validationOkBtn) {
        validationOkBtn.addEventListener('click', window.hideValidationModal);
        console.log('Added click listener to validation OK button');
    } else {
        console.error('Validation OK button not found');
    }
    
    if (validationOverlay) {
        validationOverlay.addEventListener('click', window.hideValidationModal);
        console.log('Added click listener to validation overlay');
    } else {
        console.error('Validation overlay not found');
    }
}

/**
 * Set up password visibility toggle for login page
 */
function setupLoginPasswordToggle() {
    const showPasswordCheckbox = document.getElementById('show-password');
    const passwordField = document.getElementById('password');

    if (showPasswordCheckbox && passwordField) {
        showPasswordCheckbox.addEventListener('change', function() {
            const type = this.checked ? 'text' : 'password';
            passwordField.setAttribute('type', type);
        });
    }
}

/**
 * Set up login form submission
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

/**
 * Handle login form submission
 * @param {Event} event - The form submission event
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    console.log('Handling login form submission');

    // Get form inputs
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput || !passwordInput) {
        console.error('Form inputs not found');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    console.log('Login attempt with email:', email);

    // Validate form inputs
    if (!email || !password) {
        console.log('Empty fields detected');
        window.showValidationModal('Please fill in all fields.');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('Invalid email format');
        window.showValidationModal('Please enter a valid email address.');
        return;
    }

    try {
        // Attempt to login
        console.log('Calling loginUser function with:', { email, password });
        const { data, error } = await loginUser(email, password);
        console.log('Login response:', { data, error });

        if (error) {
            console.error('Error during login:', error.message);
            window.showValidationModal(`Login failed: ${error.message}`);
            return;
        }

        if (!data) {
            window.showValidationModal('Invalid email or password. Please try again.');
            return;
        }

        console.log('Login successful:', data);
        
        // Create authentication session
        createAuthSession(data);
        console.log('Auth session created, redirecting to dashboard');
        
        // Redirect to dashboard - use the correct path
        window.location.href = 'dashboard.html';
    } catch (err) {
        console.error('An unexpected error occurred:', err);
        window.showValidationModal('An unexpected error occurred. Please try again.');
    }
}

// Expose login functions to global scope
window.setupLoginPage = setupLoginPage;
window.handleLoginSubmit = handleLoginSubmit;

// ===== DASHBOARD FUNCTIONALITY =====

/**
 * Check if user is authenticated and can access the dashboard
 * @returns {boolean} True if user is authenticated, false otherwise
 */
function isAuthenticated() {
    // Check for session data in localStorage
    const authSession = localStorage.getItem('authSession');
    if (!authSession) {
        return false;
    }
    
    try {
        const session = JSON.parse(authSession);
        // Check if session contains required user data and hasn't expired
        if (!session.user || !session.email || !session.timestamp) {
            return false;
        }
        
        // Check if session has expired (24 hour validity)
        const now = new Date().getTime();
        const sessionTime = session.timestamp;
        const DAY_IN_MS = 24 * 60 * 60 * 1000;
        
        if (now - sessionTime > DAY_IN_MS) {
            // Session expired, clear it
            localStorage.removeItem('authSession');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error parsing auth session:', error);
        return false;
    }
}

/**
 * Create auth session after successful login
 * @param {Object} userData - User data to store in session
 */
function createAuthSession(userData) {
    const session = {
        user: userData,
        email: userData.Email,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('authSession', JSON.stringify(session));
}

/**
 * Check authentication on dashboard page load
 */
function setupDashboardAuth() {
    // Only run on dashboard page
    if (!window.location.pathname.includes('/dashboard.html')) {
        return;
    }
    
    console.log('Setting up dashboard authentication check');
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User authenticated, setting up dashboard');
    // User is authenticated, set up dashboard
    setupDashboardNavigation();
}

/**
 * Set up dashboard navigation
 */
function setupDashboardNavigation() {
    console.log('Setting up dashboard navigation');
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    // Set up click handlers for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section ID from the href
            const targetId = link.getAttribute('href').substring(1);
            
            // Hide all sections and remove active class from nav links
            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active-section');
            });
            
            navLinks.forEach(navLink => {
                navLink.classList.remove('text-[#199B91]');
                navLink.classList.add('text-gray-500', 'hover:text-[#199B91]');
            });
            
            // Show the target section and set active class on the clicked link
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('active-section');
            }
            
            // Update the active link styling
            document.querySelectorAll(`nav a[href="#${targetId}"]`).forEach(activeLink => {
                activeLink.classList.remove('text-gray-500', 'hover:text-[#199B91]');
                activeLink.classList.add('text-[#199B91]');
            });
        });
    });
}

/**
 * Log out the user
 */
function logoutUser() {
    // Clear auth session
    localStorage.removeItem('authSession');
    // Redirect to login page
    window.location.href = '../index.html';
}

// This section is intentionally removed as it's a duplicate of the handleLoginSubmit function above

// Initialize dashboard auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the dashboard page
    if (window.location.pathname.includes('/dashboard.html')) {
        setupDashboardAuth();
    }
});

// Expose dashboard functions to global scope
window.setupDashboardAuth = setupDashboardAuth;
window.setupDashboardNavigation = setupDashboardNavigation;
window.logoutUser = logoutUser;