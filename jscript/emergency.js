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


/* End of Emergency Contact Functions */
