const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    // Read the migration SQL
    const sql = fs.readFileSync('./supabase/migrations/20260122_add_discount_to_products.sql', 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec', { sql });
    
    if (error) throw error;
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

applyMigration();
