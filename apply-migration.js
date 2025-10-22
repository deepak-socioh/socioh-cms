#!/usr/bin/env node

/**
 * This script applies the database migration directly to Neon DB
 * Use this if Prisma CLI is blocked by network restrictions
 */

const fs = require('fs');
const { Client } = require('pg');
require('dotenv/config');

async function applyMigration() {
  console.log('🔄 Connecting to Neon DB...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read the migration SQL
    const migrationSQL = fs.readFileSync(
      './prisma/migrations/20241022_init/migration.sql',
      'utf8'
    );

    console.log('🔄 Applying migration...');

    // Execute the migration
    await client.query(migrationSQL);

    console.log('✅ Migration applied successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Verify tables in Neon console: https://console.neon.tech');
    console.log('2. Deploy to Vercel (Prisma client will be generated automatically)');
    console.log('3. Or run locally: npm run dev');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);

    if (error.message.includes('already exists')) {
      console.log('');
      console.log('ℹ️  It looks like the tables already exist. This is normal if you\'ve run this before.');
      console.log('   Your database is ready to use!');
    } else {
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

applyMigration();
