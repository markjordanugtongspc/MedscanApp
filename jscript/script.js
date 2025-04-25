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
        }, 50);
    }

    // Onboarding slides functionality
    function setupOnboarding() {
        const slides = document.querySelectorAll('.onboarding-slide');
        const nextButtons = document.querySelectorAll('.next-btn');
        const getStartedButton = document.querySelector('.get-started-btn');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentSlide = document.querySelector('.onboarding-slide.active');
                const currentIndex = Array.from(slides).indexOf(currentSlide);
                const nextIndex = currentIndex + 1;
                
                if (nextIndex < slides.length) {
                    currentSlide.classList.remove('active');
                    slides[nextIndex].classList.add('active');
                }
            });
        });
        
        if (getStartedButton) {
            getStartedButton.addEventListener('click', () => {
                onboarding.style.opacity = '0';
                setTimeout(() => {
                    onboarding.style.display = 'none';
                    showAppContent();
                }, 500);
            });
        }
    }

    // Show main app content
    function showAppContent() {
        appContent.style.display = 'flex';
        setTimeout(() => {
            appContent.style.opacity = '1';
        }, 50);
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
});