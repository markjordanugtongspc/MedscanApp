/**
* Display kiosk notification view for medicine recommendation
* @param {string} medicineName - Optional medicine name to include in notification
*/
function showMedicineRecommendation(medicineName = 'Paracetamol Syrup') {
    console.log('Showing kiosk notification view');
    // Get the app content container
    const appContent = document.getElementById('app-content');
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper && appContent) {
        // Clear the app content
        appContent.innerHTML = '';

        // Check if dark theme is enabled
        const savedTheme = localStorage.getItem("darkTheme");
        const isDarkTheme = savedTheme === "true";
        
        // Apply theme class to body
        if (isDarkTheme) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }

        // --- Inject your static header section ---
        const staticHeader = document.createElement('section');
        staticHeader.innerHTML = `
        <header class="bg-teal h-24 w-full shadow-md relative">
          <div class="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <h1 class="text-2xl font-bold">Assessment</h1>
          </div>
        </header>
        <div class="bg-[#243e36] h-1 w-full my-4"></div>
        `;
        // Append static header at the top
        appContent.appendChild(staticHeader);

        // Create the kiosk notification view with dark mode support
        const notificationSection = document.createElement('section');
        notificationSection.className = 'app-wrapper px-6 py-8 flex flex-col items-center';
        notificationSection.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full text-center transition-colors duration-300">
                <!-- Kiosk Message -->
                <p class="text-xl font-medium mb-6 text-gray-900 dark:text-white">
                    You need to open to our <span class="text-teal-500">MedScan Kiosk</span> to view the result.
                </p>
                
                <!-- Save Work Question -->
                <p class="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Are sure you want to save your work?
                </p>
                
                <!-- Action Buttons -->
                <div class="flex justify-center space-x-6 mb-6">
                    <div id="save-yes" class="size-12 bg-green-700 text-white rounded-md flex items-center justify-center cursor-pointer hover:bg-green-800 transition-colors">
                        <i class="fas fa-check text-xl"></i>
                    </div>
                    
                    <div id="save-no" class="size-12 bg-red-700 text-white rounded-md flex items-center justify-center cursor-pointer hover:bg-red-800 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </div>
                </div>
                
                <!-- Instruction Text -->
                <p class="text-sm text-gray-600 dark:text-gray-300">
                    Click the <i class="fas fa-check text-green-700"></i> button will show in notification on kiosk when you open it nearby.
                </p>
            </div>
        `;
        
        // Append the notification section
        appContent.appendChild(notificationSection);

        // Apply dark theme to the main background if needed
        if (isDarkTheme) {
            // Add dark background to the page container
            const pageContainer = document.querySelector('.app-wrapper');
            if (pageContainer) {
                pageContainer.classList.add('bg-gray-900');
            }
            
            // Add dark theme styles via JavaScript for elements that can't be targeted with Tailwind
            const style = document.createElement('style');
            style.textContent = `
                .dark-theme {
                    background-color: #1a202c;
                    color: #f7fafc;
                }
                .dark-theme .app-wrapper {
                    background-color: #1a202c;
                }
            `;
            document.head.appendChild(style);
        }

        // Add event listeners to the action buttons
        const saveYesBtn = document.getElementById('save-yes');
        const saveNoBtn = document.getElementById('save-no');
        
        if (saveYesBtn) {
            saveYesBtn.addEventListener('click', function() {
                // Save work and show confirmation
                saveWorkToKiosk(medicineName);
            });
        }
        
        if (saveNoBtn) {
            saveNoBtn.addEventListener('click', function() {
                // Cancel and go back to dashboard
                window.location.href = '../dashboard.html';
            });
        }
    }
}

/**
 * Save work to kiosk and show confirmation
 * @param {string} medicineName - Medicine name to save
 */
function saveWorkToKiosk(medicineName) {
    // Save the medicine recommendation to local storage for kiosk retrieval
    try {
        const kioskData = {
            medicine: medicineName,
            timestamp: new Date().toISOString(),
            saved: true
        };
        
        localStorage.setItem('kioskNotification', JSON.stringify(kioskData));
        
        // Show success message
        showSaveConfirmation();
    } catch (error) {
        console.error('Error saving to kiosk:', error);
    }
}

/**
 * Show save confirmation message
 */
function showSaveConfirmation() {
    // Get theme for proper styling
    const isDarkTheme = localStorage.getItem("darkTheme") === "true";
    
    // Create and display a confirmation message
    const confirmationElement = document.createElement('div');
    confirmationElement.className = 'fixed top-4 inset-x-4 bg-green-500 text-white py-3 px-4 rounded-lg shadow-lg text-center transform transition-all duration-300 -translate-y-full';
    confirmationElement.textContent = '✓ Saved successfully! Check the kiosk nearby.';
    
    document.body.appendChild(confirmationElement);
    
    // Animate in
    setTimeout(() => {
        confirmationElement.classList.remove('-translate-y-full');
        confirmationElement.classList.add('translate-y-0');
    }, 10);
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = '../dashboard.html';
    }, 2500);
}