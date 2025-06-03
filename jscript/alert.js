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

/* ---------------------------------------------------- */
/* BMI Calculator Functions - Dynamic Interface */
/* ---------------------------------------------------- */

/**
 * Initialize BMI Calculator display
 */
function initializeBMICalculator() {
    const diagnosisList = document.getElementById('diagnosisList');
    if (!diagnosisList) {
        console.error('Diagnosis list container not found');
        return;
    }

    // Clear existing content
    diagnosisList.innerHTML = '';
    
    // Create BMI calculator interface
    createBMIInterface();
}

/**
 * Create the complete BMI calculator interface
 */
function createBMIInterface() {
    const diagnosisList = document.getElementById('diagnosisList');
    
    // BMI State - Updated default values
    const bmiState = {
        age: 25,
        weight: 65,
        height: 170,
        isMale: false
    };

    // Create Age and Weight Grid
    const ageWeightGrid = createAgeWeightGrid(bmiState);
    diagnosisList.appendChild(ageWeightGrid);

    // Create Height Card
    const heightCard = createHeightCard(bmiState);
    diagnosisList.appendChild(heightCard);

    // Create Gender Card
    const genderCard = createGenderCard(bmiState);
    diagnosisList.appendChild(genderCard);

    // Create Calculate Button
    const calculateButton = createCalculateButton(bmiState);
    diagnosisList.appendChild(calculateButton);
}

/**
 * Create Age and Weight grid cards
 */
function createAgeWeightGrid(bmiState) {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'col-span-2 grid grid-cols-2 gap-4 mb-4';

    // Age Card - Added black border
    const ageCard = document.createElement('div');
    ageCard.className = 'bg-teal-500 border-2 border-black rounded-xl p-6 text-white text-center';
    ageCard.innerHTML = `
        <label class="block text-sm font-medium mb-4">Age</label>
        <div id="ageValue" class="text-4xl font-bold mb-4">${bmiState.age}</div>
        <div class="flex justify-center items-center space-x-6">
            <button id="ageDecrement" class="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition">
                <i class="fas fa-minus text-lg"></i>
            </button>
            <button id="ageIncrement" class="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition">
                <i class="fas fa-plus text-lg"></i>
            </button>
        </div>
    `;

    // Weight Card - Added black border
    const weightCard = document.createElement('div');
    weightCard.className = 'bg-teal-500 border-2 border-black rounded-xl p-6 text-white text-center';
    weightCard.innerHTML = `
        <label class="block text-sm font-medium mb-4">Weight(KG)</label>
        <div id="weightValue" class="text-4xl font-bold mb-4">${bmiState.weight}</div>
        <div class="flex justify-center items-center space-x-6">
            <button id="weightDecrement" class="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition">
                <i class="fas fa-minus text-lg"></i>
            </button>
            <button id="weightIncrement" class="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition">
                <i class="fas fa-plus text-lg"></i>
            </button>
        </div>
    `;

    gridContainer.appendChild(ageCard);
    gridContainer.appendChild(weightCard);

    // Add event listeners for age
    setTimeout(() => {
        document.getElementById('ageDecrement').addEventListener('click', () => {
            if (bmiState.age > 1) {
                bmiState.age--;
                document.getElementById('ageValue').textContent = bmiState.age;
            }
        });
        document.getElementById('ageIncrement').addEventListener('click', () => {
            if (bmiState.age < 120) {
                bmiState.age++;
                document.getElementById('ageValue').textContent = bmiState.age;
            }
        });

        // Add event listeners for weight
        document.getElementById('weightDecrement').addEventListener('click', () => {
            if (bmiState.weight > 1) {
                bmiState.weight--;
                document.getElementById('weightValue').textContent = bmiState.weight;
            }
        });
        document.getElementById('weightIncrement').addEventListener('click', () => {
            if (bmiState.weight < 300) {
                bmiState.weight++;
                document.getElementById('weightValue').textContent = bmiState.weight;
            }
        });
    }, 10);

    return gridContainer;
}

/**
 * Create Height card with slider
 */
function createHeightCard(bmiState) {
    const heightCard = document.createElement('div');
    heightCard.className = 'col-span-2 bg-teal-500 border-2 border-black rounded-xl p-6 text-white mb-4';
    heightCard.innerHTML = `
        <label class="block text-sm font-medium mb-4 text-center">Height (CM)</label>
        <div id="heightValue" class="text-4xl font-bold mb-6 text-center">${bmiState.height}</div>
        <div class="relative">
            <input type="range" id="heightSlider" min="50" max="300" value="${bmiState.height}" class="w-full h-2 bg-teal-600 rounded-lg appearance-none cursor-pointer">
            <div class="flex justify-between text-sm mt-2">
                <span>50 cm</span>
                <span>300 cm</span>
            </div>
        </div>
    `;

    // Add event listener for height slider
    setTimeout(() => {
        document.getElementById('heightSlider').addEventListener('input', (e) => {
            bmiState.height = parseInt(e.target.value);
            document.getElementById('heightValue').textContent = bmiState.height;
        });
    }, 10);

    return heightCard;
}

/**
 * Create Gender card with switch
 */
function createGenderCard(bmiState) {
    const genderCard = document.createElement('div');
    genderCard.className = 'col-span-2 bg-teal-500 border-2 border-black rounded-xl p-6 text-white mb-4';
    genderCard.innerHTML = `
        <label class="block text-sm font-medium mb-4 text-center">Gender</label>
        <div class="flex items-center justify-center space-x-4">
            <span class="text-lg">Male</span>
            <div class="relative">
                <div id="genderSwitch" class="w-16 h-8 bg-teal-600 rounded-full cursor-pointer transition-all duration-300">
                    <div id="genderToggle" class="w-6 h-6 ${bmiState.isMale ? 'bg-blue-500' : 'bg-pink-500'} rounded-full mt-1 ml-1 transition-transform duration-300 ease-in-out ${bmiState.isMale ? '' : 'transform translate-x-8'}"></div>
                </div>
            </div>
            <span class="text-lg">Female</span>
        </div>
    `;

    // Add event listener for gender switch
    setTimeout(() => {
        document.getElementById('genderSwitch').addEventListener('click', () => {
            bmiState.isMale = !bmiState.isMale;
            const toggle = document.getElementById('genderToggle');
            if (bmiState.isMale) {
                toggle.className = 'w-6 h-6 bg-blue-500 rounded-full mt-1 ml-1 transition-transform duration-300 ease-in-out';
            } else {
                toggle.className = 'w-6 h-6 bg-pink-500 rounded-full mt-1 ml-1 transition-transform duration-300 ease-in-out transform translate-x-8';
            }
        });
    }, 10);

    return genderCard;
}

/**
 * Create Calculate BMI button
 */
function createCalculateButton(bmiState) {
    const button = document.createElement('button');
    button.className = 'col-span-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition duration-300 text-lg';
    button.textContent = 'Calculate BMI';

    button.addEventListener('click', () => {
        calculateBMI(bmiState);
    });

    return button;
}

/**
 * Calculate and display BMI result
 */
function calculateBMI(bmiState) {
    const heightInMeters = bmiState.height / 100;
    const bmi = (bmiState.weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        color = 'text-blue-400';
    } else if (bmi < 25) {
        category = 'Normal';
        color = 'text-teal-400';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = 'text-yellow-400';
    } else {
        category = 'Obese';
        color = 'text-red-400';
    }

    // Display result
    const diagnosisList = document.getElementById('diagnosisList');
    diagnosisList.innerHTML = `
        <div class="col-span-2 text-center text-white">
            <h2 class="text-2xl font-bold mb-4">BMI Result</h2>
            <div class="bg-teal-500 rounded-xl p-6 mb-4">
                <div class="text-4xl font-bold mb-2">${bmi}</div>
                <div class="text-lg ${color} font-semibold">${category}</div>
                <div class="text-sm mt-2">Age: ${bmiState.age} | Weight: ${bmiState.weight}kg | Height: ${bmiState.height}cm</div>
                <div class="text-sm">Gender: ${bmiState.isMale ? 'Male' : 'Female'}</div>
            </div>
            <button onclick="initializeBMICalculator()" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Recalculate
            </button>
        </div>
    `;
}

// Export BMI functions for external use
window.BMIFunctions = {
    initializeBMICalculator,
    calculateBMI
};

/* ---------------------------------------------------- */
/* Above: BMI Calculator Functions - Dynamic Interface */
/* Below: Future Functions can be added here */
/* ---------------------------------------------------- */
