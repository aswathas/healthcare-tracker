const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from both .env and .env.local
const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseServiceKey
  });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    const migrationFile = path.join(__dirname, '../supabase/migrations/20250223163800_init.sql');
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');

    console.log('Running migration...');
    
    // Split the migration into separate statements
    const statements = migrationSql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (!statement.trim()) continue;
      
      console.log('Executing statement:', statement.slice(0, 50) + '...');
      const { error } = await supabase.rpc('exec_sql', {
        query: statement
      });

      if (error) {
        console.error('Error executing statement:', error);
        throw error;
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
