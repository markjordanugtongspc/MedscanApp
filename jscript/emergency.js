/**
 * Emergency page JavaScript functionality
 */
/**
 * Initialize all emergency page functionality when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Emergency page loaded, initializing components');
  
    // Check if theme toggle exists in HTML
    // Since we're removing the toggle from UI, don't call addThemeToggleToDOM()
    // Original line: addThemeToggleToDOM(); // <-- REMOVE or COMMENT OUT
  
    // Optionally, you could manually set the theme here based on saved preference
    // For example:
    const savedTheme = localStorage.getItem("darkTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme !== null ? savedTheme === "true" : prefersDark;
    applyTheme(isDark);
  });
  
  /**
   * Add theme toggle component to DOM if not present in HTML
   * (This function is now effectively disabled / not used)
   */
  function addThemeToggleToDOM() {
    // Commented out to prevent toggle creation
    /*
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'theme-toggle fixed top-4 right-4 z-50';
    toggleContainer.innerHTML = `
      <label class="switch">
        <input type="checkbox" id="input">
        <span class="slider round"></span>
      </label>
    `;
    document.body.appendChild(toggleContainer);
    // Initialize the toggle after adding to DOM
    initToggleSwitch();
    */
  }
  
  /**
   * Initialize toggle switch functionality for theme switching
   * (This runs only if toggle element exists, which now it does not)
   */
  function initToggleSwitch() {
    const themeToggle = document.getElementById("input");
    if (themeToggle) {
      console.log("Theme toggle found, initializing dark/light mode");
      const savedTheme = localStorage.getItem("darkTheme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDarkTheme = savedTheme !== null ? savedTheme === "true" : prefersDark;
      themeToggle.checked = isDarkTheme;
      applyTheme(isDarkTheme);
  
      themeToggle.addEventListener("change", function() {
        const isDark = this.checked;
        applyTheme(isDark);
        localStorage.setItem("darkTheme", isDark);
        console.log("Theme toggled:", isDark ? "dark" : "light");
      });
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
  }
  
  /**
   * Apply theme changes to the application
   */
  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }

/* ---------------------------------------------------- */
/* Emergency Functions - To be implemented in the future */
/* ---------------------------------------------------- */

/**
 * Emergency Contact Modal Functionality
 * Handles the opening and closing of the emergency contact modal
 */
document.addEventListener('DOMContentLoaded', () => {
  const triggerBtn = document.getElementById('continue-button');
  const modalSection = document.getElementById('emergency-modal');
  const closeBtn = document.getElementById('close-modal');
  const addContactBtn = document.querySelector('.bg-teal-500.rounded-full');
  let contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];

  // Show modal on clicking trigger button
  if (triggerBtn && modalSection) {
    triggerBtn.addEventListener('click', () => {
      modalSection.classList.remove('hidden');
    });
  }

  // Close modal on click close button
  if (closeBtn && modalSection) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalSection.classList.add('hidden');
    });
  }

  // Close modal when clicking outside the modal content
  modalSection?.addEventListener('click', (e) => {
    if (e.target === modalSection) {
      modalSection.classList.add('hidden');
    }
  });

  // Add contact functionality
  if (addContactBtn) {
    addContactBtn.addEventListener('click', () => {
      showAddContactModal();
    });
  }

  // Initialize the contacts list with scrollable container
  initializeContactsList();

  // Function to sync theme with current app theme
  function syncModalTheme() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const modal = document.querySelector('.fixed.inset-0.z-20');
    
    if (modal) {
      if (isDarkTheme) {
        // Apply dark theme to modal elements
        const modalContent = modal.querySelector('.bg-white');
        if (modalContent) modalContent.classList.replace('bg-white', 'bg-gray-800');
        
        // Update text colors for dark theme
        const labels = modal.querySelectorAll('.text-gray-700');
        labels.forEach(label => label.classList.replace('text-gray-700', 'text-gray-300'));
        
        // Update input backgrounds
        const inputs = modal.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.classList.add('bg-gray-700', 'text-white', 'border-gray-600');
        });
      } else {
        // Apply light theme to modal elements
        const modalContent = modal.querySelector('.bg-gray-800');
        if (modalContent) modalContent.classList.replace('bg-gray-800', 'bg-white');
        
        // Update text colors for light theme
        const labels = modal.querySelectorAll('.text-gray-300');
        labels.forEach(label => label.classList.replace('text-gray-300', 'text-gray-700'));
        
        // Update input backgrounds
        const inputs = modal.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.classList.remove('bg-gray-700', 'text-white', 'border-gray-600');
        });
      }
    }
  }

  // Function to show add contact modal
  function showAddContactModal() {
    // Create modal backdrop
    const addContactModal = document.createElement('div');
    addContactModal.className = 'fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm';
    
    // Create modal content
    addContactModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-md mx-4">
        <div class="bg-teal-500 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h3 class="text-xl font-semibold">Add New Contact</h3>
          <button id="close-add-contact" class="text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-6">
          <form id="contact-form" class="space-y-4">
            <div class="flex flex-col items-center mb-4">
              <div class="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-2 flex items-center justify-center relative">
                <img id="contact-photo-preview" class="w-full h-full object-cover" src="../../images/emergency/contacts/default.jpg" alt="Contact photo">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <i class="fas fa-camera text-white text-xl"></i>
                </div>
              </div>
              <input type="file" id="contact-photo" class="hidden" accept="image/*">
              <label for="contact-photo" class="text-sm text-teal-500 cursor-pointer">Upload Photo</label>
            </div>
            
            <div>
              <label for="contact-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" id="contact-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required>
            </div>
            
            <div>
              <label for="contact-phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input type="tel" id="contact-phone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required>
            </div>
            
            <div>
              <label for="contact-relation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship</label>
              <select id="contact-relation" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Doctor">Doctor</option>
                <option value="Therapist">Therapist</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div class="flex justify-end pt-4">
              <button type="button" id="cancel-add-contact" class="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" class="px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600">Save Contact</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(addContactModal);
    
    // Sync modal theme with current app theme
    syncModalTheme();
    
    // Add a mutation observer to detect theme changes while modal is open
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            (mutation.target.classList.contains('dark-theme') || 
             !mutation.target.classList.contains('dark-theme'))) {
          syncModalTheme();
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // Handle photo upload preview
    const photoInput = document.getElementById('contact-photo');
    const photoPreview = document.getElementById('contact-photo-preview');
    
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newContact = {
        id: Date.now(),
        name: document.getElementById('contact-name').value,
        phone: document.getElementById('contact-phone').value,
        relation: document.getElementById('contact-relation').value,
        photo: photoPreview.src
      };
      
      // Add to contacts array and save to localStorage
      contacts.push(newContact);
      localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
      
      // Update UI with new contact
      updateContactsList();
      
      // Close modal
      document.body.removeChild(addContactModal);
      observer.disconnect();
    });
    
    // Handle close buttons
    document.getElementById('close-add-contact').addEventListener('click', () => {
      document.body.removeChild(addContactModal);
      observer.disconnect();
    });
    
    document.getElementById('cancel-add-contact').addEventListener('click', () => {
      document.body.removeChild(addContactModal);
      observer.disconnect();
    });
    
    // Close when clicking outside
    addContactModal.addEventListener('click', (e) => {
      if (e.target === addContactModal) {
        document.body.removeChild(addContactModal);
        observer.disconnect();
      }
    });
  }
  
  // Function to initialize the contacts list container with scrollable functionality
  function initializeContactsList() {
    const modalContent = document.querySelector('#emergency-modal .p-4');
    if (!modalContent) return;
    
    // Get the existing contact list container
    const existingContactList = document.querySelector('#emergency-modal .space-y-4');
    if (!existingContactList) return;
    
    // Create a scrollable container that respects the parent modal height
    const scrollableContainer = document.createElement('div');
    scrollableContainer.className = 'overflow-y-auto pr-2 custom-scrollbar';
    scrollableContainer.style.cssText = 'scrollbar-width: thin; scrollbar-color: #4fd1c5 transparent; max-height: calc(42rem - 180px);';
    
    // Add custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #4fd1c5;
        border-radius: 10px;
      }
    `;
    document.head.appendChild(style);
    
    // Replace the existing contact list with the scrollable container
    existingContactList.parentNode.replaceChild(scrollableContainer, existingContactList);
    scrollableContainer.appendChild(existingContactList);
    
    // Update the contacts list initially
    updateContactsList();
  }
  
  // Function to update contacts list in the UI
  function updateContactsList() {
    const contactListContainer = document.querySelector('#emergency-modal .space-y-4');
    if (!contactListContainer) return;
    
    // Get the static contacts (first two contacts in the HTML)
    const staticContacts = Array.from(contactListContainer.children).slice(0, 2);
    
    // Clear existing contacts
    contactListContainer.innerHTML = '';
    
    // Add back the static contacts first
    staticContacts.forEach(contact => {
      contactListContainer.appendChild(contact);
    });
    
    // Add dynamic contacts from localStorage
    contacts.forEach(contact => {
      const contactElement = document.createElement('div');
      contactElement.className = 'flex items-center py-2';
      contactElement.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-3 flex-shrink-0">
          <img src="${contact.photo}" alt="${contact.name}" class="w-full h-full object-cover">
        </div>
        <div>
          <h3 class="text-white font-semibold">${contact.name}</h3>
          <p class="text-gray-500 text-sm">${contact.phone}</p>
        </div>
      `;
      contactListContainer.appendChild(contactElement);
    });
  }
});

/* End of Emergency Contact Functions */
