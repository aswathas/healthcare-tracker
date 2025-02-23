const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '../.env.local');

console.log('Checking environment files:');
console.log('- .env path:', envPath);
console.log('- .env.local path:', envLocalPath);
console.log('- .env exists:', fs.existsSync(envPath));
console.log('- .env.local exists:', fs.existsSync(envLocalPath));

if (fs.existsSync(envLocalPath)) {
  console.log('\nLoading .env.local...');
  dotenv.config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  console.log('\nLoading .env...');
  dotenv.config({ path: envPath });
}

console.log('\nEnvironment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'exists' : 'missing');
