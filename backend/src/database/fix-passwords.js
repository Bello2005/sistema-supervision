require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcrypt');

async function fixPasswords() {
  try {
    console.log('🔐 Fixing user passwords...\n');

    // Generate correct hash for password123
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 10);
    
    console.log('✅ Generated correct password hash');
    console.log(`Hash: ${hashedPassword}\n`);

    // Get all users
    const usersResult = await pool.query('SELECT id, email, role FROM users');
    const users = usersResult.rows;

    console.log(`📝 Found ${users.length} users to update\n`);

    // Update each user's password
    for (const user of users) {
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, user.id]
      );
      console.log(`✅ Updated password for ${user.email} (${user.role})`);
    }

    // Verify by testing the password
    console.log('\n🔍 Verifying password hash...');
    const testUser = await pool.query('SELECT password FROM users WHERE email = $1', ['admin@supervision.com']);
    if (testUser.rows[0]) {
      const isValid = await bcrypt.compare(correctPassword, testUser.rows[0].password);
      if (isValid) {
        console.log('✅ Password verification successful!\n');
      } else {
        console.log('❌ Password verification failed!\n');
      }
    }

    console.log('✅ All passwords fixed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('  Email: admin@supervision.com');
    console.log('  Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing passwords:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixPasswords();

