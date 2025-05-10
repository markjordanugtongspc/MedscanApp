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
    // Make sure we have a timestamp for when this profile was created
    profileData.updated_at = new Date().toISOString();
    
    // Check if the user already has a profile
    const { data: existingProfile, error: checkError } = await profile
      .from('MedScan Authentication')
      .select('Email')
      .eq('Email', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the error code for 'no rows found'
      console.error('Error checking for existing profile:', checkError);
      return { data: null, error: checkError };
    }
    
    // Create the update object with all the profile fields
    const updateData = {
      full_name: profileData.full_name,
      full_address: profileData.full_address,
      age: profileData.age,
      sex: profileData.sex,
      height: profileData.height,
      weight: profileData.weight,
      updated_at: profileData.updated_at
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
  
  // Get the user email from localStorage or sessionStorage (or from registration flow)
  let userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
  // If not found, try to get from a temporary registration storage (set after signup)
  if (!userEmail && window.tempRegisteredEmail) {
    userEmail = window.tempRegisteredEmail;
  }
  // If still not found, show error and redirect
  if (!userEmail) {
    console.error('No user email found. User must be logged in or coming from registration.');
    window.location.href = 'login.html';
    return;
  }
  
  const userId = userEmail; // Using email as the identifier
  
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
    age: parseInt(age),
    sex,
    height: parseInt(height),
    weight: parseInt(weight)
  };
  
  // Debug insertion before saving
  debugSupabaseInsertion({
    email: userId,
    full_name: fullName,
    full_address: fullAddress,
    age: parseInt(age),
    sex,
    height: parseInt(height),
    weight: parseInt(weight)
  });
  
  // Save profile data
  saveUserProfile(userId, profileData)
    .then(({ data, error }) => {
      if (error) {
        alert('Error saving profile information. Please try again.');
        console.error('Profile save error:', error);
      } else {
        // Redirect to login page after profile save
        window.location.href = 'login.html';
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