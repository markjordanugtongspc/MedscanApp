document.addEventListener('DOMContentLoaded', () => {
    // Animation variables
    const text = 'MedScan';
    const element = document.getElementById('medscan');
    const cursor = document.createElement('span');
    const logoTextContainer = document.getElementById('logo-text-container');
    const dotsContainer = document.getElementById('dots-container');
    const dots = dotsContainer.querySelectorAll('div');
    const loader = document.getElementById('loader');
    const onboarding = document.getElementById('onboarding');
    const appContent = document.getElementById('app-content');
    let i = 0;

    // Initialize app state
    function initApp() {
        onboarding.style.opacity = '0';
        appContent.style.opacity = '0';
        appContent.style.transition = 'opacity 0.5s ease-in';

        document.querySelectorAll('section').forEach(section => {
            if (!section.classList.contains('active-section')) {
                section.style.display = 'none';
            }
        });
    }

    // Main animation sequence
    function startAnimationSequence() {
        // Step 1: Logo bounces in (animation is handled by CSS)
        console.log("Animation sequence started");

        // Add background animation after 800ms
        setTimeout(() => {
            // After 1500ms more, show the colored background
            setTimeout(() => {
                loader.classList.add('animate-bg');

                // After 800ms, remove the colored background
                setTimeout(() => {
                    loader.classList.remove('animate-bg');
                }, 800);
            }, 1500);
        }, 800);

        // Step 2: Start typing MedScan text after logo animation completes
        setTimeout(() => {
            console.log("Starting MedScan text typing");
            cursor.className = 'typing-cursor';
            element.appendChild(cursor);

            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    console.log("Text typing completed");

                    // Step 3: After typing completes, wait a moment then fade out logo and text
                    setTimeout(() => {
                        cursor.style.display = 'none';
                        console.log("Fading out logo and text");

                        // Fade out logo and text
                        logoTextContainer.style.animation = 'fade-out 800ms forwards';

                        // Step 4: After fadeout, hide logo container and show dots
                        setTimeout(() => {
                            logoTextContainer.style.display = 'none';
                            console.log("Showing dots container");

                            // Show dots container
                            dotsContainer.classList.remove('hidden');

                            // Ensure flex display is applied
                            dotsContainer.style.display = 'flex';

                            // Animate each dot with staggered delays
                            dots.forEach((dot, index) => {
                                // Apply the animation with delay
                                dot.style.animation = `bounce 1s infinite ${index * 0.15}s`;
                                // Make sure dots are visible and properly sized
                                dot.style.opacity = '1';
                            });

                            // Step 5: Transition to onboarding after showing dots for a while
                            setTimeout(() => {
                                console.log("Transitioning to onboarding");
                                loader.style.opacity = '0';
                                setTimeout(() => {
                                    loader.style.display = 'none';
                                    showOnboarding();
                                }, 500);
                            }, 3000);
                        }, 800);
                    }, 1500);
                }
            }, 150);
        }, 3500); // Wait for logo bounce animation to complete
    }

    // Show onboarding screen
    function showOnboarding() {
        onboarding.style.display = 'flex';
        setTimeout(() => {
            onboarding.style.opacity = '1';
            // Make sure the first slide is active
            const firstSlide = document.querySelector('.onboarding-slide');
            if (firstSlide) {
                firstSlide.classList.add('active');
            }
        }, 50);
    }

    // Onboarding slides functionality
    function setupOnboarding() {
        const slides = document.querySelectorAll('.onboarding-slide');
        const nextButtons = document.querySelectorAll('.next-btn');
        const skipButtons = document.querySelectorAll('.skip-btn');
        const getStartedButton = document.querySelector('.get-started-btn');
        const svgTrigger = document.querySelector('#svg-trigger'); // Added SVG trigger reference
        //Added Shit
        const welcomePage = document.getElementById("welcome-page");
        const logoTextContainer = document.getElementById('logo-text-container'); // Ensure MedScan text is visible
        // End of Added Shit

        // Set the first slide as active initially
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }

        // Function to handle moving to the next slide
        function moveToNextSlide() {
            const currentSlide = document.querySelector('.onboarding-slide.active');
            if (currentSlide) {
                const currentIndex = Array.from(slides).indexOf(currentSlide);
                const nextIndex = currentIndex + 1;

                if (nextIndex < slides.length) {
                    currentSlide.classList.remove('active');
                    slides[nextIndex].classList.add('active');
                } else {
                    // If we're at the last slide, show app content
                    hideOnboarding();
                }
            }
        }

        // Function to hide onboarding and show welcome page
        function hideOnboarding() {
            const onboarding = document.querySelector('#onboarding');
            if (onboarding) {
                onboarding.style.opacity = '0';
                setTimeout(() => {
                    onboarding.style.display = 'none';
                    showWelcomePage(); // Show welcome page instead of app content
                }, 500);
            }
        }

        // Function to show the welcome page
        function showWelcomePage() {
            if (welcomePage) {
                welcomePage.style.display = "flex";
                setTimeout(() => {
                    welcomePage.style.opacity = "1"; // Smooth fade-in effect
                }, 50);
                
                // We don't need to show the logo text container here
                // as it should remain hidden after the initial animation
            }
        }

        // Attach event listeners to buttons for onboarding navigation
        nextButtons.forEach(button => button.addEventListener("click", moveToNextSlide));
        skipButtons.forEach(button => button.addEventListener("click", hideOnboarding));

        if (getStartedButton) {
            getStartedButton.addEventListener("click", hideOnboarding);
        }

        if (svgTrigger) {
            svgTrigger.addEventListener("click", hideOnboarding);
        }
    }

    // Show main app content
    function showAppContent() {
        appContent.style.display = 'flex';
        setTimeout(() => {
            appContent.style.opacity = '1';
        }, 50);
    }

    // Add event listeners for welcome page buttons
    function setupWelcomePageButtons() {
        const loginBtn = document.querySelector('#welcome-page button:first-of-type');
        const signupBtn = document.querySelector('#welcome-page button:last-of-type');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const welcomePage = document.getElementById('welcome-page');
                welcomePage.style.opacity = '0';
                setTimeout(() => {
                    welcomePage.style.display = 'none';
                    showAppContent();
                }, 500);
            });
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                const welcomePage = document.getElementById('welcome-page');
                welcomePage.style.opacity = '0';
                setTimeout(() => {
                    welcomePage.style.display = 'none';
                    showAppContent();
                }, 500);
            });
        }
    }

    // Navigation functionality
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = item.getAttribute('href').slice(1);

                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');

                sections.forEach(section => {
                    section.style.display = 'none';
                    section.classList.remove('active-section');
                });

                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'flex';
                    targetSection.classList.add('active-section');
                }
            });
        });

        const primaryBtn = document.querySelector('.primary-btn');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => {
                const scanNavItem = document.querySelector('a[href="#scan"]');
                if (scanNavItem) {
                    scanNavItem.click();
                }
            });
        }
    }

    // Initialize everything
    initApp();
    startAnimationSequence();
    setupOnboarding();
    setupNavigation();
    setupWelcomePageButtons();
});
// ===== NEW FUNCTIONALITY CAN GO HERE =====

// Function to handle back button click - returns to welcome page
function handleBackToWelcome() {
    // Redirect to the welcome page (index.html)
    window.location.href = '../../index.html';
}

// Function to show login page and hide welcome page
function showLoginPage() {
    const welcomePage = document.getElementById('welcome-page');
    
    // Hide welcome page with fade-out animation
    if (welcomePage) {
        welcomePage.style.opacity = '0';
        setTimeout(() => {
            welcomePage.style.display = 'none';
            
            // Redirect to login page
            window.location.href = 'pages/auth/login.html';
        }, 500);
    }
}

// Initialize login button when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('#welcome-page button:first-of-type');
    if (loginBtn) {
        // Remove any existing event listeners to prevent conflicts
        loginBtn.replaceWith(loginBtn.cloneNode(true));
        // Add new event listener
        document.querySelector('#welcome-page button:first-of-type')
            .addEventListener('click', showLoginPage);
    }
});

// Function to handle back button click from signup page to login page
function handleBackToLogin() {
    // Redirect to login page
    window.location.href = 'login.html';
}

// Function to show signup page
function showSignupPage() {
    const welcomePage = document.getElementById('welcome-page');
    
    // Hide welcome page with fade-out animation if visible
    if (welcomePage) {
        welcomePage.style.opacity = '0';
        setTimeout(() => {
            welcomePage.style.display = 'none';
            
            // Redirect to signup page
            window.location.href = 'pages/auth/signup.html';
        }, 500);
    }
}

// Initialize page navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set up welcome page signup button
    const welcomeSignupBtn = document.querySelector('#welcome-page button:last-of-type');
    if (welcomeSignupBtn) {
        // Remove any existing event listeners to prevent conflicts
        welcomeSignupBtn.replaceWith(welcomeSignupBtn.cloneNode(true));
        // Add new event listener
        document.querySelector('#welcome-page button:last-of-type')
            .addEventListener('click', showSignupPage);
    }
    
    // Set up signup link in login page
    const signupLink = document.getElementById('signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'signup.html';
        });
    }
    
    // Set up login link in signup page
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});
