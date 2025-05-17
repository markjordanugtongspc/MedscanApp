import { showLoadingAnimation } from './hc_animation.js';

/**
 * health_cards.js
 * This file contains functions for handling health card interactions and animations
 * in the MedScan application.
 */

/* Start of Health Card Navigation Function */
document.addEventListener('DOMContentLoaded', function() {
    // Get all health cards
    const healthCards = document.querySelectorAll('.health-card');
    
    // Add click event listeners to each health card
    healthCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get the card title
            const cardTitle = this.querySelector('p').textContent.trim();
            handleCardClick(cardTitle);
        });
        
        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open ${card.querySelector('p').textContent.trim()} section`);
        
        // Add keydown event for accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const cardTitle = this.querySelector('p').textContent.trim();
                handleCardClick(cardTitle);
            }
        });
    });

    // Initialize theme based on saved preference
    initThemeToggle();

    // Check if we're on the assessment page
    if (window.location.href.includes('assessment.html')) {
        initAssessment();
    }
});

/**
 * Initialize theme toggle functionality
 * This syncs with the dashboard theme setting
 */
function initThemeToggle() {
    console.log("Initializing theme consistency");
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("darkTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Use saved preference or fallback to system preference
    const isDarkTheme = savedTheme !== null ? savedTheme === "true" : prefersDark;
    
    // Apply theme immediately
    applyTheme(isDarkTheme);
    
    // Listen for theme toggle changes from dashboard
    window.addEventListener('storage', function(e) {
        if (e.key === 'darkTheme') {
            applyTheme(e.newValue === 'true');
        }
    });
    
    // If themeToggle exists on this page, initialize it
    const themeToggle = document.getElementById("input");
    if (themeToggle) {
        console.log("Theme toggle found on this page, initializing");
        
        // Set initial state of the toggle
        themeToggle.checked = isDarkTheme;
        
        // Handle toggle changes
        themeToggle.addEventListener("change", function() {
            const isDark = this.checked;
            applyTheme(isDark);
            localStorage.setItem("darkTheme", isDark);
            console.log("Theme toggled:", isDark ? "dark" : "light");
        });
        
        // Add keyboard accessibility
        themeToggle.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.checked = !this.checked;
                const isDark = this.checked;
                applyTheme(isDark);
                localStorage.setItem("darkTheme", isDark);
            }
        });
    }
}

/**
 * Apply theme changes to the application
 * @param {boolean|string} isDark - Whether to apply dark theme
 */
function applyTheme(isDark) {
    // Convert to boolean if it's a string
    if (typeof isDark === 'string') {
        isDark = isDark === 'true';
    }
    
    if (isDark) {
        // Add dark theme class to body but preserve footer
        document.body.classList.add("dark-theme");
        
        // Apply dark theme styles to input fields with border-black
        const inputFields = document.querySelectorAll('input.border-black');
        inputFields.forEach(input => {
            input.classList.remove('border-black');
            input.classList.add('border-white');
        });
        
        console.log("Dark theme applied to assessment page");
    } else {
        // Remove dark theme class
        document.body.classList.remove("dark-theme");
        
        // Restore light theme styles to input fields with border-white
        const inputFields = document.querySelectorAll('input.border-white');
        inputFields.forEach(input => {
            input.classList.remove('border-white');
            input.classList.add('border-black');
        });
        
        console.log("Light theme applied to assessment page");
    }
}

/**
 * Handle click events on health cards
 * @param {string} cardTitle - The title of the clicked card
 */
function handleCardClick(cardTitle) {
    console.log(`${cardTitle} card clicked`);
    
    // Navigate to appropriate page based on card title
    switch(cardTitle) {
        case 'Assessment':
            window.location.href = './box/assessment.html';
            break;
        case 'Emergency Contact':
            window.location.href = './box/emergency.html';
            break;
        case 'Health Alert':
            window.location.href = './box/health-alert.html';
            break;
        case 'Body Mass Index':
            window.location.href = './box/bmi.html';
            break;
        case 'Medications':
            window.location.href = './box/medications.html';
            break;
        case 'Schedule':
            window.location.href = './box/schedule.html';
            break;
        case 'Doctor':
            window.location.href = './box/doctor.html';
            break;
        case 'History':
            window.location.href = './box/history.html';
            break;
        default:
            console.log('No navigation defined for this card');
    }
}
/* End of Health Card Navigation Function */

/* Start of Assessment Functions */
// Global variables for assessment
let currentQuestionNumber = 1; // Track current question (1: symptoms, 2: duration)
let userSelections = []; // Store user's selections

/**
 * Initialize assessment page functionality
 */
function initAssessment() {
    // Check if we're on the assessment page
    const assessmentPage = document.querySelector('.app-wrapper section:nth-child(2) h1');
    if (!assessmentPage) return;

    // Add event listeners to answer buttons
    const answerButtons = document.querySelectorAll('.relative.top-20 .grid button');
    answerButtons.forEach(button => {
            button.addEventListener('click', function() {
            // Toggle selected state
            if (this.classList.contains('bg-teal')) {
                this.classList.remove('bg-teal', 'text-white');
            } else {
                this.classList.add('bg-teal', 'text-white');
            }
        });
    });

    // Add event listener to the continue button - use ID selector
    const continueButton = document.querySelector('#continue-button');
    if (continueButton) {
        console.log('Continue button found, adding event listener');
        continueButton.addEventListener('click', handleContinueClick);
    } else {
        console.log('Continue button not found');
    }
    
    // Add event listener to the proceed button if it exists (for medicine recommendation)
    const proceedButton = document.querySelector('#proceed-button');
    if (proceedButton) {
        console.log('Proceed button found, adding event listener');
        proceedButton.addEventListener('click', function() {
            // Navigate back to dashboard
            window.location.href = '../dashboard.html';
        });
    }
}

/**
 * Handle continue button click in assessment
 * Uses showLoadingAnimation from hc_animation.js module
 */
function handleContinueClick() {
    if (typeof userSelections === 'undefined') {
        window.userSelections = [];
    }

    // Gather user selections
    const selectedButtons = document.querySelectorAll('.relative.top-20 .grid button.bg-teal');
    const selectedOptions = Array.from(selectedButtons).map(btn => btn.textContent.trim());
    userSelections[currentQuestionNumber - 1] = selectedOptions;

    if (currentQuestionNumber === 1) {
        currentQuestionNumber = 2;

        // Load q2.js dynamically
        const script = document.createElement('script');
        script.src = '../../jscript/assessment/q2.js';
        document.head.appendChild(script);

        script.onload = function() {
            // Set the current question number in the global scope
            window.currentQuestionNumber = 2;
            
            // Call functions from q2.js to update the UI
            if (typeof updateQuestionText === 'function') {
                updateQuestionText();
            }
            
            if (typeof updateIllustration === 'function') {
                updateIllustration();
            }
            
            if (typeof updateParagraphText === 'function') {
                updateParagraphText();
            }
            
            if (typeof updateAnswerButtons === 'function') {
                updateAnswerButtons();
            }
        };
    } else {
        import('./hc_animation.js').then(({ showLoadingAnimation }) => {
            showLoadingAnimation(userSelections);
            setTimeout(() => {
                // Load med_reco.js dynamically
                const medRecoScript = document.createElement('script');
                medRecoScript.src = '../../jscript/assessment/med_reco.js';
                document.head.appendChild(medRecoScript);
                
                medRecoScript.onload = function() {
                    if (typeof showMedicineRecommendation === 'function') {
                        showMedicineRecommendation();
                    }
                };
            }, 2500);
        });
    }
}

/**
 * Show the second question
 */
export function showNextQuestion() {
    updateQuestionText();
    updateIllustration();
    updateParagraphText();
    updateAnswerButtons();
}