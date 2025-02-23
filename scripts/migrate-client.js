import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://lmsjwjbgqwyxkvbsjzwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtc2p3amJncXd5eGt2YnNqendvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0NDMxOCwiZXhwIjoyMDU1NTIwMzE4fQ.sf2dqmz2VKJrE5vvSjeAHyCaht3quFqIUjLHpmycgWg';

const supabase = createClient(supabaseUrl, supabaseKey, {
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
      
      const { data, error } = await supabase.auth.admin.executeRaw(statement);

      if (error) {
        console.error('Error executing statement:', error);
        throw error;
      }

      console.log('Statement executed successfully');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
