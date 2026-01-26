import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createBucket() {
  try {
    console.log('Creating storage bucket "products"...');
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('products', {
      public: true,
      allowedMimeTypes: ['image/*'],
    });

    if (error) {
      // Check if bucket already exists
      if (error.message.includes('already exists')) {
        console.log('✓ Bucket "products" already exists');
        return;
      }
      throw error;
    }

    console.log('✓ Storage bucket "products" created successfully');
  } catch (err) {
    console.error('Error creating bucket:', err.message);
    process.exit(1);
  }
}

createBucket();
