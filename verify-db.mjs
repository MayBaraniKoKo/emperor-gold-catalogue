import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khqrubyyndipqjyerrqg.supabase.co';
const publishableKey = 'sb_publishable_zp2vKaaRisC45aZqvdIlRw_NnWdIz7r';

const supabase = createClient(supabaseUrl, publishableKey);

async function verifyDatabase() {
  console.log('\n🔍 Verifying Supabase Database Setup...\n');
  
  try {
    // Check each table
    const tables = ['categories', 'subcategories', 'products', 'orders', 'vouchers'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          results[table] = '❌ NOT FOUND';
        } else {
          results[table] = '✓ EXISTS';
        }
      } catch (e) {
        results[table] = '❌ ERROR';
      }
    }
    
    // Check for discount columns in products
    let hasDiscount = false;
    try {
      const { data } = await supabase.from('products').select('*').limit(1);
      if (data && data.length > 0) {
        const cols = Object.keys(data[0]);
        hasDiscount = cols.includes('discount') && cols.includes('original_price');
      }
    } catch (e) {
      // products table might be empty
    }
    
    // Display results
    console.log('📊 Database Status:\n');
    for (const [table, status] of Object.entries(results)) {
      console.log(`  ${table.padEnd(15)} ${status}`);
    }
    
    console.log(`\n💰 Discount Fields: ${hasDiscount ? '✓ YES' : '✗ NO'}`);
    
    if (Object.values(results).every(r => r === '✓ EXISTS')) {
      console.log('\n✅ ALL TABLES CREATED SUCCESSFULLY!\n');
      console.log('Your Supabase database is ready for production on GoDaddy.\n');
      return true;
    } else {
      console.log('\n⚠️  Some tables are missing. Please run the APPLY_ALL_MIGRATIONS.sql script.\n');
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying database:', error.message);
    return false;
  }
}

verifyDatabase();
