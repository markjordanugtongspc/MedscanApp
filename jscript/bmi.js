/* ---------------------------------------------------- */
/* BMI Calculator Functions - Clean Version */
/* ---------------------------------------------------- */

// BMI values using const array - can change elements but not reassign array
const bmiValues = [25, 65, 150]; // [age, weight, height]

// BMI configuration using const object - can change properties but not reassign object
const bmiConfig = {
  minAge: 1,
  maxAge: 120,
  minWeight: 1,
  maxWeight: 300,
  minHeight: 50,
  maxHeight: 300,
  isMale: false,
  lastCalculatedBMI: null,
  lastCategory: null
};

/**
 * Initialize all BMI page functionality when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('BMI page loaded, initializing components');
    
    // Apply theme
    const savedTheme = localStorage.getItem("darkTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme !== null ? savedTheme === "true" : prefersDark;
    applyTheme(isDark);

    // Initialize all BMI components
    initializeStaticBMICalculator();
    updateCalculateButtonForResults();
});

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

/**
 * Initialize BMI Calculator for static HTML elements
 */
function initializeStaticBMICalculator() {
    updateAllDisplays();
    initializeAgeControls();
    initializeWeightControls();
    initializeHeightControls();
    initializeGenderToggle();
}

/**
 * Update all display values with current const array values
 */
function updateAllDisplays() {
    // Update age display
    const ageDisplay = document.getElementById('ageDisplay');
    if (ageDisplay) {
        ageDisplay.textContent = bmiValues[0];
    }
    
    // Update weight display
    const weightDisplays = document.querySelectorAll('.text-4xl.font-bold.mb-4');
    if (weightDisplays.length > 1) {
        weightDisplays[1].textContent = bmiValues[1];
        weightDisplays[1].id = 'weightDisplay';
    }
    
    // Update height display
    const heightDisplay = document.querySelector('.text-4xl.font-bold.mb-6.text-center');
    if (heightDisplay) {
        heightDisplay.textContent = bmiValues[2];
        heightDisplay.id = 'heightDisplay';
    }
    
    // Update height slider
    const heightSlider = document.querySelector('input[type="range"]');
    if (heightSlider) {
        heightSlider.value = bmiValues[2];
        heightSlider.id = 'heightSlider';
    }
}

/**
 * Initialize age controls functionality
 */
function initializeAgeControls() {
    const ageButtons = document.querySelectorAll('.fas.fa-minus, .fas.fa-plus');
    
    if (ageButtons.length >= 2) {
        const ageDecrement = ageButtons[0].parentElement;
        const ageIncrement = ageButtons[1].parentElement;
        
        ageDecrement.addEventListener('click', function() {
            if (bmiValues[0] > bmiConfig.minAge) {
                bmiValues[0]--;
                updateAllDisplays();
                addVisualFeedback('ageDisplay');
            }
        });

        ageIncrement.addEventListener('click', function() {
            if (bmiValues[0] < bmiConfig.maxAge) {
                bmiValues[0]++;
                updateAllDisplays();
                addVisualFeedback('ageDisplay');
            }
        });
    }
}

/**
 * Initialize weight controls functionality
 */
function initializeWeightControls() {
    const weightButtons = document.querySelectorAll('.fas.fa-minus, .fas.fa-plus');
    
    if (weightButtons.length >= 4) {
        const weightDecrement = weightButtons[2].parentElement;
        const weightIncrement = weightButtons[3].parentElement;
        
        weightDecrement.addEventListener('click', function() {
            if (bmiValues[1] > bmiConfig.minWeight) {
                bmiValues[1]--;
                updateAllDisplays();
                addVisualFeedback('weightDisplay');
            }
        });

        weightIncrement.addEventListener('click', function() {
            if (bmiValues[1] < bmiConfig.maxWeight) {
                bmiValues[1]++;
                updateAllDisplays();
                addVisualFeedback('weightDisplay');
            }
        });
    }
}

/**
 * Initialize height controls functionality
 */
function initializeHeightControls() {
    const heightSlider = document.querySelector('input[type="range"]');
    
    if (heightSlider) {
        heightSlider.addEventListener('input', function(e) {
            bmiValues[2] = parseInt(e.target.value);
            updateAllDisplays();
            addVisualFeedback('heightDisplay');
        });
    }
}

/**
 * Initialize gender toggle functionality
 */
function initializeGenderToggle() {
    const genderInput = document.querySelector('input[type="checkbox"]');
    const genderLabels = document.querySelectorAll('span.text-lg');
    
    if (genderInput && genderLabels.length >= 2) {
        let maleLabel = null;
        let femaleLabel = null;
        
        genderLabels.forEach(label => {
            if (label.textContent.includes('Male')) {
                maleLabel = label;
            } else if (label.textContent.includes('Female')) {
                femaleLabel = label;
            }
        });
        
        // Set initial state
        genderInput.checked = !bmiConfig.isMale;
        updateGenderLabels(maleLabel, femaleLabel);
        
        genderInput.addEventListener('change', function() {
            bmiConfig.isMale = !this.checked;
            updateGenderLabels(maleLabel, femaleLabel);
            addGenderAnimation(this, maleLabel, femaleLabel);
        });
    }
}

/**
 * Update gender label styles
 */
function updateGenderLabels(maleLabel, femaleLabel) {
    if (!maleLabel || !femaleLabel) return;
    
    if (bmiConfig.isMale) {
        maleLabel.className = 'text-lg font-bold text-blue-300';
        femaleLabel.className = 'text-lg font-normal';
            } else {
        maleLabel.className = 'text-lg font-normal';
        femaleLabel.className = 'text-lg font-bold text-pink-300';
    }
}

/**
 * Add gender switch animation
 */
function addGenderAnimation(toggleInput, maleLabel, femaleLabel) {
    const toggleContainer = toggleInput.closest('label');
    toggleContainer.classList.add('animate-pulse');
    setTimeout(() => toggleContainer.classList.remove('animate-pulse'), 300);
    
    const activeLabel = bmiConfig.isMale ? maleLabel : femaleLabel;
    if (activeLabel) {
        activeLabel.style.transform = 'scale(1.1)';
        setTimeout(() => {
            activeLabel.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * Update calculate button to show BMI results
 */
function updateCalculateButtonForResults() {
    const calculateButton = document.getElementById('calculateBMIbutton');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalText = this.textContent;
            this.textContent = 'Calculating...';
            this.disabled = true;
            this.classList.add('animate-pulse');
            
            addVisualFeedback('ageDisplay');
            addVisualFeedback('weightDisplay');
            addVisualFeedback('heightDisplay');
            
            setTimeout(() => {
                showBMIResults();
            }, 1000);
        });
    }
}

/**
 * Add visual feedback to elements
 */
function addVisualFeedback(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 200);
    }
}

/**
 * Show BMI results with styled display
 */
function showBMIResults() {
    const heightInMeters = bmiValues[2] / 100;
    const calculatedBMI = (bmiValues[1] / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = '';
    let categoryColor = '';
    
    if (calculatedBMI < 18.5) {
        category = 'Underweight BMI';
        categoryColor = 'text-blue-500';
    } else if (calculatedBMI < 25) {
        category = 'Normal BMI';
        categoryColor = 'text-teal-500';
    } else if (calculatedBMI < 30) {
        category = 'Overweight BMI';
        categoryColor = 'text-yellow-500';
    } else {
        category = 'Obesity BMI';
        categoryColor = 'text-red-500';
    }
    
    bmiConfig.lastCalculatedBMI = calculatedBMI;
    bmiConfig.lastCategory = category;
    
    const appContent = document.getElementById('app-content');
    if (appContent) {
        appContent.innerHTML = `
            <div class="container mx-auto px-6 py-8">
                <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">BODY MASS INDEX</h1>
                
                <section class="max-w-md mx-auto">
                    <div class="bg-transparent border-2 border-teal-500 rounded-xl p-8 text-center">
                        <h3 class="text-xl text-gray-600 mb-6">BMI Results</h3>
                        <h1 class="text-6xl font-bold text-gray-800 mb-4">${calculatedBMI}</h1>
                        <p class="text-xl font-semibold ${categoryColor} mb-6">${category}</p>
                        
                        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700">
                            <div class="grid grid-cols-2 gap-2">
                                <div><strong>Age:</strong> ${bmiValues[0]} years</div>
                                <div><strong>Gender:</strong> ${bmiConfig.isMale ? 'Male' : 'Female'}</div>
                                <div><strong>Weight:</strong> ${bmiValues[1]} kg</div>
                                <div><strong>Height:</strong> ${bmiValues[2]} cm</div>
                            </div>
            </div>
                        
                        <div class="space-y-3">
                            <button id="saveBMIButton" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300">
                                Save the Results
                            </button>
                            <button id="recalculateBMIButton" class="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300">
                                Calculate Again
                            </button>
                            <button id="backToDashboardButton" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300">
                                Back to Dashboard
            </button>
                        </div>
                    </div>
                </section>
        </div>
    `;
        
        // Add event listeners to new buttons
        document.getElementById('saveBMIButton').addEventListener('click', saveBMIResults);
        document.getElementById('recalculateBMIButton').addEventListener('click', resetBMICalculator);
        document.getElementById('backToDashboardButton').addEventListener('click', () => {
            window.location.href = '../dashboard.html';
        });
    }
}

/**
 * Save BMI results to localStorage
 */
function saveBMIResults() {
    const resultData = {
        bmi: bmiConfig.lastCalculatedBMI,
        category: bmiConfig.lastCategory,
        age: bmiValues[0],
        weight: bmiValues[1],
        height: bmiValues[2],
        gender: bmiConfig.isMale ? 'Male' : 'Female',
        timestamp: new Date().toISOString()
    };
    
    const STORAGE_KEY = 'bmi_results_history';
    const existingResults = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existingResults.push(resultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingResults));
    
    const saveButton = document.getElementById('saveBMIButton');
    if (saveButton) {
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Saved!';
        saveButton.classList.remove('bg-teal-600', 'hover:bg-teal-700');
        saveButton.classList.add('bg-green-600', 'hover:bg-green-700');
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.classList.remove('bg-green-600', 'hover:bg-green-700');
            saveButton.classList.add('bg-teal-600', 'hover:bg-teal-700');
        }, 2000);
    }
}

/**
 * Reset BMI calculator to initial state
 */
function resetBMICalculator() {
    location.reload();
}