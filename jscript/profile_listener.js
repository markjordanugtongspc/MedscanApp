/* ====================
 * START: Profile Management 
 * This module handles user profile information storage and updates
 * ==================== */

import { supabase as profile } from './auth_api.js';

/**
 * Debug function to check Supabase connection and configuration
 * @returns {Promise<void>}
 */
async function debugSupabaseConnection() {
  try {
    console.log('🔍 Debugging Supabase Connection');
    console.log('----------------------------');
    
    // Check Supabase client configuration
    console.log('Supabase Client Configuration:');
    console.log('URL:', profile.supabaseUrl);
    console.log('Key Present:', !!profile.supabaseKey);
    
    // Test connection by attempting to fetch a table
    const { data, error } = await profile
      .from('MedScan Authentication')
      .select('Email', { count: 'exact' });
    
    if (error) {
      console.error('❌ Supabase Connection Error:', error);
    } else {
      console.log('✅ Successfully connected to Supabase');
      console.log('Total Records in MedScan Authentication:', data.length);
    }
  } catch (err) {
    console.error('❌ Unexpected Supabase Connection Error:', err);
  }
}

/**
 * Debug function to test individual insert operations
 * @param {Object} testData - Test data to insert
 * @returns {Promise<void>}
 */
async function debugSupabaseInsertion(testData) {
  try {
    console.log('🧪 Testing Supabase Insertion');
    console.log('----------------------------');
    
    // Test inserting full_name
    const { data: nameData, error: nameError } = await profile
      .from('MedScan Authentication')
      .update({ full_name: testData.full_name })
      .eq('Email', testData.email);
    
    console.log('Full Name Insertion:', nameError ? '❌ Failed' : '✅ Succeeded');
    if (nameError) console.error('Full Name Error:', nameError);
    
    // Test inserting full_address
    const { data: addressData, error: addressError } = await profile
      .from('MedScan Authentication')
      .update({ full_address: testData.full_address })
      .eq('Email', testData.email);
    
    console.log('Full Address Insertion:', addressError ? '❌ Failed' : '✅ Succeeded');
    if (addressError) console.error('Full Address Error:', addressError);
    
    // Test inserting age
    const { data: ageData, error: ageError } = await profile
      .from('MedScan Authentication')
      .update({ age: testData.age })
      .eq('Email', testData.email);
    
    console.log('Age Insertion:', ageError ? '❌ Failed' : '✅ Succeeded');
    if (ageError) console.error('Age Error:', ageError);
    
    // Test inserting sex
    const { data: sexData, error: sexError } = await profile
      .from('MedScan Authentication')
      .update({ sex: testData.sex })
      .eq('Email', testData.email);
    
    console.log('Sex Insertion:', sexError ? '❌ Failed' : '✅ Succeeded');
    if (sexError) console.error('Sex Error:', sexError);
    
    // Test inserting height
    const { data: heightData, error: heightError } = await profile
      .from('MedScan Authentication')
      .update({ height: testData.height })
      .eq('Email', testData.email);
    
    console.log('Height Insertion:', heightError ? '❌ Failed' : '✅ Succeeded');
    if (heightError) console.error('Height Error:', heightError);
    
    // Test inserting weight
    const { data: weightData, error: weightError } = await profile
      .from('MedScan Authentication')
      .update({ weight: testData.weight })
      .eq('Email', testData.email);
    
    console.log('Weight Insertion:', weightError ? '❌ Failed' : '✅ Succeeded');
    if (weightError) console.error('Weight Error:', weightError);
  } catch (err) {
    console.error('❌ Unexpected Insertion Error:', err);
  }
}

/**
 * Save user profile information to the database
 * @param {string} userId - The ID of the user
 * @param {Object} profileData - Object containing profile information
 * @returns {Promise<Object>} - The data and error from the operation
 */
async function saveUserProfile(userId, profileData) {
  try {
    console.log('Saving profile for user:', userId);
    
    // Check if the user exists in the database
    const { data: existingProfile, error: checkError } = await profile
      .from('MedScan Authentication')
      .select('Email')
      .eq('Email', userId)
      .single();
    
    if (checkError) {
      // If user doesn't exist, we need to handle this case
      if (checkError.code === 'PGRST116') { // 'no rows found'
        console.warn('User not found in database. This may be a new registration without completed auth flow.');
        
        // We can try to create a new record instead
        const { data: insertData, error: insertError } = await profile
          .from('MedScan Authentication')
          .insert([{
            Email: userId,
            ...profileData,
            created_at: new Date().toISOString()
          }]);
        
        if (insertError) {
          console.error('Error creating new user profile:', insertError);
          return { data: null, error: insertError };
        }
        
        console.log('Created new user profile:', insertData);
        return { data: insertData, error: null };
      } else {
        // Some other error occurred
        console.error('Error checking for existing profile:', checkError);
        return { data: null, error: checkError };
      }
    }
    
    // User exists, proceed with update
    console.log('User found, updating profile for:', existingProfile.Email);
    
    // Create the update object with all the profile fields
    const updateData = {
      full_name: profileData.full_name,
      full_address: profileData.full_address,
      age: profileData.age,
      sex: profileData.sex,
      height: profileData.height,
      weight: profileData.weight,
      updated_at: profileData.updated_at || new Date().toISOString()
    };
    
    // Update the user record with profile information
    const result = await profile
      .from('MedScan Authentication')
      .update(updateData)
      .eq('Email', userId);
    
    const { data, error } = result;
    
    if (error) {
      console.error('Error saving profile:', error);
      return { data: null, error };
    }
    
    console.log('Profile saved successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error saving profile:', err);
    return { data: null, error: err };
  }
}

/**
 * Handle the profile form submission
 * @param {Event} event - The form submission event
 */
function handleProfileFormSubmit(event) {
  event.preventDefault();
  
  // Perform Supabase connection debug before submission
  debugSupabaseConnection();
  
  // Check for user identification in multiple places
  // 1. First try session storage (most immediate)
  let userEmail = sessionStorage.getItem('userEmail');
  
  // 2. If not found, check for temporary registration session in localStorage
  if (!userEmail) {
    try {
      const tempSession = JSON.parse(localStorage.getItem('tempRegistrationSession'));
      if (tempSession && tempSession.email) {
        userEmail = tempSession.email;
        console.log('Found user from temporary registration session:', userEmail);
      }
    } catch (e) {
      console.error('Error parsing temporary session:', e);
    }
  }
  
  // 3. Check global variable (set during signup flow)
  if (!userEmail && window.tempRegisteredEmail) {
    userEmail = window.tempRegisteredEmail;
    console.log('Found user from global variable:', userEmail);
  }
  
  // 4. Check regular auth session (for users who logged in)
  if (!userEmail) {
    try {
      const authSession = JSON.parse(localStorage.getItem('authSession'));
      if (authSession && authSession.email) {
        userEmail = authSession.email;
        console.log('Found user from auth session:', userEmail);
      }
    } catch (e) {
      console.error('Error parsing auth session:', e);
    }
  }
  
  // If still not found, show error and redirect
  if (!userEmail) {
    console.error('No user email found. User must be logged in or coming from registration.');
    alert('Session expired or not found. Please log in again.');
    window.location.href = 'login.html';
    return;
  }
  
  const userId = userEmail; // Using email as the identifier
  console.log('Proceeding with user ID (email):', userId);
  
  // Get form data
  const fullName = document.getElementById('fullName').value;
  const fullAddress = document.getElementById('address').value;
  const age = document.getElementById('age').value;
  
  // Get selected sex
  const sexRadios = document.getElementsByName('sex');
  let sex = null;
  for (const radio of sexRadios) {
    if (radio.checked) {
      sex = radio.value;
      break;
    }
  }
    
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  
  // Create profile data object
  const profileData = {
    full_name: fullName,
    full_address: fullAddress,
    age: parseInt(age) || 0,
    sex: sex || 'not specified',
    height: parseInt(height) || 0,
    weight: parseInt(weight) || 0,
    updated_at: new Date().toISOString()
  };
  
  console.log('Saving profile data for user:', userId, profileData);
  
  // Debug insertion before saving
  debugSupabaseInsertion({
    email: userId,
    full_name: fullName,
    full_address: fullAddress,
    age: parseInt(age) || 0,
    sex: sex || 'not specified',
    height: parseInt(height) || 0,
    weight: parseInt(weight) || 0
  });
  
  // Save profile data
  saveUserProfile(userId, profileData)
    .then(({ data, error }) => {
      if (error) {
        alert('Error saving profile information. Please try again.');
        console.error('Profile save error:', error);
      } else {
        // Create a proper auth session now that profile is complete
        const fullUserData = {
          Email: userId,
          ...profileData
        };
        
        // Store in auth session for future use
        const authSession = {
          user: fullUserData,
          email: userId,
          timestamp: new Date().getTime(),
          isTemporary: false
        };
        
        localStorage.setItem('authSession', JSON.stringify(authSession));
        
        // Clean up temporary session data
        localStorage.removeItem('tempRegistrationSession');
        sessionStorage.removeItem('userEmail');
        if (window.tempRegisteredEmail) {
          delete window.tempRegisteredEmail;
        }
        
        // Show the success modal instead of alert
        const successModal = document.getElementById('profile-success-modal');
        if (successModal) {
          // Display the modal
          successModal.style.display = 'block';
          // Trigger the slide-up animation after a small delay
          setTimeout(() => {
            successModal.classList.remove('translate-y-full');
          }, 10);
          
          // Get progress bar elements
          const progressBar = document.getElementById('progress-bar');
          const progressPercentage = document.getElementById('progress-percentage');
          
          if (progressBar && progressPercentage) {
            // Set up automatic progress bar animation and redirection
            let progress = 0;
            const totalDuration = 3000; // 3 seconds
            const interval = 30; // Update every 30ms
            const increment = (interval / totalDuration) * 100;
            
            const progressInterval = setInterval(() => {
              progress += increment;
              const roundedProgress = Math.min(Math.round(progress), 100);
              
              // Update progress bar width and text
              progressBar.style.width = `${roundedProgress}%`;
              progressPercentage.textContent = `${roundedProgress}%`;
              
              // When progress reaches 100%, redirect to login page
              if (roundedProgress >= 100) {
                clearInterval(progressInterval);
                
                // Slide down animation before redirecting
                successModal.classList.add('translate-y-full');
                setTimeout(() => {
                  window.location.href = 'login.html';
                }, 300); // Wait for animation to complete
              }
            }, interval);
          }
        } else {
          // Fallback to alert if modal not found
          alert('Profile information saved successfully!');
          window.location.href = 'login.html';
        }
      }
    });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.querySelector('form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileFormSubmit);
  }
});

// Export the functions for use in other modules
export { 
  saveUserProfile, 
  handleProfileFormSubmit, 
  profile, 
  debugSupabaseConnection, 
  debugSupabaseInsertion 
};

/* ====================
 * END: Profile Management
 * ==================== */