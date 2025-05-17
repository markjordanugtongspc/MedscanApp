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
  // Removed initHealthCardToggle as we now use direct dragging
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
  // Start of Theme Toggle Function
  const themeToggle = document.getElementById("input");
  
  if (themeToggle) {
    console.log("Theme toggle found, initializing dark/light mode");
    
    // Function to apply theme based on preference
    function applyTheme(isDark) {
      if (isDark) {
        // Add dark theme class to body but preserve footer
        document.body.classList.add("dark-theme");
        console.log("Dark theme applied (footer remains static)");
      } else {
        // Remove dark theme class
        document.body.classList.remove("dark-theme");
        console.log("Light theme applied (footer remains static)");
      }
    }
    
    // Load theme from localStorage on init
    const savedTheme = localStorage.getItem("darkTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Use saved preference or fallback to system preference
    const isDarkTheme = savedTheme !== null ? savedTheme === "true" : prefersDark;
    
    // Set initial state of the toggle
    themeToggle.checked = isDarkTheme;
    applyTheme(isDarkTheme);
    
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
  } else {
    console.error("Theme toggle element with id='input' not found");
  }
  // End of Theme Toggle Function
}

/**
 * Handle toggle switch changes
 * @param {Event} event - The change event
 */
function handleToggleChange(event) {
  const mode = event.target.checked ? 'dark' : 'light';
  
  // Save preference to localStorage
  localStorage.setItem('darkTheme', mode === 'dark' ? 'true' : 'false');
  
  // Apply theme changes to the application
  applyTheme(mode);
  
  console.log(`Mode switched to: ${mode}`);
}

/**
 * Update the toggle switch icons based on current mode
 * @param {string} mode - The current mode ('light' or 'dark')
 */
function updateToggleIcons(mode) {
  // This function is kept for backwards compatibility
  // The new implementation uses CSS transitions and animations
  console.log(`Toggle icon update for ${mode} mode handled by CSS`);
}

/**
 * Apply theme changes to the application
 * @param {string} mode - The mode to apply ('light' or 'dark')
 */
function applyTheme(mode) {
  const body = document.body;
  
  if (mode === 'dark') {
    // Apply dark theme class to body for CSS targeting
    body.classList.add('dark-theme');
    console.log('Dark theme applied - changing background and text colors');
  } else {
    // Remove dark theme class
    body.classList.remove('dark-theme');
    console.log('Light theme applied - resetting to default colors');
  }
}

/**
 * Start of Scrollable Dashboard Function
 * Initialize the scrollable dashboard with enhanced touch/drag/wheel scrolling
 */
function initScrollableDashboard() {
  const scrollableDashboard = document.getElementById('scrollable-dashboard');
  
  if (scrollableDashboard) {
  console.log('Initializing mobile-friendly draggable dashboard');
  
  // Add smooth scrolling behavior
  scrollableDashboard.style.scrollBehavior = 'smooth';
  
  // Set initial scroll position to show only first four cards
  scrollableDashboard.scrollTop = 0;
  
  // Variables for drag scrolling
  let isDown = false;
  let startY;
  let startX;
  let scrollTop;
  let isDragging = false;

  // Add a subtle visual indicator for draggability
  const dragIndicator = document.createElement('div');
  dragIndicator.className = 'drag-indicator flex justify-center items-center my-1';
  dragIndicator.innerHTML = `
    <div class="w-10 h-1 bg-white/50 rounded-full mb-1"></div>
  `;
  scrollableDashboard.parentNode.insertBefore(dragIndicator, scrollableDashboard);

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
          e.preventDefault();
          console.log(`Card activated via keyboard: ${this.querySelector('p').textContent}`);
          // Add card activation functionality here
        }
      });
    });

    // Mouse events for drag scrolling
    scrollableDashboard.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = false; // Reset drag state
      scrollableDashboard.classList.add('cursor-grabbing');
      scrollableDashboard.classList.remove('cursor-grab');
      startY = e.pageY;
      startX = e.pageX;
      scrollTop = scrollableDashboard.scrollTop;
      e.preventDefault();
    });

    scrollableDashboard.addEventListener('mouseleave', () => {
      isDown = false;
      scrollableDashboard.classList.add('cursor-grab');
      scrollableDashboard.classList.remove('cursor-grabbing');
    });

    scrollableDashboard.addEventListener('mouseup', () => {
      isDown = false;
      setTimeout(() => { isDragging = false; }, 100); // Short delay to prevent immediate click after drag
      scrollableDashboard.classList.add('cursor-grab');
      scrollableDashboard.classList.remove('cursor-grabbing');
    });

    scrollableDashboard.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY;
      const walk = (y - startY) * 2; // Faster scrolling
      
      if (Math.abs(walk) > 5) {
        isDragging = true; // If moved more than 5px, consider it a drag
      }
      
      scrollableDashboard.scrollTop = scrollTop - walk;
    });
    
    // Wheel events for smoother scrolling
    scrollableDashboard.addEventListener('wheel', (e) => {
      // Determine scroll direction and amount
      const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail || -e.deltaY)));
      const scrollSpeed = 30; // Adjust for faster/slower scrolling
      
      // If it's a horizontal mouse wheel, don't interfere
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }
      
      scrollableDashboard.scrollTop = scrollableDashboard.scrollTop - (delta * scrollSpeed);
      e.preventDefault();
    }, { passive: false });

    // Mobile touch events with momentum scrolling and snap effect
    let touchStartY;
    let initialTouchY;
    let lastTouchY;
    let momentumID;
    let velocity = 0;
    let lastMoveTime = 0;
    let cardHeight = 0;
    
    // Get the card height for snap-to-grid effect
    const firstCard = scrollableDashboard.querySelector('.health-card');
    if (firstCard) {
      cardHeight = firstCard.offsetHeight + 8; // Card height + gap
    }
    
    // Function to apply momentum effect after touch end with snap-to-grid
    function applyMomentum() {
      if (Math.abs(velocity) < 0.5) {
        // When momentum ends, snap to nearest row of cards
        cancelAnimationFrame(momentumID);
        if (cardHeight > 0) {
          const rowPosition = Math.round(scrollableDashboard.scrollTop / cardHeight) * cardHeight;
          scrollableDashboard.scrollTo({
            top: rowPosition,
            behavior: 'smooth'
          });
        }
        return;
      }
      
      scrollableDashboard.scrollTop += velocity;
      velocity *= 0.95; // Decay factor
      momentumID = requestAnimationFrame(applyMomentum);
    }
    
    // Function to snap scroll position to grid rows
    function snapToGrid() {
      if (cardHeight > 0) {
        const rowPosition = Math.round(scrollableDashboard.scrollTop / cardHeight) * cardHeight;
        scrollableDashboard.scrollTo({
          top: rowPosition,
          behavior: 'smooth'
        });
      }
    }
    
    // Touch start event
    scrollableDashboard.addEventListener('touchstart', (e) => {
      // Cancel any ongoing momentum scrolling
      cancelAnimationFrame(momentumID);
      velocity = 0;
      
      isDragging = false;
      initialTouchY = e.touches[0].clientY;
      touchStartY = initialTouchY;
      lastTouchY = initialTouchY;
      startX = e.touches[0].clientX;
      scrollTop = scrollableDashboard.scrollTop;
      lastMoveTime = Date.now();
      
      // Add active dragging visual feedback
      scrollableDashboard.classList.add('active-drag');
    }, { passive: false });

    // Touch move event
    scrollableDashboard.addEventListener('touchmove', (e) => {
      if (!touchStartY) return;
      
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const yDiff = touchStartY - touchY;
      const xDiff = startX - touchX;
      const now = Date.now();
      const elapsed = now - lastMoveTime;
      
      // Calculate velocity for momentum scrolling
      if (elapsed > 0) {
        velocity = (lastTouchY - touchY) / elapsed * 15; // Scale factor for smooth momentum
      }
      
      // If vertical scrolling is more significant than horizontal, handle it
      if (Math.abs(yDiff) > Math.abs(xDiff)) {
        const touchWalk = yDiff * 1.5; // Increased sensitivity
        
        // Determine if we're dragging (needed to prevent click after drag)
        if (Math.abs(initialTouchY - touchY) > 5) {
          isDragging = true;
        }

        scrollableDashboard.scrollTop = scrollTop + touchWalk;
        e.preventDefault(); // Prevent page scrolling while dragging dashboard
      }

      // Update values for next move event (for smoother scrolling)
      touchStartY = touchY;
      lastTouchY = touchY;
      lastMoveTime = now;
    }, { passive: false });

    // Touch end event
    scrollableDashboard.addEventListener('touchend', () => {
      scrollableDashboard.classList.remove('active-drag');
      touchStartY = null;
      
      // Apply momentum scrolling if velocity is significant
      if (Math.abs(velocity) > 0.5) {
        momentumID = requestAnimationFrame(applyMomentum);
      } else {
        // If no significant momentum, just snap to grid
        snapToGrid();
      }
      
      // Keep isDragging true for a short time to prevent immediate clicks
      setTimeout(() => { isDragging = false; }, 100);
    });
    
    // Apply snap-to-grid when scrolling stops
    scrollableDashboard.addEventListener('scroll', () => {
      clearTimeout(scrollableDashboard.scrollEndTimer);
      scrollableDashboard.scrollEndTimer = setTimeout(() => {
        // Only apply snap if we're not still momentum scrolling
        if (!momentumID) {
          snapToGrid();
        }
      }, 150);
});
  
// Add custom CSS for cursors and dragging effects
const style = document.createElement('style');
style.textContent = `
      .cursor-grab { cursor: grab; }
      .cursor-grabbing { cursor: grabbing; }
      .active-drag { 
    cursor: grabbing;
        transition: transform 0.1s ease;
      }
      .drag-indicator { pointer-events: none; }
`;
document.head.appendChild(style);

// Add cursor-grab class by default
scrollableDashboard.classList.add('cursor-grab');

console.log('Enhanced draggable dashboard initialized successfully');
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

// We don't need the initHealthCardToggle function anymore since we've removed the Show More button
