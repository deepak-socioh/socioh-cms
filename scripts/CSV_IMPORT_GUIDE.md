# CSV User Import Guide

This guide explains how to import users from a CSV file into your Socioh CMS database.

## Quick Start

```bash
# 1. Place your CSV file in the project directory
cp /path/to/your/users.csv ./users.csv

# 2. Run the import script
node scripts/import-users.js users.csv
```

## Supported CSV Formats

The script is **flexible** and supports various column names. It will automatically detect your column headers.

### Format 1: Users Only (Simple)

**Minimum required:** Just an email column

```csv
email,name,role
deepak@socioh.com,Deepak Kumar,ADMIN
john@socioh.com,John Doe,USER
jane@socioh.com,Jane Smith,USER
```

### Format 2: Users with Employee Data (Full)

```csv
email,name,role,first_name,last_name,employee_id,position,department,join_date,phone
deepak@socioh.com,Deepak Kumar,ADMIN,Deepak,Kumar,EMP001,CEO,Management,2020-01-15,+1234567890
john@socioh.com,John Doe,USER,John,Doe,EMP002,Developer,Engineering,2021-03-20,+1234567891
jane@socioh.com,Jane Smith,USER,Jane,Smith,EMP003,Designer,Design,2021-06-10,+1234567892
```

### Format 3: Complete with Address and Emergency Contact

```csv
email,first_name,last_name,position,department,employee_id,join_date,phone,address,city,state,zip,country,emergency_contact,emergency_phone,emergency_relation
deepak@socioh.com,Deepak,Kumar,CEO,Management,EMP001,2020-01-15,+1234567890,123 Main St,Mumbai,MH,400001,India,Priya Kumar,+9876543210,Spouse
john@socioh.com,John,Doe,Developer,Engineering,EMP002,2021-03-20,+1234567891,456 Oak Ave,Bangalore,KA,560001,India,Mary Doe,+9876543211,Spouse
```

## Supported Column Names

The script automatically recognizes these column names (case-insensitive):

### User Fields
- **Email** (required): `email`, `email_address`, `user_email`, `mail`
- **Name**: `name`, `full_name`, `fullname`, `user_name`, `username`
- **Role**: `role`, `user_role`, `access_level` (values: `ADMIN` or `USER`, defaults to `USER`)

### Employee Fields
- **First Name**: `first_name`, `firstname`, `fname`, `given_name`
- **Last Name**: `last_name`, `lastname`, `lname`, `surname`, `family_name`
- **Phone**: `phone`, `phone_number`, `mobile`, `contact`
- **Date of Birth**: `dob`, `date_of_birth`, `birth_date`, `birthdate`
- **Department**: `department`, `dept`, `team`
- **Position**: `position`, `title`, `job_title`, `role_name`
- **Employee ID**: `employee_id`, `emp_id`, `id`, `staff_id`
- **Join Date**: `join_date`, `start_date`, `hire_date`, `joining_date`

### Address Fields
- **Address**: `address`, `street`, `street_address`
- **City**: `city`
- **State**: `state`, `province`
- **ZIP Code**: `zip`, `zipcode`, `zip_code`, `postal_code`
- **Country**: `country`

### Emergency Contact
- **Name**: `emergency_contact`, `emergency_name`, `ec_name`
- **Phone**: `emergency_phone`, `ec_phone`, `emergency_contact_phone`
- **Relation**: `emergency_relation`, `ec_relation`, `emergency_relationship`

## Date Formats

The script accepts various date formats:
- `2020-01-15`
- `01/15/2020`
- `15-Jan-2020`
- `January 15, 2020`

## Features

### 1. Smart Detection
- Automatically detects column names
- Handles missing optional fields
- Validates email domains

### 2. Update or Create
- **Existing users**: Updates their information
- **New users**: Creates new records
- **Duplicates**: Skips and reports errors

### 3. Employee Data (Optional)
- If CSV has employee fields, creates Employee records
- If not, only creates User records
- Auto-generates employee IDs if missing

### 4. Email Validation
- Only allows emails from your `ALLOWED_EMAIL_DOMAIN` (socioh.com)
- Prevents invalid email formats

### 5. Role Assignment
- Defaults to `USER` role
- Can specify `ADMIN` in CSV
- Case-insensitive role detection

## Usage Examples

### Example 1: Simple User Import

**users.csv:**
```csv
email,name
deepak@socioh.com,Deepak Kumar
john@socioh.com,John Doe
jane@socioh.com,Jane Smith
```

**Command:**
```bash
node scripts/import-users.js users.csv
```

**Result:**
- Creates 3 users
- All get `USER` role by default
- No employee records created

### Example 2: Import with Roles

**users.csv:**
```csv
email,name,role
deepak@socioh.com,Deepak Kumar,ADMIN
john@socioh.com,John Doe,USER
jane@socioh.com,Jane Smith,ADMIN
```

**Command:**
```bash
node scripts/import-users.js users.csv
```

**Result:**
- Creates 2 admins and 1 user
- Respects role assignments

### Example 3: Full Employee Import

**employees.csv:**
```csv
email,first_name,last_name,position,department,employee_id,join_date,phone
deepak@socioh.com,Deepak,Kumar,CEO,Management,EMP001,2020-01-15,+1234567890
john@socioh.com,John,Doe,Developer,Engineering,EMP002,2021-03-20,+1234567891
```

**Command:**
```bash
node scripts/import-users.js employees.csv
```

**Result:**
- Creates 2 users
- Creates 2 employee records linked to users
- Full employee profiles with all details

### Example 4: Import from Different Location

```bash
node scripts/import-users.js /path/to/data/company_roster.csv
```

## What Happens During Import

1. **Parse CSV** - Reads and validates the CSV file
2. **Validate Emails** - Checks domain restrictions
3. **Show Preview** - Displays what will be imported
4. **3-Second Countdown** - Time to cancel (Ctrl+C)
5. **Import Data** - Creates/updates records in database
6. **Show Summary** - Reports success/failures

## Sample Output

```
🔄 Starting user import...

📋 Found 10 valid users
   - 8 with employee data
   - 2 admins
   - 8 regular users

⚠️  This will create/update users in the database.
   Press Ctrl+C to cancel, or wait 3 seconds to continue...

📊 Processing 10 users...

✨ Created: deepak@socioh.com
✨ Created: john@socioh.com
✅ Updated: jane@socioh.com
...

==================================================
📊 Import Summary:
==================================================
✨ Created: 7
♻️  Updated: 3
⏭️  Skipped: 0
==================================================

✅ Import completed!
```

## Troubleshooting

### Error: "Missing email"
- Make sure your CSV has an email column
- Check column name spelling

### Error: "Email doesn't match allowed domain"
- Only @socioh.com emails are allowed
- Check ALLOWED_EMAIL_DOMAIN in .env

### Error: "Duplicate employee_id"
- Employee IDs must be unique
- Remove duplicates from CSV or let script auto-generate

### Error: "File not found"
- Check file path is correct
- Use absolute or relative path from project root

### Warning: "No valid users found"
- Check CSV format
- Ensure file is not empty
- Verify column headers exist

## Advanced Usage

### Dry Run (Test First)

To test without actually importing:
1. Comment out the `saveUsers()` call in the script
2. Run the script to see what would be imported

### Custom Domain

To allow different email domain:
```bash
ALLOWED_EMAIL_DOMAIN=example.com node scripts/import-users.js users.csv
```

### Import Subset

Create a smaller CSV with just the users you want to import.

## After Import

1. **Verify in Database**:
   ```bash
   npx prisma studio
   ```
   Check User and Employee tables

2. **Test Login**:
   - Users can sign in with Google OAuth
   - Their existing user record will be matched by email

3. **Assign Roles**:
   - Update roles in Prisma Studio if needed
   - Or edit CSV and re-import (will update existing users)

## Security Notes

- The script only works locally (not exposed as API endpoint)
- Requires .env file with DATABASE_URL
- Only imports emails from allowed domain
- Marks all imported users as email verified

## Need Help?

Common issues:
1. Make sure you've run `npm install` first
2. Check your .env file has DATABASE_URL set
3. Verify database connection works
4. Try with a small test CSV first (2-3 rows)

---

**Ready to import?** Create your CSV and run:
```bash
node scripts/import-users.js your-file.csv
```
