# Employee Directory CMS

A modern, full-stack employee directory management system built with Next.js, featuring Google OAuth authentication with domain restriction and role-based access control.

## Features

### Authentication
- Google OAuth authentication with email domain restriction
- Only users from your specified domain can sign in
- Secure session management with NextAuth.js

### Role-Based Access Control
- **Admin Role**: Full CRUD operations on all employee records
  - Create new employee records
  - View all employees
  - Update any employee information
  - Delete employee records
  - Manage user roles

- **User Role**: Limited access to own data
  - View own employee profile
  - Update personal information (phone, address, emergency contacts)
  - Cannot delete own record
  - Cannot modify work-related information (department, position, etc.)

### Employee Management
- Comprehensive employee information tracking:
  - Personal details (name, phone, date of birth)
  - Job information (department, position, employee ID, join date)
  - Address information
  - Emergency contact details
- Clean, responsive UI built with Tailwind CSS
- Real-time updates and form validation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud Console account (for OAuth credentials)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd socioh-cms
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy your Client ID and Client Secret

### 4. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/socioh_cms"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Allowed Email Domain (only users with this domain can sign in)
ALLOWED_EMAIL_DOMAIN="yourcompany.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 6. Create the first admin user

After setting up the database, you'll need to manually set the first user as an admin:

1. Sign in to the application with your Google account
2. Connect to your database and update the user role:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@yourcompany.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
```
Navigate to the User model and change the role to "ADMIN".

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Project Structure

```
socioh-cms/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth routes
│   │   ├── employees/    # Employee CRUD endpoints
│   │   └── users/        # User management endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main application pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects to dashboard)
├── components/           # React components
│   ├── AdminDashboard.tsx
│   ├── EmployeeForm.tsx
│   ├── EmployeeList.tsx
│   ├── Navbar.tsx
│   └── UserProfile.tsx
├── lib/
│   └── prisma.ts         # Prisma client singleton
├── prisma/
│   └── schema.prisma     # Database schema
├── types/
│   └── next-auth.d.ts    # TypeScript type definitions
├── auth.config.ts        # NextAuth configuration
├── auth.ts               # NextAuth setup
├── middleware.ts         # Route protection middleware
└── package.json
```

## API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js routes

### Employees
- `GET /api/employees` - List employees (Admin: all, User: own)
- `POST /api/employees` - Create employee (Admin only)
- `GET /api/employees/[id]` - Get employee by ID
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee (Admin only)

### Users
- `GET /api/users` - List users without employee records (Admin only)
- `PUT /api/users/[id]/role` - Update user role (Admin only)

## Usage Guide

### For Administrators

1. **Sign in** with your Google account
2. **Dashboard** displays all employees
3. **Add Employee**:
   - Click "Add Employee" button
   - Select a user from the dropdown (users who don't have employee records)
   - Fill in all required fields
   - Click "Create"
4. **Edit Employee**: Click "Edit" on any employee card
5. **Delete Employee**: Click "Delete" on any employee card
6. **View Users**: Navigate to "Users" to see all registered users

### For Regular Users

1. **Sign in** with your Google account
2. **View Profile**: Your employee information is displayed
3. **Edit Profile**:
   - Click "Edit Profile"
   - Update your contact information, address, or emergency contacts
   - Click "Save Changes"
4. Note: You cannot modify work-related information or delete your record

## Database Schema

### User
- Authentication and user role information
- Links to employee record

### Employee
- Personal information (name, phone, DOB)
- Job information (department, position, employee ID, join date)
- Address details
- Emergency contact information

### Account, Session, VerificationToken
- NextAuth.js required models for OAuth functionality

## Security Features

- Domain-restricted authentication
- Role-based access control (RBAC)
- Protected API routes with session validation
- Middleware-based route protection
- SQL injection prevention with Prisma
- Secure session management

## Customization

### Changing the Allowed Domain

Edit your `.env` file:
```env
ALLOWED_EMAIL_DOMAIN="newdomain.com"
```

### Adding More Roles

1. Update `prisma/schema.prisma`:
```prisma
enum Role {
  ADMIN
  USER
  MANAGER  // New role
}
```

2. Run migration:
```bash
npx prisma migrate dev --name add_manager_role
```

3. Update TypeScript types in `types/next-auth.d.ts`
4. Implement role-specific logic in API routes and components

### Customizing Employee Fields

1. Update the Prisma schema
2. Run migrations
3. Update API routes and forms accordingly

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Check database credentials

### Google OAuth Errors
- Verify redirect URIs in Google Cloud Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure NEXTAUTH_URL matches your domain

### Domain Restriction Not Working
- Verify ALLOWED_EMAIL_DOMAIN in `.env`
- Clear browser cookies and try again
- Check auth.config.ts signIn callback

### Cannot Access Admin Features
- Verify your user role in the database
- Sign out and sign in again to refresh session

## Development

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Prisma Studio

```bash
npx prisma studio
```

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
