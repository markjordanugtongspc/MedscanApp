import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovizwwfnkdckcislqupr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aXp3d2Zua2Rja2Npc2xxdXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3ODYwNzEsImV4cCI6MjA2MjM2MjA3MX0.6HDljFFGIW-K_DR_ZwEZj6jZbL8jpKxOxOM1whpqrK0'; // Your anon public key
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

export { supabase, signUpUser };