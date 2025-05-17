/**
 * Show loading animation and redirect to dashboard
 * @param {Array} selections - (Optional) User selections to log (for debugging)
 */
export function showLoadingAnimation(selections) {
    console.log('Showing loading animation after final question');

    // Log all user selections for the assessment if provided
    if (selections) {
        console.log('All user selections:', selections);
    }

    // Get the app content container
    const appContent = document.getElementById('app-content');
    const appWrapper = document.querySelector('.app-wrapper');

    if (appWrapper && appContent) {
        // Clear the app content while preserving the app-wrapper
        appContent.innerHTML = '';

        // Create loading dots animation - centered and larger with accessibility attributes
        const loadingElement = document.createElement('div');
        loadingElement.className = 'flex flex-col items-center justify-center h-screen';
        loadingElement.setAttribute('role', 'alert');
        loadingElement.setAttribute('aria-live', 'assertive');

        loadingElement.innerHTML = `
            <div class="flex space-x-6">
                <div class="w-8 h-8 bg-teal rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-8 h-8 bg-teal rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-8 h-8 bg-teal rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                <div class="w-8 h-8 bg-teal rounded-full animate-bounce" style="animation-delay: 0.6s"></div>
            </div>
        `;

        // Append the loading animation to app-content
        appContent.appendChild(loadingElement);

        // Loading animation will show for a few seconds before medicine recommendation appears
        console.log('Assessment completed, preparing to show medicine recommendation...');
    }
}