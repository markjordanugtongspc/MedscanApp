/**
* Display medicine recommendation based on user's symptoms and duration
* @param {string} medicineName - Optional medicine name to display (defaults to Paracetamol Syrup)
* @param {string} notificationText - Optional notification text (defaults to standard message)
*/
function showMedicineRecommendation(medicineName = 'Paracetamol Syrup', notificationText = 'This will show in notification') {
    console.log('Showing medicine recommendation');
    // Get the app content container
    const appContent = document.getElementById('app-content');
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper && appContent) {
        // Clear the app content
        appContent.innerHTML = '';

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

        // Recreate the rest of your content
        const assessmentSection = document.createElement('section');
        assessmentSection.className = 'app-wrapper';
        assessmentSection.innerHTML = `
            <section class="flex items-center justify-center px-5 sm:px-10 md:px-21 mt-5">
                <div class="text-center">
                    <!-- Start of Header -->
                    <h1 class="text-black text-3xl font-bold leading-tight">
                        Recommend
                        <br class="hidden sm:block">
                        Medicine
                    </h1>
                    <!-- End of Header -->
                    <!-- Start of Medicine Recommendation Section -->
                    <section class="mt-8">
                        <div class="border-2 border-[#243e36] bg-transparent p-6 rounded-lg mb-6">
                            <h2 class="text-xl font-semibold mb-2">${medicineName}</h2>
                        </div>
                        <p class="notification-text mb-6">${notificationText}</p>
                        <button id="proceed-button" class="bg-[#243e36] text-white py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all">
                            Proceed
                        </button>
                    </section>
                    <!-- End of Medicine Recommendation Section -->
                </div>
            </section>
        `;
        // Append the assessment section
        appContent.appendChild(assessmentSection);

        // Add event listener to the 'Proceed' button
        const proceedButton = document.getElementById('proceed-button');
        if (proceedButton) {
            proceedButton.addEventListener('click', function() {
                // Navigate back to dashboard
                window.location.href = '../dashboard.html';
            });
        }

        // Add event listener to the back button
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                goBackToQ2();
            });
        }

        // Apply theme and update notification text color
        const savedTheme = localStorage.getItem("darkTheme");
        const isDarkTheme = savedTheme === "true";
        const notificationTextElement = document.querySelector('.notification-text');
        if (isDarkTheme) {
            document.body.classList.add("dark-theme");
            if (notificationTextElement) {
                notificationTextElement.style.color = '#ffffff'; // White text for dark mode
            }
        } else {
            if (notificationTextElement) {
                notificationTextElement.style.color = '#000000'; // Black text for light mode
            }
        }
    }
}