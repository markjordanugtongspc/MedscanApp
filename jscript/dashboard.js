/**
 * Dashboard functionality JavaScript
 */

/**
 * Initialize all dashboard functionality when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard page loaded, initializing components');
  
  // Initialize dashboard components
  initDashboardAuth();
  initDashboardNavigation();
  initToggleSwitch();
  displayUserWelcome();
  initScrollableDashboard();
});

/**
 * Check if authentication is available and call setupDashboardAuth
 */
function initDashboardAuth() {
  console.log('Initializing dashboard authentication');
  
  // Check if setupDashboardAuth is available and call it
  if (typeof window.setupDashboardAuth === 'function') {
    window.setupDashboardAuth();
    console.log('Dashboard authentication initialized');
  } else {
    console.error('setupDashboardAuth function not found');
  }
}

/**
 * Check if navigation is available and call setupDashboardNavigation
 */
function initDashboardNavigation() {
  console.log('Initializing dashboard navigation');
  
  // Check if setupDashboardNavigation is available and call it
  if (typeof window.setupDashboardNavigation === 'function') {
    window.setupDashboardNavigation();
    console.log('Dashboard navigation initialized');
  } else {
    console.error('setupDashboardNavigation function not found');
  }
}

/**
 * Display personalized welcome message with user's name from session
 */
function displayUserWelcome() {
  const welcomeElement = document.getElementById('welcome-message');
  
  if (welcomeElement) {
    // Get user from localStorage session if available
    const authSession = localStorage.getItem('authSession');
    let username = 'User'; // Default value
    
    if (authSession) {
      try {
        const sessionData = JSON.parse(authSession);
        if (sessionData.user && sessionData.user.Name) {
          username = sessionData.user.Name;
        } else if (sessionData.email) {
          // Use email as fallback
          username = sessionData.email.split('@')[0];
        }
      } catch (err) {
        console.error('Error parsing auth session:', err);
      }
    }
    
    // Set the welcome message with username
    welcomeElement.textContent = `Welcome, ${username}!`;
  }
}

/**
 * Initialize toggle switch functionality
 */
function initToggleSwitch() {
  const toggleSwitch = document.getElementById('mode-toggle');
  const lightModeIcon = document.getElementById('light-mode-icon');
  const darkModeIcon = document.getElementById('dark-mode-icon');
  
  if (toggleSwitch) {
    // Check if mode preference exists in localStorage
    const currentMode = localStorage.getItem('appMode') || 'light';
    
    // Set initial state
    toggleSwitch.checked = currentMode === 'dark';
    updateToggleIcons(currentMode);
    
    // Add event listener for toggle changes
    toggleSwitch.addEventListener('change', handleToggleChange);
  }
}

/**
 * Handle toggle switch changes
 * @param {Event} event - The change event
 */
function handleToggleChange(event) {
  const mode = event.target.checked ? 'dark' : 'light';
  
  // Save preference to localStorage
  localStorage.setItem('appMode', mode);
  
  // Update the toggle icon visibility
  updateToggleIcons(mode);
  
  // Apply theme changes to the application
  applyTheme(mode);
  
  console.log(`Mode switched to: ${mode}`);
}

/**
 * Update the toggle switch icons based on current mode
 * @param {string} mode - The current mode ('light' or 'dark')
 */
function updateToggleIcons(mode) {
  const lightModeIcon = document.getElementById('light-mode-icon');
  const darkModeIcon = document.getElementById('dark-mode-icon');
  
  if (lightModeIcon && darkModeIcon) {
    // Set visibility based on mode
    if (mode === 'dark') {
      lightModeIcon.style.opacity = '0.3';
      darkModeIcon.style.opacity = '1';
    } else {
      lightModeIcon.style.opacity = '1';
      darkModeIcon.style.opacity = '0.3';
    }
  }
}

/**
 * Apply theme changes to the application
 * @param {string} mode - The mode to apply ('light' or 'dark')
 */
function applyTheme(mode) {
  const body = document.body;
  
  if (mode === 'dark') {
    // Apply dark mode class to body for CSS targeting
    body.classList.add('dark-mode');
    console.log('Dark mode applied - changing app-content background to #263238');
  } else {
    // Remove dark mode class
    body.classList.remove('dark-mode');
    console.log('Light mode applied - resetting app-content background');
  }
}

/**
 * Start of Scrollable Dashboard Function
 * Initialize the scrollable dashboard with enhanced touch/drag/wheel scrolling
 */
function initScrollableDashboard() {
  const scrollableDashboard = document.getElementById('scrollable-dashboard');
  
  if (scrollableDashboard) {
    console.log('Initializing scrollable dashboard with enhanced functionality');
    
    // Add smooth scrolling behavior
    scrollableDashboard.style.scrollBehavior = 'smooth';
    
    // Variables for drag scrolling
    let isDown = false;
    let startY;
    let startX; // Also track X coordinate for mobile touch scrolling
    let scrollTop;
    let isDragging = false;

    // Add hover effect to card items
    const dashboardCards = scrollableDashboard.querySelectorAll('.health-card');
    dashboardCards.forEach(card => {
      // Add hover effect
      card.addEventListener('mouseenter', function() {
        if (!isDragging) {
          this.classList.add('scale-105');
        }
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('scale-105');
      });
      
      // Make cards focusable for accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', card.querySelector('p').textContent + ' card');
      
      // Add keyboard accessibility
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          this.classList.add('scale-105');
          setTimeout(() => {
            this.classList.remove('scale-105');
          }, 200);
        }
      });

      // Add click handler (later can link to specific functionality)
      card.addEventListener('click', function(e) {
        // Only consider it a click if we weren't dragging
        if (!isDragging) {
          console.log(`Card clicked: ${this.querySelector('p').textContent}`);
          // Future card click functionality would go here
        }
      });
    });

    // Custom cursor style for draggable area
    scrollableDashboard.classList.add('cursor-grab');

    // Mouse wheel events - enhanced sensitivity
    scrollableDashboard.addEventListener('wheel', (e) => {
      e.preventDefault();
      scrollableDashboard.scrollTop += e.deltaY * 0.5; // Adjust sensitivity 
    }, { passive: false });

    // Mouse events for drag scrolling anywhere on the dashboard
    scrollableDashboard.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = false; // Reset drag state
      scrollableDashboard.classList.remove('cursor-grab');
      scrollableDashboard.classList.add('cursor-grabbing');
      startY = e.pageY - scrollableDashboard.offsetTop;
      scrollTop = scrollableDashboard.scrollTop;
      
      // Prevent text selection during drag
      e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        setTimeout(() => { isDragging = false; }, 100); // Short delay to prevent immediate click after drag
        scrollableDashboard.classList.remove('cursor-grabbing');
        scrollableDashboard.classList.add('cursor-grab');
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const y = e.pageY - scrollableDashboard.offsetTop;
      const walk = (y - startY) * 2; // Increased scroll speed multiplier
      
      if (Math.abs(walk) > 5) {
        isDragging = true; // If moved more than 5px, consider it a drag
      }
      
      scrollableDashboard.scrollTop = scrollTop - walk;
      e.preventDefault();
    });

    // Touch events for mobile drag scrolling
    let touchStartY;
    let initialTouchY;
    
    scrollableDashboard.addEventListener('touchstart', (e) => {
      isDragging = false;
      initialTouchY = e.touches[0].clientY;
      touchStartY = initialTouchY;
      startX = e.touches[0].clientX;
      scrollTop = scrollableDashboard.scrollTop;
    }, { passive: false });

    scrollableDashboard.addEventListener('touchmove', (e) => {
      if (!touchStartY) return;
      
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const yDiff = touchStartY - touchY;
      const xDiff = startX - touchX;
      
      // If vertical scrolling is more significant than horizontal, handle it
      if (Math.abs(yDiff) > Math.abs(xDiff)) {
        const touchWalk = yDiff * 1.5; // Increased sensitivity
        
        // Determine if we're dragging (needed to prevent click after drag)
        if (Math.abs(initialTouchY - touchY) > 10) {
          isDragging = true;
        }

        scrollableDashboard.scrollTop = scrollTop + touchWalk;
        e.preventDefault(); // Prevent page scrolling while dragging dashboard
      }

      // Update touchStartY for next move event (for smoother scrolling)
      touchStartY = touchY;
    }, { passive: false });

    scrollableDashboard.addEventListener('touchend', () => {
      touchStartY = null;
      // Keep isDragging true for a short time to prevent immediate clicks
      setTimeout(() => { isDragging = false; }, 100);
    });
    
    // Add custom CSS for cursors
    const style = document.createElement('style');
    style.textContent = `
      .cursor-grab { cursor: grab; }
      .cursor-grabbing { cursor: grabbing; }
    `;
    document.head.appendChild(style);
    
    console.log('Enhanced scrollable dashboard initialized successfully');
  }
}
/* End of Scrollable Dashboard Function */

/**
 * Start of Navigation Handler Functions
 * Handle navigation clicks and keyboard events for the footer navigation
 */
function handleNavClick(navItem) {
  console.log(`Navigation clicked: ${navItem}`);
  
  // Handle different navigation items
  switch(navItem) {
    case 'home': 
      // Already on home dashboard, but could refresh or scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'computer': 
      // Could show device/connection settings or similar
      console.log('Computer section clicked');
      // Future implementation
      break;
    case 'menu': 
      // Could show app menu/grid
      console.log('Menu section clicked');
      // Future implementation
      break;
    case 'profile': 
      // Could navigate to profile page
      console.log('Profile section clicked');
      // Future implementation
      break;
  }
  
  // Visual feedback for click
  provideVisualFeedback(navItem);
}

/**
 * Handle keyboard navigation for accessibility
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} navItem - The navigation item identifier
 */
function handleNavKeyDown(event, navItem) {
  // Handle Enter or Space key press
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleNavClick(navItem);
  }
}

/**
 * Provide visual feedback for navigation interaction
 * @param {string} navItem - The navigation item clicked
 */
function provideVisualFeedback(navItem) {
  // Find the button element
  let element;
  if (navItem === 'home') {
    element = document.querySelector('footer .rounded-full');
  } else {
    // Find by aria-label
    element = document.querySelector(`footer button[aria-label="${navItem.charAt(0).toUpperCase() + navItem.slice(1)}"]`);
  }
  
  if (element) {
    // Add a temporary class for visual feedback
    element.classList.add('nav-active');
    
    // Remove the class after animation completes
    setTimeout(() => {
      element.classList.remove('nav-active');
    }, 300);
  }
}
/* End of Navigation Handler Functions */
