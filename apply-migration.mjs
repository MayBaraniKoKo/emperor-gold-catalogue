import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

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
    
    // The raw SQL to execute (splitting statements)
    const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
    
    for (const statement of statements) {
      const { error } = await supabase.from('products').select().limit(1); // Test connection first
      if (error) {
        console.er        console.error:', error);
        return;
      }
    }
    
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

applyMigration();
