// Start of Toggle Theme
document.addEventListener('DOMContentLoaded', () => {
    console.log('Alert page loaded, initializing components');

    const savedTheme = localStorage.getItem("darkTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme !== null ? savedTheme === "true" : prefersDark;
    applyTheme(isDark);

    initializeDiagnosisDisplay();
});

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
}
// End of Toggle Theme

// ----------------------------------------------------
// Alert Functions - Dynamic Diagnosis Display
// ----------------------------------------------------

function initializeDiagnosisDisplay() {
    const diagnosisList = document.getElementById('diagnosisList');
    if (!diagnosisList) {
        console.error('Diagnosis list container not found');
        return;
    }

    diagnosisList.innerHTML = '';
    displayPulseRate();
}

function displayPulseRate() {
    const diagnosisList = document.getElementById('diagnosisList');

    const pulseElement = createDiagnosisCard('Pulse Rate: <span class="font-normal">98 bpm</span>');
    diagnosisList.appendChild(pulseElement);

    setTimeout(() => {
        displayMeasuringOxygen();
    }, 1000);
}

function displayMeasuringOxygen() {
    const diagnosisList = document.getElementById('diagnosisList');

    const measuringElement = createLoadingCard('Measuring...');
    diagnosisList.appendChild(measuringElement);

    setTimeout(() => {
        diagnosisList.removeChild(measuringElement);
        displayOxygenLevel();
    }, 3000);
}

function displayOxygenLevel() {
    const diagnosisList = document.getElementById('diagnosisList');

    const oxygenElement = createDiagnosisCard('Oxygen Level: <span class="font-normal">96%</span>');
    diagnosisList.appendChild(oxygenElement);

    setTimeout(() => {
        displayAnalyzing();
    }, 1000);
}

function displayAnalyzing() {
    const diagnosisList = document.getElementById('diagnosisList');

    const analyzingElement = createLoadingCard('Analyzing...');
    diagnosisList.appendChild(analyzingElement);

    setTimeout(() => {
        diagnosisList.removeChild(analyzingElement);
        displayActionButtons();
    }, 2000);
}

function displayActionButtons() {
    const diagnosisList = document.getElementById('diagnosisList');

    const analysisButton = createActionButton('View AI Analysis', 'analysis');
    diagnosisList.appendChild(analysisButton);

    const saveButton = createActionButton('SAVE', 'save');
    diagnosisList.appendChild(saveButton);
}

function createDiagnosisCard(content) {
    const card = document.createElement('div');
    card.className = 'bg-teal-100 text-[#243e36] px-6 py-2 rounded-lg font-medium text-center w-full col-span-2 mb-2';
    card.innerHTML = content;
    return card;
}

function createLoadingCard(text) {
    const card = document.createElement('div');
    card.className = 'bg-teal-100 text-[#243e36] px-6 py-2 rounded-lg font-medium flex items-center justify-center w-full col-span-2 mb-2';
    card.innerHTML = `
        <img src="https://media.tenor.com/WX_LDjYUrMsAAAAi/loading.gif" 
             alt="Loading" 
             class="w-6 h-6 mr-2">
        <span>${text}</span>
    `;
    return card;
}

function createActionButton(text, type) {
    const button = document.createElement('button');

    if (type === 'save') {
        button.className = 'bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200 w-32 mb-2 block mx-auto';
    } else {
        button.className = 'bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200 col-span-2 mb-2 w-full';
    }

    button.textContent = text;

    button.addEventListener('click', () => {
        handleButtonClick(type);
    });

    return button;
}

function handleButtonClick(type) {
    switch(type) {
        case 'analysis':
            console.log('View AI Analysis clicked');
            showAIAnalysis();
            break;
        case 'save':
            console.log('Save clicked');
            window.location.href = '../../pages/dashboard.html';
            break;
        default:
            console.log('Unknown button type:', type);
    }
}

function showAIAnalysis() {
    const diagnosisList = document.getElementById('diagnosisList');
    if (!diagnosisList) {
        console.error('Diagnosis list container not found');
        return;
    }

    diagnosisList.innerHTML = '';

    const analysisContainer = document.createElement('div');
    analysisContainer.className = 'col-span-2 w-full';

    analysisContainer.innerHTML = `
        <h1 class="text-[#243e36] text-lg font-bold mb-2">AI Analysis Summary:</h1>
        <ul class="text-[#243e36] space-y-1 list-disc list-inside">
            <li>Pulse Rate: 98bpm (<span class="text-teal-600">Normal</span>)</li>
            <li>Oxygen Level: 96% (<span class="text-teal-600">Normal</span>)</li>
            <li>Suggestion: Possible viral infection. Monitor every 3hrs.</li>
        </ul>
    `;

    diagnosisList.appendChild(analysisContainer);

    setTimeout(() => {
        displaySaveButton();
    }, 500);
}

function displaySaveButton() {
    const diagnosisList = document.getElementById('diagnosisList');

    const saveButton = createActionButton('SAVE', 'save');
    diagnosisList.appendChild(saveButton);
}

function saveResults() {
    alert('Results saved successfully!');
}

function resetDiagnosisDisplay() {
    const diagnosisList = document.getElementById('diagnosisList');
    if (diagnosisList) {
        diagnosisList.innerHTML = '';
        initializeDiagnosisDisplay();
    }
}

window.AlertFunctions = {
    initializeDiagnosisDisplay,
    resetDiagnosisDisplay,
    showAIAnalysis,
    saveResults
};
