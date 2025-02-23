import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://lmsjwjbgqwyxkvbsjzwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtc2p3amJncXd5eGt2YnNqendvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0NDMxOCwiZXhwIjoyMDU1NTIwMzE4fQ.sf2dqmz2VKJrE5vvSjeAHyCaht3quFqIUjLHpmycgWg';

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
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'tx=commit'
        },
        body: JSON.stringify({
          type: 'sql',
          query: statement
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to execute SQL: ${error}`);
      }

      const result = await response.json();
      console.log('Statement executed successfully');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
