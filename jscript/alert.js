//Start of Toggle Theme
/**
 * Initialize all alert page functionality when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Alert page loaded, initializing components');
  
    // Check if theme toggle exists in HTML
    // Since we're removing the toggle from UI, don't call addThemeToggleToDOM()
    // Original line: addThemeToggleToDOM(); // <-- REMOVE or COMMENT OUT
  
    // Optionally, you could manually set the theme here based on saved preference
    // For example:
    const savedTheme = localStorage.getItem("darkTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme !== null ? savedTheme === "true" : prefersDark;
    applyTheme(isDark);

    // Initialize diagnosis display
    initializeDiagnosisDisplay();
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
//End of Toggle Theme

/* ---------------------------------------------------- */
/* Alert Functions - Dynamic Diagnosis Display */
/* ---------------------------------------------------- */

/**
 * Initialize the diagnosis display sequence
 */
function initializeDiagnosisDisplay() {
    const diagnosisList = document.getElementById('diagnosisList');
    if (!diagnosisList) {
        console.error('Diagnosis list container not found');
        return;
    }

    // Clear existing content
    diagnosisList.innerHTML = '';
    
    // Start the diagnosis sequence
    displayPulseRate();
}

/**
 * Display pulse rate information
 */
function displayPulseRate() {
    const diagnosisList = document.getElementById('diagnosisList');
    
    const pulseElement = createDiagnosisCard('Pulse Rate: <span class="font-normal">98 bpm</span>');
    diagnosisList.appendChild(pulseElement);
    
    // After 1 second, show measuring oxygen level
    setTimeout(() => {
        displayMeasuringOxygen();
    }, 1000);
}

/**
 * Display measuring oxygen level with loading animation
 */
function displayMeasuringOxygen() {
    const diagnosisList = document.getElementById('diagnosisList');
    
    const measuringElement = createLoadingCard('Measuring...');
    diagnosisList.appendChild(measuringElement);
    
    // After 3 seconds, replace with oxygen level result
    setTimeout(() => {
        diagnosisList.removeChild(measuringElement);
        displayOxygenLevel();
    }, 3000);
}

/**
 * Display oxygen level result
 */
function displayOxygenLevel() {
    const diagnosisList = document.getElementById('diagnosisList');
    
    const oxygenElement = createDiagnosisCard('Oxygen Level: <span class="font-normal">96%</span>');
    diagnosisList.appendChild(oxygenElement);
    
    // After 1 second, show analyzing
    setTimeout(() => {
        displayAnalyzing();
    }, 1000);
}

/**
 * Display analyzing status
 */
function displayAnalyzing() {
    const diagnosisList = document.getElementById('diagnosisList');
    
    const analyzingElement = createLoadingCard('Analyzing...');
    diagnosisList.appendChild(analyzingElement);
    
    // After 2 seconds, show action buttons
    setTimeout(() => {
        diagnosisList.removeChild(analyzingElement);
        displayActionButtons();
    }, 2000);
}

/**
 * Display action buttons (View AI Analysis and Save)
 */
function displayActionButtons() {
    const diagnosisList = document.getElementById('diagnosisList');
    
    // Create View AI Analysis button
    const analysisButton = createActionButton('View AI Analysis', 'analysis');
    diagnosisList.appendChild(analysisButton);
    
    // Create Save button
    const saveButton = createActionButton('SAVE', 'save');
    diagnosisList.appendChild(saveButton);
}

/**
 * Create a diagnosis card element
 */
function createDiagnosisCard(content) {
    const card = document.createElement('div');
    card.className = 'bg-teal-500 text-white px-6 py-4 rounded-lg font-medium text-center w-full col-span-2 mb-4';
    card.innerHTML = content;
    return card;
}

/**
 * Create a loading card with gif animation
 */
function createLoadingCard(text) {
    const card = document.createElement('div');
    card.className = 'bg-teal-500 text-white px-6 py-4 rounded-lg font-medium flex items-center justify-center w-full col-span-2 mb-4';
    card.innerHTML = `
        <img src="https://media.tenor.com/WX_LDjYUrMsAAAAi/loading.gif" 
             alt="Loading" 
             class="w-6 h-6 mr-3">
        <span>${text}</span>
    `;
    return card;
}

/**
 * Create action button
 */
function createActionButton(text, type) {
    const button = document.createElement('button');
    
    if (type === 'save') {
        button.className = 'bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200 w-24 mb-4';
    } else {
        button.className = 'bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200 col-span-2 mb-4';
    }
    
    button.textContent = text;
    
    // Add click event listeners
    button.addEventListener('click', () => {
        handleButtonClick(type);
    });
    
    return button;
}

/**
 * Handle button clicks
 */
function handleButtonClick(type) {
    switch(type) {
        case 'analysis':
            console.log('View AI Analysis clicked');
            // Add your analysis view logic here
            showAIAnalysis();
            break;
        case 'save':
            console.log('Save clicked');
            // Add your save logic here
            window.location.href = '../../pages/dashboard.html';
            break;
        default:
            console.log('Unknown button type:', type);
    }
}

/**
 * Show AI Analysis Summary
 */
function showAIAnalysis() {
    const diagnosisList = document.getElementById('diagnosisList');
    if (!diagnosisList) {
        console.error('Diagnosis list container not found');
        return;
    }

    // Clear existing content to hide pulse rate and oxygen level
    diagnosisList.innerHTML = '';
    
    // Create AI Analysis Summary container
    const analysisContainer = document.createElement('div');
    analysisContainer.className = 'col-span-2 w-full';
    
    // Create the summary content
    analysisContainer.innerHTML = `
        <h1 class="text-white text-xl font-bold mb-4">AI Analysis Summary:</h1>
        <ul class="text-white space-y-2 list-disc list-inside">
            <li>Pulse Rate: 98bpm (<span class="text-teal">Normal</span>)</li>
            <li>Oxygen Level: 96% (<span class="text-teal">Normal</span>)</li>
            <li>Suggestion: Possible viral infection. Monitor every 3hrs.</li>
        </ul>
    `;
    
    // Add the analysis summary to the diagnosis list
    diagnosisList.appendChild(analysisContainer);
    
    // After showing analysis, display the save button again
    setTimeout(() => {
        displaySaveButton();
    }, 500);
}

/**
 * Display only the Save button after AI Analysis
 */
function displaySaveButton() {
    const diagnosisList = document.getElementById('diagnosisList');
    
    // Create Save button
    const saveButton = createActionButton('SAVE', 'save');
    diagnosisList.appendChild(saveButton);
}

/**
 * Save results (placeholder function)
 */
function saveResults() {
    alert('Results saved successfully!');
    // Implement your save logic here
}

/**
 * Reset diagnosis display (utility function)
 */
function resetDiagnosisDisplay() {
    const diagnosisList = document.getElementById('diagnosisList');
    if (diagnosisList) {
        diagnosisList.innerHTML = '';
        initializeDiagnosisDisplay();
    }
}

// Export functions for potential external use
window.AlertFunctions = {
    initializeDiagnosisDisplay,
    resetDiagnosisDisplay,
    showAIAnalysis,
    saveResults
};