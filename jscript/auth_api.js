import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovizwwfnkdckcislqupr.supabase.co';
const supabaseKey = ''; // Your anon public key
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpUser(email, password) {
  const { data, error } = await supabase
    .from('MedScan Authentication')
    .insert([{ Email: email, Password: password }]);

  if (error) {
    console.error('Error signing up:', error);
    return { data, error };
  }

  console.log('User signed up successfully:', data);
  return { data, error };
}

async function loginUser(email, password) {
  try {
    // Query the database to find a user with matching email and password
    const { data, error } = await supabase
      .from('MedScan Authentication')
      .select('*')
      .eq('Email', email)
      .eq('Password', password)
      .single();

    if (error) {
      console.error('Error logging in:', error);
      return { data: null, error };
    }

    if (!data) {
      return { 
        data: null, 
        error: { message: 'Invalid email or password' } 
      };
    }

    console.log('User logged in successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error during login:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred' } 
    };
  }
}

export { supabase, signUpUser, loginUser };