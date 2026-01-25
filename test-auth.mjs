import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khqrubyyndipqjyerrqg.supabase.co';
const publishableKey = 'sb_publishable_zp2vKaaRisC45aZqvdIlRw_NnWdIz7r';

const supabase = createClient(supabaseUrl, publishableKey);

async function testSignUp() {
  console.log('Testing signup...');
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@united42.com',
    password: 'Password123!'
  });
  
  if (error) {
    console.log('Signup error:', error.message);
  } else {
    console.log('Signup successful!');
    console.log('User created:', data.user?.email);
  }
}

testSignUp().catch(e => console.error('Exception:', e.message));
