document.addEventListener('DOMContentLoaded', () => {
    // Loader functionality
    const loader = document.getElementById('loader');
    const onboarding = document.getElementById('onboarding');
    const appContent = document.getElementById('app-content');
    
    // Update the loading text for better animation
    const loadingDots = document.querySelector('.loading-dots');
    const updateLoadingText = () => {
        const dotsSpan = loadingDots.querySelector('.dots');
        if (!dotsSpan) return;
    };
    
    // Show onboarding after loader animation (increased to 14 seconds)
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            
            // Show onboarding instead of app content
            onboarding.style.display = 'flex';
            setTimeout(() => {
                onboarding.style.opacity = '1';
            }, 50);
        }, 500);
    }, 3500); 
    
    // Onboarding slides functionality
    const slides = document.querySelectorAll('.onboarding-slide');
    const nextButtons = document.querySelectorAll('.next-btn');
    const getStartedButton = document.querySelector('.get-started-btn');
    
    // Next button functionality
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
    
    // Get Started button functionality
    if (getStartedButton) {
        getStartedButton.addEventListener('click', () => {
            onboarding.style.opacity = '0';
            setTimeout(() => {
                onboarding.style.display = 'none';
                appContent.style.display = 'flex';
                setTimeout(() => {
                    appContent.style.opacity = '1';
                }, 50);
            }, 500);
        });
    }
    
    // Navigation functionality
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
    
    function initApp() {
        // Set initial opacity for fade-in effect
        onboarding.style.opacity = '0';
        appContent.style.opacity = '0';
        appContent.style.transition = 'opacity 0.5s ease-in';
        
        sections.forEach(section => {
            if (!section.classList.contains('active-section')) {
                section.style.display = 'none';
            }
        });
        
        // Start loading animation
        updateLoadingText();
    }
    
    initApp();
});
