// Add this maskEmail function at the top of your script
function maskEmail(email) {
    if (!email || typeof email !== 'string') return email;
    
    try {
        const [username, domain] = email.split('@');
        if (!username || !domain) return email;
        
        // Calculate number of asterisks based on username length
        let asterisks = '';
        if (username.length <= 4) {
            asterisks = '***'; // Minimum 3 asterisks for short usernames
        } else {
            // For longer usernames, use length-2 asterisks (to keep first and last char)
            asterisks = '*'.repeat(username.length - 2);
        }
        
        // Mask the username part (show first and last character with dynamic asterisks)
        let maskedUsername = '';
        if (username.length > 1) {
            maskedUsername = username[0] + asterisks + username.slice(-1);
        } else {
            maskedUsername = username[0] + asterisks;
        }
        
        return maskedUsername + '@' + domain;
    } catch (error) {
        console.error('Error masking email:', error);
        return email; // Return original if error occurs
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Make maskEmail available globally
    window.maskEmail = maskEmail;
    
    // Display masked email in verification page
    const emailTextElement = document.querySelector('.text-wrapper:nth-child(2)');
    if (emailTextElement) {
        try {
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem('medscanUserData'));
            if (userData && userData.email) {
                const maskedEmail = maskEmail(userData.email);
                // Update the text content
                emailTextElement.textContent = `Please enter the Unique 4-digit code we sent to your email ${maskedEmail}.`;
            }
        } catch (error) {
            console.error('Error displaying masked email:', error);
        }
    }

    // Rest of your existing code remains exactly the same...
    // Get modal element
    const modal = document.getElementById('sliding-modal');
    
    // Function to show modal
    function showModal() {
        modal.classList.remove('translate-y-full');
        modal.classList.add('translate-y-0');
    }

    // Function to hide modal
    function hideModal() {
        modal.classList.remove('translate-y-0');
        modal.classList.add('translate-y-full');
    }

    // Show modal when verify button is clicked
    const verifyButton = document.querySelector('.relative.cursor-pointer');
    if (verifyButton) {
        verifyButton.addEventListener('click', function() {
            // Validate all inputs are filled before showing modal
            const inputs = document.querySelectorAll('input[type="text"][maxlength="1"]');
            const errorMessage = document.getElementById('error-message');
            let allFilled = true;
            let isValid = true;

            // Hide error message initially
            errorMessage.classList.add('hidden');

            // Check if all inputs are filled and contain valid digits
            inputs.forEach(input => {
                if (!input.value) {
                    allFilled = false;
                    input.classList.add('border-red-500');
                    setTimeout(() => {
                        input.classList.remove('border-red-500');
                    }, 2000);
                } else if (!/^\d$/.test(input.value)) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    setTimeout(() => {
                        input.classList.remove('border-red-500');
                    }, 2000);
                }
            });

            if (!allFilled || !isValid) {
                errorMessage.classList.remove('hidden');
                errorMessage.textContent = !allFilled ? "Please enter all 4 digits of the verification code" : "Please enter only numbers (0-9)";
                setTimeout(() => errorMessage.classList.add('hidden'), 3000);

                for (let i = 0; i < inputs.length; i++) {
                    if (!inputs[i].value || !/^\d$/.test(inputs[i].value)) {
                        inputs[i].focus();
                        break;
                    }
                }
            } else {
                showModal();
                document.getElementById('loading-state').classList.remove('hidden');
                document.getElementById('success-state').classList.add('hidden');
                
                setTimeout(() => {
                    document.getElementById('loading-state').classList.add('hidden');
                    document.getElementById('success-state').classList.remove('hidden');
                }, 1500);
            }
        });
    }

    // Hide modal when clicking on overlay
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', hideModal);
    }

    // Redirect to login page when clicking "GET STARTED" button
    const getStartedButton = document.getElementById('get-started-btn');
    if (getStartedButton) {
        getStartedButton.addEventListener('click', function() {
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // OTP Input Functionality
    const inputs = document.querySelectorAll('input[type="text"][maxlength="1"]');
    
    inputs.forEach((input, index) => {
        // Focus on first input when page loads
        if (index === 0) {
            setTimeout(() => input.focus(), 500);
        }
    
        // Allow only numbers
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            e.target.value = value.replace(/[^0-9]/g, '');
            
            // Move to next input if value exists
            if (value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            
            checkAllFilled();
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        // Handle paste event
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').trim();
            if (/^\d{4}$/.test(pasteData)) {
                inputs.forEach((input, i) => {
                    input.value = pasteData[i] || '';
                });

                // Focus on last input
                inputs[inputs.length - 1].focus();
                checkAllFilled();
            }
        });
    });

    // Function to check if all inputs are filled
    function checkAllFilled() {
        const allFilled = Array.from(inputs).every(input => input.value);
        if (allFilled) {
            setTimeout(() => {
                const errorMessage = document.getElementById('error-message');
                errorMessage.classList.add('hidden');
                
                inputs.forEach(input => {
                    input.classList.add('border-[#199B91]');
                });

                const verifyButton = document.querySelector('.relative.cursor-pointer');
                if (verifyButton) {
                    verifyButton.classList.add('animate-pulse');
                    setTimeout(() => {
                        verifyButton.classList.remove('animate-pulse');
                    }, 1500);
                }
            }, 300);
        }
    }
});