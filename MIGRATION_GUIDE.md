# Database Migration Guide

The database tables need to be created before the application can work. Follow these steps:

## Option 1: Using Neon DB (Serverless Postgres)

If you're using Neon DB (recommended for serverless deployments):

### Step 1: Get your Neon database connection string
1. Go to your Neon dashboard (https://console.neon.tech)
2. Select your project
3. Go to "Connection Details" or "Dashboard"
4. Copy the connection string - it should look like:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Set up your local environment
Create a `.env` file in the root directory:

```bash
# Your Neon database connection string
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email domain restriction
ALLOWED_EMAIL_DOMAIN="yourcompany.com"
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Run the migration
```bash
npx prisma migrate deploy
```

This will create all the necessary tables in your Neon database.

### Step 5: Generate Prisma Client
```bash
npx prisma generate
```

### Step 6: Verify the migration
```bash
npx prisma studio
```

This opens a browser-based database viewer where you can see all your tables.

### Step 7: Set environment variables in Vercel
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all the variables from your `.env` file
4. Redeploy your application

---

## Option 2: Using Vercel Postgres (Alternative)

If you're using Vercel Postgres, you can run migrations directly from your local machine:

### Step 1: Install dependencies locally
```bash
npm install
```

### Step 2: Set up your local environment
Create a `.env` file in the root directory with your Vercel database credentials:

```bash
# Get this from your Vercel project settings -> Storage -> Your Postgres database
DATABASE_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require"

# These are needed for the app to run but not for migrations
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ALLOWED_EMAIL_DOMAIN="yourcompany.com"
```

### Step 3: Run the migration
```bash
npx prisma migrate deploy
```

This will create all the necessary tables in your database.

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Commit and push the migration files
```bash
git add prisma/migrations
git commit -m "Add database migration"
git push
```

Vercel will automatically run `prisma generate` on deployment.

---

## Option 2: Using Local PostgreSQL

If you want to run the database locally:

### Step 1: Install PostgreSQL
Make sure PostgreSQL is installed and running on your machine.

### Step 2: Create a database
```bash
createdb socioh_cms
```

### Step 3: Set up environment variables
Create a `.env` file:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/socioh_cms"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ALLOWED_EMAIL_DOMAIN="yourcompany.com"
```

### Step 4: Run migrations
```bash
npm install
npx prisma migrate deploy
npx prisma generate
```

### Step 5: Start the development server
```bash
npm run dev
```

---

## Verifying the Migration

After running the migration, you can verify that all tables were created:

```bash
npx prisma studio
```

This will open a browser-based database viewer where you can see all your tables.

You should see these tables:
- User
- Account
- Session
- VerificationToken
- Employee
- Department

---

## Troubleshooting

### Error: "The table `public.Account` does not exist"
This means the migration hasn't been run yet. Follow the steps above to run the migration.

### Error: "P3009: Datasource does not exist"
Your DATABASE_URL is not set or is incorrect. Double-check your `.env` file.

### Error: "Failed to fetch Prisma binaries"
If you're in an offline environment or behind a firewall, try:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### For Vercel deployments
Make sure your DATABASE_URL environment variable is set in Vercel:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add/verify your DATABASE_URL from your Vercel Postgres database

After adding environment variables, redeploy your application.
