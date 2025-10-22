# Setup Instructions for Socioh CMS

Your `.env` file has been created with your Neon DB credentials. Now you need to apply the database migration.

## ⚠️ Important: Network Restrictions

The current environment has network restrictions that prevent running Prisma migrations directly. You need to run the migration from your **local machine** where you have internet access.

---

## 🚀 Quick Setup (Run on Your Local Machine)

### Option 1: Using Prisma CLI (Recommended)

```bash
# 1. Clone/pull the repository
git pull origin claude/implement-department-management-011CUNbURpV9mHCakhLtgsJC

# 2. Install dependencies
npm install

# 3. The .env file is already created in the repo, but for security,
#    you should copy it locally (it's in .gitignore)
#    Make sure your .env file has these variables:

cat > .env << 'EOL'
DATABASE_URL="postgresql://neondb_owner:***@ep-solitary-dew-adcntutu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_URL="https://socioh-cms.vercel.app/"
NEXTAUTH_SECRET="your-secret-from-vercel-env-vars"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ALLOWED_EMAIL_DOMAIN="socioh.com"
EOL

# 4. Run the migration (creates all database tables)
npx prisma migrate deploy

# 5. Generate Prisma Client
npx prisma generate

# 6. (Optional) Verify the migration worked
npx prisma studio
```

### Option 2: Using Node.js Script (If Prisma CLI doesn't work)

```bash
# 1. Clone/pull the repository
git pull origin claude/implement-department-management-011CUNbURpV9mHCakhLtgsJC

# 2. Install dependencies
npm install

# 3. Create .env file (see Option 1 step 3)

# 4. Run the migration script
node apply-migration.js

# 5. Deploy to Vercel (Prisma client generation happens automatically)
```

### Option 3: Using Neon Console SQL Editor

If you prefer to run the migration directly in Neon's console:

1. Go to https://console.neon.tech
2. Select your project: `ep-solitary-dew-adcntutu-pooler`
3. Go to "SQL Editor"
4. Copy the contents of `prisma/migrations/20241022_init/migration.sql`
5. Paste and run it
6. Commit the changes and deploy to Vercel

---

## ✅ Verify Everything Works

After running the migration, verify the tables were created:

### Check in Neon Console:
1. Go to https://console.neon.tech
2. Navigate to "Tables"
3. You should see: `User`, `Account`, `Session`, `VerificationToken`, `Employee`, `Department`

### Or use Prisma Studio:
```bash
npx prisma studio
```

---

## 🔐 Security Note

**IMPORTANT:** The `.env` file contains sensitive credentials. Make sure:

1. ✅ The `.env` file is in `.gitignore` (already done)
2. ✅ Never commit the `.env` file to git
3. ✅ Environment variables are set in Vercel dashboard
4. ✅ After setup, you may want to rotate the NEXTAUTH_SECRET for extra security:
   ```bash
   # Generate a new secret
   openssl rand -base64 32

   # Update in .env and Vercel environment variables
   ```

---

## 🚢 Deploy to Vercel

Once the migration is complete:

1. Make sure all environment variables are set in Vercel:
   - Go to your Vercel project → Settings → Environment Variables
   - Verify all variables from `.env` are set (except don't commit DATABASE_URL credentials)

2. Push your code (migration files are already committed)
   ```bash
   git push origin claude/implement-department-management-011CUNbURpV9mHCakhLtgsJC
   ```

3. Vercel will automatically:
   - Run `npx prisma generate` during build
   - Deploy your application

4. Test the login at: https://socioh-cms.vercel.app/

---

## 📋 What the Migration Creates

The migration creates these tables:

- **User** - User accounts with roles (ADMIN/USER)
- **Account** - OAuth provider accounts (Google OAuth)
- **Session** - User sessions (NextAuth.js)
- **VerificationToken** - Email verification tokens
- **Employee** - Employee records with personal info, job details, address
- **Department** - Department management with heads and descriptions

---

## 🆘 Troubleshooting

### "Error: P3009: migrate found failed migration"
```bash
# Reset and reapply
npx prisma migrate reset
npx prisma migrate deploy
```

### "Error: Can't reach database server"
- Check your DATABASE_URL is correct
- Verify Neon database is running
- Check network/firewall settings

### "The table 'public.Account' does not exist"
- The migration hasn't been run yet
- Follow the steps in Option 1 above

### Migration already applied but getting errors
```bash
# Regenerate Prisma Client
npx prisma generate
```

---

## 🎉 Next Steps

After the migration is complete and deployed:

1. Visit https://socioh-cms.vercel.app/
2. Sign in with your @socioh.com Google account
3. First user to sign in will need to be manually set as ADMIN in the database
4. Then you can:
   - Create departments at `/dashboard/departments`
   - Add employees at `/dashboard`
   - Manage users at `/dashboard/users`

Enjoy your new department management system! 🚀
