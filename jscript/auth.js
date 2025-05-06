// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the signup page
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    // Initialize signup form if it exists
    if (signupForm) {
        initializeSignupForm();
    }
    
    // Initialize login form if it exists
    if (loginForm) {
        initializeLoginForm();
    }
    
    // Function to initialize signup form
    function initializeSignupForm() {
        // Get references to all form elements
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('signup-confirm-password');
        const showPasswordCheckbox = document.getElementById('show-signup-password');
        
        // Create error message elements
        let emailErrorMsg = document.createElement('p');
        emailErrorMsg.className = 'text-red-500 text-xs mt-1 ml-3';
        emailInput.parentNode.parentNode.appendChild(emailErrorMsg);
        
        let passwordErrorMsg = document.createElement('p');
        passwordErrorMsg.className = 'text-red-500 text-xs mt-1 ml-3';
        passwordInput.parentNode.parentNode.appendChild(passwordErrorMsg);
        
        let confirmPasswordErrorMsg = document.createElement('p');
        confirmPasswordErrorMsg.className = 'text-red-500 text-xs mt-1 ml-3';
        confirmPasswordInput.parentNode.parentNode.appendChild(confirmPasswordErrorMsg);
        
        // Function to validate email domain
        function validateEmailDomain(email) {
            // List of allowed domains
            const allowedDomains = ['@gmail.com', '@yahoomail.com', '@yahoo.com'];
            
            // Check if email ends with any of the allowed domains
            return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
        }
        
        // Function to validate password strength
        function validatePassword(password) {
            // Check if password is at least 8 characters
            if (password.length < 8) {
                return {
                    valid: false,
                    message: 'Password must be at least 8 characters long'
                };
            }
            
            // Check if password contains letters
            if (!/[a-zA-Z]/.test(password)) {
                return {
                    valid: false,
                    message: 'Password must contain at least one letter'
                };
            }
            
            // Check if password contains numbers
            if (!/[0-9]/.test(password)) {
                return {
                    valid: false,
                    message: 'Password must contain at least one number'
                };
            }
            
            // Check if password contains symbols
            if (!/[^a-zA-Z0-9]/.test(password)) {
                return {
                    valid: false,
                    message: 'Password must contain at least one symbol'
                };
            }
            
            // If all checks pass, password is valid
            return {
                valid: true,
                message: ''
            };
        }
        
        // Function to handle email input validation
        function handleEmailValidation() {
            const email = emailInput.value.trim();
            
            if (email === '') {
                emailErrorMsg.textContent = 'Email is required';
                return false;
            } else if (!validateEmailDomain(email)) {
                emailErrorMsg.textContent = 'The Email is Not Acceptable. Use only @gmail.com, @yahoomail.com, or @yahoo.com';
                return false;
            } else {
                emailErrorMsg.textContent = '';
                return true;
            }
        }
        
        // Function to handle password input validation
        function handlePasswordValidation() {
            const password = passwordInput.value;
            const validation = validatePassword(password);
            
            if (!validation.valid) {
                passwordErrorMsg.textContent = validation.message;
                return false;
            } else {
                passwordErrorMsg.textContent = '';
                return true;
            }
        }
        
        // Function to handle confirm password validation
        function handleConfirmPasswordValidation() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword === '') {
                confirmPasswordErrorMsg.textContent = 'Please confirm your password';
                return false;
            } else if (password !== confirmPassword) {
                confirmPasswordErrorMsg.textContent = 'Passwords do not match';
                return false;
            } else {
                confirmPasswordErrorMsg.textContent = '';
                return true;
            }
        }
        
        // Add event listeners for real-time validation
        emailInput.addEventListener('blur', handleEmailValidation);
        passwordInput.addEventListener('blur', handlePasswordValidation);
        confirmPasswordInput.addEventListener('blur', handleConfirmPasswordValidation);
        
        // Toggle password visibility when checkbox is clicked
        function handleTogglePasswordVisibility() {
            const type = showPasswordCheckbox.checked ? 'text' : 'password';
            passwordInput.type = type;
            confirmPasswordInput.type = type;
        }
        
        showPasswordCheckbox.addEventListener('change', handleTogglePasswordVisibility);
        
        // Handle form submission
        function handleFormSubmit(event) {
            event.preventDefault();
            
            // Validate all inputs
            const isEmailValid = handleEmailValidation();
            const isPasswordValid = handlePasswordValidation();
            const isConfirmPasswordValid = handleConfirmPasswordValidation();
            
            // If all validations pass, save to localStorage
            if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
                const userData = {
                    email: emailInput.value.trim(),
                    password: passwordInput.value // In a real app, never store passwords in plain text
                };
                
                // Save to localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Show success message
                alert('Sign up successful!');
                
                // Reset form
                signupForm.reset();
                
                // Redirect to login page
                window.location.href = 'login.html';
            }
        }
        
        signupForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Function to initialize login form
    function initializeLoginForm() {
        // Get references to login form elements
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const showPasswordCheckbox = document.getElementById('show-password');
        
        // Create error message elements
        let emailErrorMsg = document.createElement('p');
        emailErrorMsg.className = 'text-red-500 text-xs mt-1 ml-3';
        emailInput.parentNode.parentNode.appendChild(emailErrorMsg);
        
        let passwordErrorMsg = document.createElement('p');
        passwordErrorMsg.className = 'text-red-500 text-xs mt-1 ml-3';
        passwordInput.parentNode.parentNode.appendChild(passwordErrorMsg);
        
        // Function to validate email domain
        function validateEmailDomain(email) {
            // List of allowed domains
            const allowedDomains = ['@gmail.com', '@yahoomail.com', '@yahoo.com'];
            
            // Check if email ends with any of the allowed domains
            return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
        }
        
        // Function to handle email input validation
        function handleEmailValidation() {
            const email = emailInput.value.trim();
            
            if (email === '') {
                emailErrorMsg.textContent = 'Email is required';
                return false;
            } else if (!validateEmailDomain(email)) {
                emailErrorMsg.textContent = 'The Email is Not Acceptable. Use only @gmail.com, @yahoomail.com, or @yahoo.com';
                return false;
            } else {
                emailErrorMsg.textContent = '';
                return true;
            }
        }
        
        // Function to handle password validation
        function handlePasswordValidation() {
            const password = passwordInput.value;
            
            if (password === '') {
                passwordErrorMsg.textContent = 'Password is required';
                return false;
            } else {
                passwordErrorMsg.textContent = '';
                return true;
            }
        }
        
        // Add event listeners for real-time validation
        emailInput.addEventListener('blur', handleEmailValidation);
        passwordInput.addEventListener('blur', handlePasswordValidation);
        
        // Toggle password visibility when checkbox is clicked
        function handleTogglePasswordVisibility() {
            passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
        }
        
        showPasswordCheckbox.addEventListener('change', handleTogglePasswordVisibility);
        
        // Handle login form submission
        function handleLoginSubmit(event) {
            event.preventDefault();
            
            // Validate inputs
            const isEmailValid = handleEmailValidation();
            const isPasswordValid = handlePasswordValidation();
            
            if (isEmailValid && isPasswordValid) {
                // Get stored user data
                const storedUserData = localStorage.getItem('userData');
                
                if (storedUserData) {
                    const userData = JSON.parse(storedUserData);
                    
                    // Check if credentials match
                    if (userData.email === emailInput.value.trim() && 
                        userData.password === passwordInput.value) {
                        // Login successful
                        alert('Login successful!');
                        
                        // Reset form
                        loginForm.reset();
                    } else {
                        // Login failed
                        passwordErrorMsg.textContent = 'Invalid email or password';
                    }
                } else {
                    // No user data found
                    passwordErrorMsg.textContent = 'No account found. Please sign up first.';
                }
            }
        }
        
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
});