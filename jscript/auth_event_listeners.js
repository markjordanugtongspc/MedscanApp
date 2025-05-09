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