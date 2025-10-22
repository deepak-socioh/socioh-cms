#!/usr/bin/env node

/**
 * CSV User Import Script
 *
 * This script imports users from a CSV file into the database.
 * It can handle users-only import or users with employee data.
 *
 * Usage:
 *   node scripts/import-users.js path/to/users.csv
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuration
const DEFAULT_ROLE = 'USER'; // Default role for imported users
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'socioh.com';

// Column name mappings (case-insensitive)
const COLUMN_MAPPINGS = {
  // User fields
  email: ['email', 'email_address', 'user_email', 'mail'],
  name: ['name', 'full_name', 'fullname', 'user_name', 'username'],
  role: ['role', 'user_role', 'access_level'],

  // Employee fields
  firstName: ['first_name', 'firstname', 'fname', 'given_name'],
  lastName: ['last_name', 'lastname', 'lname', 'surname', 'family_name'],
  phoneNumber: ['phone', 'phone_number', 'mobile', 'contact'],
  dateOfBirth: ['dob', 'date_of_birth', 'birth_date', 'birthdate'],
  department: ['department', 'dept', 'team'],
  position: ['position', 'title', 'job_title', 'role_name'],
  employeeId: ['employee_id', 'emp_id', 'id', 'staff_id'],
  joinDate: ['join_date', 'start_date', 'hire_date', 'joining_date'],

  // Address fields
  address: ['address', 'street', 'street_address'],
  city: ['city'],
  state: ['state', 'province'],
  zipCode: ['zip', 'zipcode', 'zip_code', 'postal_code'],
  country: ['country'],

  // Emergency contact
  emergencyContactName: ['emergency_contact', 'emergency_name', 'ec_name'],
  emergencyContactPhone: ['emergency_phone', 'ec_phone', 'emergency_contact_phone'],
  emergencyContactRelation: ['emergency_relation', 'ec_relation', 'emergency_relationship'],
};

function findColumnName(row, possibleNames) {
  const rowKeys = Object.keys(row).map(k => k.toLowerCase().trim());
  for (const possible of possibleNames) {
    const found = rowKeys.find(k => k === possible.toLowerCase());
    if (found) {
      return Object.keys(row).find(k => k.toLowerCase().trim() === found);
    }
  }
  return null;
}

function getFieldValue(row, fieldMappings) {
  const columnName = findColumnName(row, fieldMappings);
  return columnName ? row[columnName]?.trim() : null;
}

function parseDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function normalizeRole(roleString) {
  if (!roleString) return DEFAULT_ROLE;
  const role = roleString.toUpperCase().trim();
  return role === 'ADMIN' || role === 'USER' ? role : DEFAULT_ROLE;
}

async function importUsers(csvPath) {
  console.log('🔄 Starting user import...\n');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    process.exit(1);
  }

  const users = [];
  const errors = [];
  let rowNumber = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        rowNumber++;

        // Extract email (required)
        const email = getFieldValue(row, COLUMN_MAPPINGS.email);

        if (!email) {
          errors.push(`Row ${rowNumber}: Missing email`);
          return;
        }

        // Validate email domain
        if (ALLOWED_DOMAIN && !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
          errors.push(`Row ${rowNumber}: Email ${email} doesn't match allowed domain @${ALLOWED_DOMAIN}`);
          return;
        }

        // Build user object
        const user = {
          email: email.toLowerCase(),
          name: getFieldValue(row, COLUMN_MAPPINGS.name) || email.split('@')[0],
          role: normalizeRole(getFieldValue(row, COLUMN_MAPPINGS.role)),
        };

        // Check if we have employee data
        const firstName = getFieldValue(row, COLUMN_MAPPINGS.firstName);
        const lastName = getFieldValue(row, COLUMN_MAPPINGS.lastName);
        const position = getFieldValue(row, COLUMN_MAPPINGS.position);
        const employeeId = getFieldValue(row, COLUMN_MAPPINGS.employeeId);

        if (firstName || lastName || position || employeeId) {
          user.employee = {
            firstName: firstName || user.name.split(' ')[0] || 'Unknown',
            lastName: lastName || user.name.split(' ').slice(1).join(' ') || 'Unknown',
            position: position || 'Employee',
            employeeId: employeeId || `EMP${rowNumber.toString().padStart(4, '0')}`,
            joinDate: parseDate(getFieldValue(row, COLUMN_MAPPINGS.joinDate)) || new Date(),
            phoneNumber: getFieldValue(row, COLUMN_MAPPINGS.phoneNumber),
            dateOfBirth: parseDate(getFieldValue(row, COLUMN_MAPPINGS.dateOfBirth)),
            department: getFieldValue(row, COLUMN_MAPPINGS.department),
            address: getFieldValue(row, COLUMN_MAPPINGS.address),
            city: getFieldValue(row, COLUMN_MAPPINGS.city),
            state: getFieldValue(row, COLUMN_MAPPINGS.state),
            zipCode: getFieldValue(row, COLUMN_MAPPINGS.zipCode),
            country: getFieldValue(row, COLUMN_MAPPINGS.country),
            emergencyContactName: getFieldValue(row, COLUMN_MAPPINGS.emergencyContactName),
            emergencyContactPhone: getFieldValue(row, COLUMN_MAPPINGS.emergencyContactPhone),
            emergencyContactRelation: getFieldValue(row, COLUMN_MAPPINGS.emergencyContactRelation),
          };
        }

        users.push(user);
      })
      .on('end', () => resolve({ users, errors }))
      .on('error', reject);
  });
}

async function saveUsers(users) {
  console.log(`\n📊 Processing ${users.length} users...\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const userErrors = [];

  for (const userData of users) {
    try {
      // Check if user exists
      const existing = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existing) {
        // Update existing user
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            name: userData.name,
            role: userData.role,
          }
        });

        // Create or update employee if employee data exists
        if (userData.employee) {
          const existingEmployee = await prisma.employee.findUnique({
            where: { userId: existing.id }
          });

          if (existingEmployee) {
            await prisma.employee.update({
              where: { userId: existing.id },
              data: userData.employee
            });
          } else {
            await prisma.employee.create({
              data: {
                ...userData.employee,
                userId: existing.id,
              }
            });
          }
        }

        updated++;
        console.log(`✅ Updated: ${userData.email}`);
      } else {
        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role,
            emailVerified: new Date(), // Mark as verified
          }
        });

        // Create employee if employee data exists
        if (userData.employee) {
          await prisma.employee.create({
            data: {
              ...userData.employee,
              userId: newUser.id,
            }
          });
        }

        created++;
        console.log(`✨ Created: ${userData.email}`);
      }
    } catch (error) {
      userErrors.push(`${userData.email}: ${error.message}`);
      skipped++;
      console.log(`❌ Error: ${userData.email} - ${error.message}`);
    }
  }

  return { created, updated, skipped, userErrors };
}

async function main() {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error(`
❌ Usage: node scripts/import-users.js <csv-file-path>

Example:
  node scripts/import-users.js users.csv
  node scripts/import-users.js data/employees.csv
    `);
    process.exit(1);
  }

  try {
    // Parse CSV
    const { users, errors: parseErrors } = await importUsers(csvPath);

    if (parseErrors.length > 0) {
      console.log('\n⚠️  Parse Errors:');
      parseErrors.forEach(err => console.log(`  ${err}`));
    }

    if (users.length === 0) {
      console.log('\n❌ No valid users found in CSV file');
      process.exit(1);
    }

    console.log(`\n📋 Found ${users.length} valid users`);
    console.log(`   - ${users.filter(u => u.employee).length} with employee data`);
    console.log(`   - ${users.filter(u => u.role === 'ADMIN').length} admins`);
    console.log(`   - ${users.filter(u => u.role === 'USER').length} regular users`);

    // Confirm before importing
    console.log('\n⚠️  This will create/update users in the database.');
    console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Save to database
    const { created, updated, skipped, userErrors } = await saveUsers(users);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary:');
    console.log('='.repeat(50));
    console.log(`✨ Created: ${created}`);
    console.log(`♻️  Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log('='.repeat(50));

    if (userErrors.length > 0) {
      console.log('\n❌ Errors:');
      userErrors.forEach(err => console.log(`  ${err}`));
    }

    console.log('\n✅ Import completed!\n');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
