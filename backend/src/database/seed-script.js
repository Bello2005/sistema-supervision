require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Hash password for demo users
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔐 Generated password hash for demo users');
    console.log('📝 Demo credentials: email@supervision.com / password123\n');

    // Read seed file
    const seedPath = path.join(__dirname, 'seed.sql');
    let seedSQL = fs.readFileSync(seedPath, 'utf8');

    // Replace placeholder with actual hashed password
    seedSQL = seedSQL.replace(/\$2b\$10\$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7/g, hashedPassword);

    // Execute seeds
    console.log('📝 Inserting seed data...');
    await pool.query(seedSQL);
    console.log('✅ Seed data inserted successfully\n');

    console.log('✅ Seeding completed successfully!');
    console.log('\n📊 Demo users created:');
    console.log('  - admin@supervision.com (Admin)');
    console.log('  - supervisor@supervision.com (Supervisor)');
    console.log('  - carlos.rodriguez@supervision.com (Instructor)');
    console.log('  - viewer@supervision.com (Viewer)');
    console.log('\n🔑 Password for all: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runSeeds();
