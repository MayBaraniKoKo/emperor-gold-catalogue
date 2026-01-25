import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uchykjqrfqebzckybaqr.supabase.co';
const publishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjaHlranFyZnFlYnpja3liYXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTcwMDUsImV4cCI6MjA4MzY3MzAwNX0.b2SNYqeVEC1LUHJTl-7HdPQisl66VW9tm5z4YiZJdYc';

const supabase = createClient(supabaseUrl, publishableKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log('Successfully connected to products table');
    console.log('Data:', data);
  }
}

checkSchema();
