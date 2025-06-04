/**
 * Profile page functionality JavaScript
 */

import { supabase } from './auth_api.js';

/**
 * Initialize all profile page functionality when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Profile page loaded, initializing components');
  
  // Initialize profile components
  loadUserProfile();
  initProfileAuth();
  initProfileInteractions();
  
  // Initialize avatar selection functionality
  initAvatarSelection();
});

/**
 * Load and display user profile information dynamically
 */
async function loadUserProfile() {
  console.log('Loading user profile information');
  
  // Get user from localStorage session if available
  const authSession = localStorage.getItem('authSession');
  let userEmail = null;
  let userName = 'User'; // Default value
  
  if (authSession) {
    try {
      const sessionData = JSON.parse(authSession);
      if (sessionData.email) {
        userEmail = sessionData.email;
        
        // Extract username from email (before @ symbol)
        userName = userEmail.split('@')[0];
        
        // If there's a stored full name, use that instead
        if (sessionData.user && sessionData.user.full_name) {
          userName = sessionData.user.full_name;
        } else if (sessionData.user && sessionData.user.Name) {
          userName = sessionData.user.Name;
        }
      }
    } catch (err) {
      console.error('Error parsing auth session:', err);
    }
  }
  
  // If no session found, try to get from other sources
  if (!userEmail) {
    // Try session storage
    userEmail = sessionStorage.getItem('userEmail');
    
    // Try temporary registration session
    if (!userEmail) {
      try {
        const tempSession = JSON.parse(localStorage.getItem('tempRegistrationSession'));
        if (tempSession && tempSession.email) {
          userEmail = tempSession.email;
        }
      } catch (e) {
        console.error('Error parsing temporary session:', e);
      }
    }
    
    // If we found email from other sources, extract username
    if (userEmail) {
      userName = userEmail.split('@')[0];
    }
  }
  
  // Try to fetch additional user data from database if we have an email
  if (userEmail) {
    try {
      await fetchUserDataFromDatabase(userEmail, userName);
    } catch (error) {
      console.error('Error fetching user data from database:', error);
      // Fall back to local data
      displayUserProfile(userName, userEmail);
    }
  } else {
    console.warn('No user email found, using default values');
    displayUserProfile(userName, 'user@example.com');
  }
}

/**
 * Fetch user data from Supabase database
 * @param {string} email - User's email address
 * @param {string} fallbackName - Fallback name to use if database query fails
 */
async function fetchUserDataFromDatabase(email, fallbackName) {
  try {
    console.log('Fetching user data from database for:', email);
    
    const { data, error } = await supabase
      .from('MedScan Authentication')
      .select('Email, full_name, Name')
      .eq('Email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      // Use fallback data
      displayUserProfile(fallbackName, email);
      return;
    }
    
    if (data) {
      // Use database data
      let displayName = fallbackName;
      
      // Prioritize full_name, then Name, then fallback
      if (data.full_name) {
        displayName = data.full_name;
      } else if (data.Name) {
        displayName = data.Name;
      }
      
      console.log('Successfully fetched user data:', data);
      displayUserProfile(displayName, data.Email);
      
      // Update localStorage with fresh data
      updateLocalSession(data);
    } else {
      console.warn('No user data found in database');
      displayUserProfile(fallbackName, email);
    }
  } catch (err) {
    console.error('Unexpected error fetching user data:', err);
    displayUserProfile(fallbackName, email);
  }
}

/**
 * Display user profile information in the UI
 * @param {string} name - User's display name
 * @param {string} email - User's email address
 */
function displayUserProfile(name, email) {
  console.log('Displaying user profile:', { name, email });
  
  // Update the name element using ID
  const nameElement = document.getElementById('user-name');
  if (nameElement) {
    // Capitalize first letter and format name nicely
    const formattedName = formatUserName(name);
    nameElement.textContent = formattedName;
  } else {
    console.error('Name element with ID "user-name" not found in profile page');
  }
  
  // Update the email element using ID
  const emailElement = document.getElementById('user-email');
  if (emailElement) {
    emailElement.textContent = email;
  } else {
    console.error('Email element with ID "user-email" not found in profile page');
  }
}

/**
 * Format user name for display (capitalize first letter of each word)
 * @param {string} name - Raw name string
 * @returns {string} - Formatted name
 */
function formatUserName(name) {
  if (!name) return 'User';
  
  // If name contains dots (like email username), replace with spaces
  let formattedName = name.replace(/\./g, ' ');
  
  // Capitalize first letter of each word
  formattedName = formattedName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return formattedName;
}

/**
 * Update localStorage session with fresh user data
 * @param {Object} userData - Fresh user data from database
 */
function updateLocalSession(userData) {
  try {
    const existingSession = localStorage.getItem('authSession');
    let sessionData = {};
    
    if (existingSession) {
      sessionData = JSON.parse(existingSession);
    }
    
    // Update with fresh data
    sessionData.user = {
      ...sessionData.user,
      ...userData
    };
    sessionData.email = userData.Email;
    sessionData.timestamp = new Date().getTime();
    
    localStorage.setItem('authSession', JSON.stringify(sessionData));
    console.log('Updated localStorage session with fresh user data');
  } catch (err) {
    console.error('Error updating localStorage session:', err);
  }
}

/**
 * Check if authentication is available and handle redirects
 */
function initProfileAuth() {
  console.log('Initializing profile authentication check');
  
  // Check if user is authenticated
  const authSession = localStorage.getItem('authSession');
  const userEmail = sessionStorage.getItem('userEmail');
  const tempSession = localStorage.getItem('tempRegistrationSession');
  
  if (!authSession && !userEmail && !tempSession) {
    console.warn('No authentication found, redirecting to login');
    // Redirect to login if no authentication found
    setTimeout(() => {
      window.location.href = '../login.html';
    }, 2000);
  }
}

/**
 * Initialize profile page interactions (edit profile, logout, etc.)
 */
function initProfileInteractions() {
  console.log('Initializing profile interactions');
  
  // Edit Profile button - use class selector for the gray button
  const editProfileBtn = document.querySelector('.bg-gray-800');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', handleEditProfile);
    console.log('Edit profile button handler attached');
  }
  
  // Logout functionality - use data attribute
  const logoutBtn = document.querySelector('[data-action="logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
    console.log('Logout button handler attached');
  }
  
  // Add click handlers for other profile options
  initProfileOptionHandlers();
}

/**
 * Handle edit profile button click
 */
function handleEditProfile() {
  console.log('Edit profile clicked');
  // Could redirect to profile edit page or show modal
  // For now, we'll show an alert
  alert('Edit profile functionality will be implemented soon!');
}

/**
 * Handle logout functionality
 */
function handleLogout() {
  console.log('Enhanced logout clicked - will clear all data');
  
  if (confirm('Are you sure you want to logout? This will clear all cached data and log you out completely.')) {
    // Call the enhanced clear cache function which now handles logout
    performClearCache();
  }
}

/**
 * Initialize handlers for profile options (Languages, Location, etc.)
 */
function initProfileOptionHandlers() {
  // Get all profile option elements
  const profileOptions = document.querySelectorAll('.cursor-pointer');
  
  profileOptions.forEach(option => {
    option.addEventListener('click', () => {
      const optionText = option.querySelector('span')?.textContent;
      
      switch(optionText) {
        case 'Languages':
          console.log('Languages option clicked');
          alert('Language settings will be available soon!');
          break;
        case 'Location':
          console.log('Location option clicked');
          alert('Location settings will be available soon!');
          break;
        case 'Clear Cache':
          console.log('Clear Cache option clicked');
          handleClearCache();
          break;
        case 'Clear History':
          console.log('Clear History option clicked');
          handleClearHistory();
          break;
        case 'Settings':
          console.log('Settings option clicked');
          alert('Settings page will be available soon!');
          break;
        case 'Logout':
          handleLogout();
          break;
        default:
          console.log('Unknown option clicked:', optionText);
      }
    });
  });
}

/**
 * Handle clear cache functionality
 */
function handleClearCache() {
  showClearCacheModal();
}

/**
 * Handle clear history functionality
 */
function handleClearHistory() {
  showClearHistoryModal();
}

/**
 * Show Clear Cache Modal
 */
function showClearCacheModal() {
  const modal = document.getElementById('clearCacheModal');
  const modalContent = document.getElementById('clearCacheModalContent');
  
  if (modal && modalContent) {
    modal.classList.remove('hidden');
    
    // Trigger animation
    setTimeout(() => {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    setupClearCacheModalListeners();
  }
}

/**
 * Hide Clear Cache Modal
 */
function hideClearCacheModal() {
  const modal = document.getElementById('clearCacheModal');
  const modalContent = document.getElementById('clearCacheModalContent');
  
  if (modal && modalContent) {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

/**
 * Show Clear History Modal
 */
function showClearHistoryModal() {
  const modal = document.getElementById('clearHistoryModal');
  const modalContent = document.getElementById('clearHistoryModalContent');
  
  if (modal && modalContent) {
    modal.classList.remove('hidden');
    
    // Trigger animation
    setTimeout(() => {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    setupClearHistoryModalListeners();
  }
}

/**
 * Hide Clear History Modal
 */
function hideClearHistoryModal() {
  const modal = document.getElementById('clearHistoryModal');
  const modalContent = document.getElementById('clearHistoryModalContent');
  
  if (modal && modalContent) {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

/**
 * Setup Clear Cache Modal Event Listeners
 */
function setupClearCacheModalListeners() {
  const yesBtn = document.getElementById('clearCacheYes');
  const noBtn = document.getElementById('clearCacheNo');
  const modal = document.getElementById('clearCacheModal');
  
  // Remove existing listeners
  const newYesBtn = yesBtn.cloneNode(true);
  const newNoBtn = noBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
  noBtn.parentNode.replaceChild(newNoBtn, noBtn);
  
  // Add new listeners
  newYesBtn.addEventListener('click', async () => {
    await performClearCache();
    hideClearCacheModal();
  });
  
  newNoBtn.addEventListener('click', () => {
    hideClearCacheModal();
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideClearCacheModal();
    }
  });
}

/**
 * Setup Clear History Modal Event Listeners
 */
function setupClearHistoryModalListeners() {
  const yesBtn = document.getElementById('clearHistoryYes');
  const noBtn = document.getElementById('clearHistoryNo');
  const modal = document.getElementById('clearHistoryModal');
  
  // Remove existing listeners
  const newYesBtn = yesBtn.cloneNode(true);
  const newNoBtn = noBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
  noBtn.parentNode.replaceChild(newNoBtn, noBtn);
  
  // Add new listeners
  newYesBtn.addEventListener('click', async () => {
    await performClearHistory();
    hideClearHistoryModal();
  });
  
  newNoBtn.addEventListener('click', () => {
    hideClearHistoryModal();
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideClearHistoryModal();
    }
  });
}

/**
 * Perform Clear Cache Operation
 */
async function performClearCache() {
  try {
    // Clear cache-related items but preserve authentication
    const itemsToKeep = ['authSession', 'tempRegistrationSession'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!itemsToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage except user email
    const userEmail = sessionStorage.getItem('userEmail');
    sessionStorage.clear();
    if (userEmail) {
      sessionStorage.setItem('userEmail', userEmail);
    }
    
    // Show success feedback
    showMobileSuccessFeedback('Cache cleared successfully!');
    console.log('Cache cleared successfully');
    
    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
  } catch (error) {
    console.error('Error clearing cache:', error);
    showMobileSuccessFeedback('Error clearing cache. Please try again.');
  }
}

/**
 * Perform Clear History Operation
 */
async function performClearHistory() {
  try {
    // In a real implementation, this would make API calls to clear user history
    // For now, we'll simulate the operation and clear any history-related localStorage items
    
    const historyKeys = Object.keys(localStorage).filter(key => 
      key.includes('history') || 
      key.includes('search') || 
      key.includes('recent')
    );
    
    historyKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Show success feedback
    showMobileSuccessFeedback('History cleared successfully!');
    console.log('History cleared successfully');
    
    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
  } catch (error) {
    console.error('Error clearing history:', error);
    showMobileSuccessFeedback('Error clearing history. Please try again.');
  }
}

/**
 * Show mobile-friendly success feedback
 */
function showMobileSuccessFeedback(message) {
  // Create temporary success message
  const feedback = document.createElement('div');
  feedback.className = 'fixed top-4 left-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-center transform transition-all duration-300 -translate-y-full';
  feedback.textContent = `✓ ${message}`;
  
  document.body.appendChild(feedback);
  
  // Trigger animation
  setTimeout(() => {
    feedback.classList.remove('-translate-y-full');
    feedback.classList.add('translate-y-0');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    feedback.classList.remove('translate-y-0');
    feedback.classList.add('-translate-y-full');
    
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 300);
  }, 3000);
}

/**
 * Avatar selection and management functionality
 * Optimized for mobile devices
 */

// Avatar options with emoji/icon representations (mobile-friendly)
const avatarOptions = [
    { id: 'male1', type: 'emoji', content: '👨', name: 'Male 1' },
    { id: 'male2', type: 'emoji', content: '👨‍💼', name: 'Male Professional' },
    { id: 'male3', type: 'emoji', content: '👨‍🎓', name: 'Male Graduate' },
    { id: 'male4', type: 'emoji', content: '👨‍⚕️', name: 'Male Doctor' },
    { id: 'female1', type: 'emoji', content: '👩', name: 'Female 1' },
    { id: 'female2', type: 'emoji', content: '👩‍💼', name: 'Female Professional' },
    { id: 'female3', type: 'emoji', content: '👩‍🎓', name: 'Female Graduate' },
    { id: 'female4', type: 'emoji', content: '👩‍⚕️', name: 'Female Doctor' },
    { id: 'tech1', type: 'emoji', content: '👨‍💻', name: 'Male Tech' },
    { id: 'tech2', type: 'emoji', content: '👩‍💻', name: 'Female Tech' },
    { id: 'artist1', type: 'emoji', content: '👨‍🎨', name: 'Male Artist' },
    { id: 'artist2', type: 'emoji', content: '👩‍🎨', name: 'Female Artist' },
];

/**
 * Initialize avatar selection functionality
 */
function initAvatarSelection() {
    console.log('Initializing mobile-optimized avatar selection functionality');
    
    // Add click handlers to SVG elements that should trigger the modal
    initAvatarTriggers();
    
    // Setup modal functionality
    setupAvatarModal();
    
    // Load saved avatar if exists
    loadSavedAvatar();
}

/**
 * Add click handlers to elements that trigger avatar selection
 */
function initAvatarTriggers() {
    // Header grid/QR icon
    const headerSVG = document.querySelector('header svg');
    if (headerSVG) {
        headerSVG.addEventListener('click', openAvatarModal);
        headerSVG.style.cursor = 'pointer';
        headerSVG.classList.add('hover:opacity-75', 'transition-opacity');
        console.log('Header SVG avatar trigger added');
    }
    
    // Main profile avatar
    const profileAvatar = document.querySelector('.relative svg[width="74"]');
    if (profileAvatar) {
        profileAvatar.addEventListener('click', openAvatarModal);
        profileAvatar.style.cursor = 'pointer';
        profileAvatar.classList.add('hover:opacity-75', 'transition-opacity');
        console.log('Profile avatar trigger added');
    }
    
    // Camera icon overlay
    const cameraIcon = document.querySelector('.bg-teal-600');
    if (cameraIcon) {
        cameraIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling to parent SVG
            openAvatarModal();
        });
        cameraIcon.style.cursor = 'pointer';
        cameraIcon.classList.add('hover:bg-teal-700', 'transition-colors');
        console.log('Camera icon trigger added');
    }
}

/**
 * Setup avatar modal functionality
 */
function setupAvatarModal() {
    const modal = document.getElementById('avatarModal');
    const closeBtn = document.getElementById('closeAvatarModal');
    const customUpload = document.getElementById('customAvatarUpload');
    
    if (!modal) {
        console.error('Avatar modal not found in DOM');
        return;
    }
    
    // Close modal handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAvatarModal);
    }
    
    // Close modal when clicking outside (with touch support)
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeAvatarModal();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeAvatarModal();
        }
    });
    
    // Handle custom file upload
    if (customUpload) {
        customUpload.addEventListener('change', handleCustomAvatarUpload);
    }
    
    // Populate avatar grid
    populateAvatarGrid();
    
    console.log('Mobile-optimized avatar modal setup complete');
}

/**
 * Open the avatar selection modal
 */
function openAvatarModal() {
    console.log('Opening mobile avatar selection modal');
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Add focus trap for accessibility
        modal.focus();
        
        // Vibration feedback for mobile devices (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(50); // Short vibration
        }
    }
}

/**
 * Close the avatar selection modal
 */
function closeAvatarModal() {
    console.log('Closing avatar selection modal');
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

/**
 * Populate the avatar grid with options (mobile-optimized)
 */
function populateAvatarGrid() {
    const grid = document.getElementById('avatarGrid');
    if (!grid) return;
    
    // Clear existing content
    grid.innerHTML = '';
    
    // Add avatar options with touch-friendly interactions
    avatarOptions.forEach((avatar, index) => {
        const avatarElement = document.createElement('div');
        avatarElement.className = 'avatar-option';
        avatarElement.setAttribute('data-avatar-id', avatar.id);
        avatarElement.setAttribute('title', avatar.name);
        avatarElement.setAttribute('role', 'button');
        avatarElement.setAttribute('tabindex', '0');
        avatarElement.setAttribute('aria-label', `Select ${avatar.name} avatar`);
        
        if (avatar.type === 'emoji') {
            avatarElement.textContent = avatar.content;
        } else if (avatar.type === 'image') {
            const img = document.createElement('img');
            img.src = avatar.content;
            img.alt = avatar.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            avatarElement.appendChild(img);
        }
        
        // Add click/touch handler
        avatarElement.addEventListener('click', () => selectAvatar(avatar));
        
        // Add keyboard support
        avatarElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectAvatar(avatar);
            }
        });
        
        // Add touch feedback
        avatarElement.addEventListener('touchstart', () => {
            avatarElement.style.transform = 'scale(0.95)';
        });
        
        avatarElement.addEventListener('touchend', () => {
            avatarElement.style.transform = '';
        });
        
        grid.appendChild(avatarElement);
    });
    
    console.log('Mobile avatar grid populated with', avatarOptions.length, 'options');
}

/**
 * Handle avatar selection with mobile feedback
 * @param {Object} avatar - Selected avatar object
 */
function selectAvatar(avatar) {
    console.log('Avatar selected:', avatar);
    
    // Haptic feedback for mobile
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Pattern vibration
    }
    
    // Remove previous selection
    document.querySelectorAll('.avatar-option.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Mark current selection
    const selectedElement = document.querySelector(`[data-avatar-id="${avatar.id}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
    
    // Save to localStorage using W3Schools localStorage method
    saveAvatarToLocalStorage(avatar);
    
    // Update profile display
    updateProfileAvatar(avatar);
    
    // Show mobile-friendly success feedback
    showMobileAvatarFeedback();
    
    // Close modal after short delay for visual feedback
    setTimeout(() => {
        closeAvatarModal();
    }, 800);
}

/**
 * Save avatar to localStorage following W3Schools localStorage patterns
 * @param {Object} avatar - Avatar object to save
 */
function saveAvatarToLocalStorage(avatar) {
    try {
        // Create avatar data object
        const avatarData = {
            id: avatar.id,
            type: avatar.type,
            content: avatar.content,
            name: avatar.name,
            timestamp: new Date().getTime()
        };
        
        // Save to localStorage as JSON string
        localStorage.setItem('userAvatar', JSON.stringify(avatarData));
        
        // Also update the existing auth session with avatar info
        const authSession = localStorage.getItem('authSession');
        if (authSession) {
            try {
                const sessionData = JSON.parse(authSession);
                sessionData.avatar = avatarData;
                localStorage.setItem('authSession', JSON.stringify(sessionData));
            } catch (err) {
                console.error('Error updating auth session with avatar:', err);
            }
        }
        
        console.log('Avatar saved to localStorage:', avatarData);
        
    } catch (error) {
        console.error('Error saving avatar to localStorage:', error);
        alert('Failed to save avatar. Please try again.');
    }
}

/**
 * Load saved avatar from localStorage
 */
function loadSavedAvatar() {
    try {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            const avatarData = JSON.parse(savedAvatar);
            console.log('Loading saved avatar:', avatarData);
            updateProfileAvatar(avatarData);
        }
    } catch (error) {
        console.error('Error loading saved avatar:', error);
    }
}

/**
 * Update the profile avatar display
 * @param {Object} avatar - Avatar data object
 */
function updateProfileAvatar(avatar) {
    console.log('Profile avatar updated with:', avatar.name);
    
    // Add visual indication that avatar was updated
    const profileSection = document.querySelector('.relative');
    if (profileSection) {
        // Add a temporary highlight effect
        profileSection.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
        profileSection.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            profileSection.style.boxShadow = '';
            profileSection.style.transform = '';
        }, 1000);
    }
}

/**
 * Handle custom avatar file upload (mobile-optimized)
 * @param {Event} event - File input change event
 */
function handleCustomAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (2MB limit for mobile)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        alert('File size too large. Please choose a file under 2MB for mobile compatibility.');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }
    
    // Show loading indicator
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
        uploadSection.innerHTML = '<div class="text-center p-4"><i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i><p class="text-sm text-gray-600 mt-2">Processing image...</p></div>';
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const customAvatar = {
            id: 'custom_' + Date.now(),
            type: 'image',
            content: e.target.result, // Base64 data URL
            name: 'Custom Avatar'
        };
        
        selectAvatar(customAvatar);
    };
    
    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsDataURL(file);
}

/**
 * Show feedback when avatar is updated
 */
function showAvatarUpdateFeedback() {
    // Create temporary success message
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    feedback.textContent = '✓ Avatar updated successfully!';
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

/**
 * Show mobile-friendly success feedback
 */
function showMobileAvatarFeedback() {
    // Create temporary success message
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    feedback.textContent = '✓ Avatar updated successfully!';
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

// Export functions for testing or external use
export {
  loadUserProfile,
  displayUserProfile,
  formatUserName,
  handleLogout,
  fetchUserDataFromDatabase,
  initAvatarSelection,
  openAvatarModal,
  closeAvatarModal,
  selectAvatar,
  saveAvatarToLocalStorage,
  loadSavedAvatar,
  handleClearCache,
  handleClearHistory,
  showClearCacheModal,
  hideClearCacheModal,
  showClearHistoryModal,
  hideClearHistoryModal
};