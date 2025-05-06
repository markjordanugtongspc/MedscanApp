/**
 * Authentication JavaScript for MedScan App
 * This file handles form validation and submission for the sign-up process
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const showPasswordCheckbox = document.getElementById('show-signup-password');
    
    // Email error message element (will be created dynamically)
    let emailErrorElement = null;
    
    // Password error message element (will be created dynamically)
    let passwordErrorElement = null;
    
    // Valid email domains
    const validDomains = ['@gmail.com', '@yahoomail.com', '@yahoo.com'];
    
    /**
     * Validates if the email has an acceptable domain
     * @param {string} email - The email to validate
     * @returns {boolean} - True if email domain is valid, false otherwise
     */
    function isValidEmailDomain(email) {
        return validDomains.some(domain => email.toLowerCase().endsWith(domain));
    }
    
    /**
     * Validates if the password meets requirements:
     * - At least 8 characters
     * - Contains letters
     * - Contains numbers
     * - Contains symbols
     * @param {string} password - The password to validate
     * @returns {boolean} - True if password meets all requirements, false otherwise
     */
    function isValidPassword(password) {
        // Check length
        if (password.length < 8) return false;
        
        // Check for letters
        if (!/[a-zA-Z]/.test(password)) return false;
        
        // Check for numbers
        if (!/[0-9]/.test(password)) return false;
        
        // Check for symbols
        if (!/[^a-zA-Z0-9]/.test(password)) return false;
        
        return true;
    }
    
    /**
     * Shows an error message for the email input
     * @param {string} message - The error message to display
     */
    function showEmailError(message) {
        // Remove existing error message if it exists
        if (emailErrorElement) {
            emailErrorElement.remove();
        }
        
        // Create new error message element
        emailErrorElement = document.createElement('div');
        emailErrorElement.className = 'text-red-500 text-sm mt-1';
        emailErrorElement.textContent = message;
        
        // Insert error message after email input container
        emailInput.parentElement.parentElement.appendChild(emailErrorElement);
    }
    
    /**
     * Shows an error message for the password input
     * @param {string} message - The error message to display
     */
    function showPasswordError(message) {
        // Remove existing error message if it exists
        if (passwordErrorElement) {
            passwordErrorElement.remove();
        }
        
        // Create new error message element
        passwordErrorElement = document.createElement('div');
        passwordErrorElement.className = 'text-red-500 text-sm mt-1';
        passwordErrorElement.textContent = message;
        
        // Insert error message after password input container
        passwordInput.parentElement.parentElement.appendChild(passwordErrorElement);
    }
    
    /**
     * Removes the email error message if it exists
     */
    function removeEmailError() {
        if (emailErrorElement) {
            emailErrorElement.remove();
            emailErrorElement = null;
        }
    }
    
    /**
     * Removes the password error message if it exists
     */
    function removePasswordError() {
        if (passwordErrorElement) {
            passwordErrorElement.remove();
            passwordErrorElement = null;
        }
    }
    
    /**
     * Validates the email input
     * @returns {boolean} - True if email is valid, false otherwise
     */
    function validateEmail() {
        const email = emailInput.value.trim();
        
        // Check if email is empty
        if (!email) {
            showEmailError('Email is required');
            return false;
        }
        
        // Check if email format is valid
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showEmailError('Please enter a valid email address');
            return false;
        }
        
        // Check if email domain is acceptable
        if (!isValidEmailDomain(email)) {
            showEmailError('The Email is Not Acceptable. Please use Gmail, Yahoo Mail, or Yahoo.');
            return false;
        }
        
        // Email is valid
        removeEmailError();
        return true;
    }
    
    /**
     * Validates the password input
     * @returns {boolean} - True if password is valid, false otherwise
     */
    function validatePassword() {
        const password = passwordInput.value;
        
        // Check if password is empty
        if (!password) {
            showPasswordError('Password is required');
            return false;
        }
        
        // Check if password meets requirements
        if (!isValidPassword(password)) {
            showPasswordError('Password must be at least 8 characters and include letters, numbers, and symbols');
            return false;
        }
        
        // Password is valid
        removePasswordError();
        return true;
    }
    
    /**
     * Validates the confirm password input
     * @returns {boolean} - True if confirm password matches password, false otherwise
     */
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Check if confirm password is empty
        if (!confirmPassword) {
            showPasswordError('Please confirm your password');
            return false;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showPasswordError('Passwords do not match');
            return false;
        }
        
        // Confirm password is valid
        removePasswordError();
        return true;
    }
    
    /**
     * Saves user data to localStorage
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     */
    function saveToLocalStorage(email, password) {
        const userData = {
            email: email,
            password: password,
            signupDate: new Date().toISOString()
        };
        
        localStorage.setItem('medscanUserData', JSON.stringify(userData));
    }
    
    // Event listener for email input to validate on blur
    emailInput.addEventListener('blur', validateEmail);
    
    // Event listener for email input to remove error on focus
    emailInput.addEventListener('focus', removeEmailError);
    
    // Event listener for password input to validate on blur
    passwordInput.addEventListener('blur', validatePassword);
    
    // Event listener for password input to remove error on focus
    passwordInput.addEventListener('focus', removePasswordError);
    
    // Event listener for confirm password input to validate on blur
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    
    // Event listener for confirm password input to remove error on focus
    confirmPasswordInput.addEventListener('focus', removePasswordError);
    
    // Event listener for show password checkbox
    showPasswordCheckbox.addEventListener('change', function() {
        // Toggle password visibility for both password fields
        const type = this.checked ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;
    });
    
    // Event listener for form submission
    signupForm.addEventListener('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();
        
        // Validate all inputs
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        // If all inputs are valid, save data and proceed
        if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Save user data to localStorage
            saveToLocalStorage(email, password);
            
            // Redirect to verification page
            window.location.href = 'verification.html';
        }
    });

    // Verification process is handled in otp.js
    
    /**
     * ===== EMAIL MASKING FUNCTIONALITY =====
     */
    
    /**
     * Masks an email address for privacy
     * Example: "user@example.com" becomes "us**@example.com"
     *
     * @param {string} email - The email address to mask
     * @returns {string} - The masked email address
     */
    function maskEmail(email) {
        if (!email) return '';
        
        const [username, domain] = email.split('@');
        
        // If username is very short, mask only the last character
        if (username.length <= 2) {
            return username.substring(0, 1) + '*' + '@' + domain;
        }
        
        // For longer usernames, show first 2 chars and mask the rest
        const visiblePart = username.substring(0, 2);
        const maskedPart = '*'.repeat(username.length - 2);
        
        return visiblePart + maskedPart + '@' + domain;
    }
    
    // Make maskEmail function available globally
    window.maskEmail = maskEmail;
    
    /**
     * ===== END EMAIL MASKING FUNCTIONALITY =====
     */
});