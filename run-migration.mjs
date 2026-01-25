import axios from 'axios';

const projectId = 'uchykjqrfqebzckybaqr';
const publishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjaHlranFyZnFlYnpja3liYXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTcwMDUsImV4cCI6MjA4MzY3MzAwNX0.b2SNYqeVEC1LUHJTl-7HdPQisl66VW9tm5z4YiZJdYc';

const sql = `
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS original_price numeric(12,2) NULL,
ADD COLUMN IF NOT EXISTS discount numeric(5,2) DEFAULT 0 NOT NULL;
`;

async function runMigration() {
  try {
    const response = await axios.post(
      `https://${projectId}.supabase.co/rest/v1/rpc/sql`,
      { sql },
      {
        headers: {
          'Authorization': `Bearer ${publishableKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Migration executed:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

runMigration();
