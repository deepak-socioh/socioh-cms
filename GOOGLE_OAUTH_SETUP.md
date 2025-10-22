# Google Cloud OAuth Setup - Detailed Visual Guide

This guide walks you through setting up Google OAuth for your Employee Directory CMS with detailed descriptions of what you'll see.

---

## 📍 STEP 1: Access Google Cloud Console

**URL:** https://console.cloud.google.com/

**What you'll see:**
- Google Cloud Platform header (blue bar at top)
- Navigation menu (☰ hamburger icon) on the left
- Project dropdown in the top bar (says "Select a project" or shows current project)

---

## 📍 STEP 2: Create a New Project

### 2.1 Click the Project Dropdown
**Location:** Top bar, next to "Google Cloud" logo
**What it looks like:**
```
┌─────────────────────────────────────────┐
│  Google Cloud  [My Project ▼]  Search  │
│                  └─ Click here          │
└─────────────────────────────────────────┘
```

### 2.2 In the Project Selector Modal
**What you'll see:**
```
┌──────────────────────────────────────────────┐
│  Select a project                        [X] │
├──────────────────────────────────────────────┤
│  🔍 Search projects                          │
│                                              │
│  ⭐ Recent                                   │
│  ├─ My First Project                         │
│  ├─ Test Project                             │
│  └─ ...                                      │
│                                              │
│  📁 All                                      │
│                                              │
│  [+ NEW PROJECT]  ← Click this button        │
└──────────────────────────────────────────────┘
```

### 2.3 Fill in New Project Form
**What you'll see:**
```
┌──────────────────────────────────────────────┐
│  New Project                                 │
├──────────────────────────────────────────────┤
│                                              │
│  Project name *                              │
│  ┌──────────────────────────────────────┐   │
│  │ Employee Directory CMS               │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Project ID                                  │
│  ┌──────────────────────────────────────┐   │
│  │ employee-directory-cms-123456        │   │
│  └──────────────────────────────────────┘   │
│  (auto-generated, or edit it)                │
│                                              │
│  Organization                                │
│  ┌──────────────────────────────────────┐   │
│  │ No organization              ▼       │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Location                                    │
│  ┌──────────────────────────────────────┐   │
│  │ No organization                      │   │
│  └──────────────────────────────────────┘   │
│                                              │
│         [CANCEL]         [CREATE]            │
└──────────────────────────────────────────────┘
```

**Fill in:**
- Project name: `Employee Directory CMS`
- Click **[CREATE]**

**Wait 5-10 seconds** - you'll see a notification bell icon show progress

---

## 📍 STEP 3: Enable Required APIs

### 3.1 Navigate to APIs & Services
**Navigation Path:**
```
☰ Hamburger Menu → APIs & Services → Library
```

**What the menu looks like:**
```
┌─────────────────────────────────────┐
│  ☰                                  │
│  ├─ Home                            │
│  ├─ Marketplace                     │
│  ├─ Billing                         │
│  ├─ 📊 APIs & Services  ←Click here │
│  │   ├─ Dashboard                   │
│  │   ├─ Library         ←Then here  │
│  │   ├─ Credentials                 │
│  │   └─ OAuth consent screen        │
│  ├─ IAM & Admin                     │
│  └─ ...                             │
└─────────────────────────────────────┘
```

### 3.2 Search and Enable Google+ API
**What you'll see in Library:**
```
┌────────────────────────────────────────────────┐
│  API Library                                   │
├────────────────────────────────────────────────┤
│  🔍 Search for APIs & Services                 │
│  ┌──────────────────────────────────────────┐ │
│  │ Google+                                  │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Popular APIs                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │Maps  │ │Drive │ │Gmail │                   │
│  └──────┘ └──────┘ └──────┘                  │
└────────────────────────────────────────────────┘
```

**Type:** `Google+ API` in the search box

**Click on:** "Google+ API" card

**You'll see:**
```
┌────────────────────────────────────────────────┐
│  ← Google+ API                                 │
├────────────────────────────────────────────────┤
│  [G+] Google+ API                              │
│                                                │
│  Builds on top of the Google+ platform.        │
│                                                │
│         [ENABLE]  ← Click this button          │
│                                                │
│  Documentation | Support | Terms               │
└────────────────────────────────────────────────┘
```

**Click:** [ENABLE]

**Wait 3-5 seconds** - you'll be redirected to the API dashboard

### 3.3 (Optional but Recommended) Enable Google People API
**Repeat the same process:**
1. Go back to Library
2. Search: `Google People API`
3. Click the result
4. Click [ENABLE]

---

## 📍 STEP 4: Configure OAuth Consent Screen

### 4.1 Navigate to OAuth Consent Screen
**Navigation Path:**
```
☰ Menu → APIs & Services → OAuth consent screen
```

**What you'll see:**
```
┌─────────────────────────────────────────────────┐
│  OAuth consent screen                           │
├─────────────────────────────────────────────────┤
│                                                 │
│  User Type                                      │
│                                                 │
│  Select the user type for your app:             │
│                                                 │
│  ○ Internal                                     │
│    Available to users within your              │
│    organization only                            │
│    (Requires Google Workspace)                  │
│                                                 │
│  ○ External                                     │
│    Available to any user with a                 │
│    Google Account                               │
│                                                 │
│         [CREATE]                                │
└─────────────────────────────────────────────────┘
```

**Choose:**
- **Internal** if you have Google Workspace (domain email like user@yourcompany.com)
- **External** if personal Gmail or for testing

**Click:** [CREATE]

### 4.2 Fill OAuth Consent Screen - Edit App Registration

**You'll see a form with 4 steps:**

```
┌─────────────────────────────────────────────────┐
│  OAuth consent screen                           │
├─────────────────────────────────────────────────┤
│  ① OAuth consent screen → ② Scopes →           │
│  ③ Test users → ④ Summary                      │
└─────────────────────────────────────────────────┘
```

### Step 1: OAuth consent screen

```
┌─────────────────────────────────────────────────┐
│  App information                                │
│                                                 │
│  App name *                                     │
│  ┌───────────────────────────────────────────┐ │
│  │ Employee Directory CMS                    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  User support email *                           │
│  ┌───────────────────────────────────────────┐ │
│  │ your-email@gmail.com          ▼          │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  App logo (optional)                            │
│  [Choose File]                                  │
│                                                 │
│  Application home page                          │
│  ┌───────────────────────────────────────────┐ │
│  │ https://your-app.vercel.app               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Application privacy policy link                │
│  ┌───────────────────────────────────────────┐ │
│  │ (optional for testing)                    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Application terms of service link              │
│  ┌───────────────────────────────────────────┐ │
│  │ (optional for testing)                    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Authorized domains                             │
│  ┌───────────────────────────────────────────┐ │
│  │ + Add domain                              │ │
│  │ yourcompany.com                           │ │
│  │ vercel.app                                │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Developer contact information *                │
│  ┌───────────────────────────────────────────┐ │
│  │ your-email@gmail.com                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│         [SAVE AND CONTINUE]                     │
└─────────────────────────────────────────────────┘
```

**Fill in:**
- App name: `Employee Directory CMS`
- User support email: Your email (dropdown)
- Application home page: `http://localhost:3000` (or your Vercel URL)
- Authorized domains:
  - `yourcompany.com` (if you have a custom domain)
  - `vercel.app` (for Vercel deployments)
- Developer contact: Your email

**Click:** [SAVE AND CONTINUE]

### Step 2: Scopes

```
┌─────────────────────────────────────────────────┐
│  Scopes for Google APIs                         │
│                                                 │
│  Tell users why your app needs access to       │
│  their data                                     │
│                                                 │
│  [ADD OR REMOVE SCOPES]  ← Click this           │
│                                                 │
│  Your non-sensitive scopes:                     │
│  (none added yet)                               │
│                                                 │
│         [SAVE AND CONTINUE]                     │
└─────────────────────────────────────────────────┘
```

**Click:** [ADD OR REMOVE SCOPES]

**You'll see a side panel:**
```
┌─────────────────────────────────────────────────┐
│  Update selected scopes                     [X] │
├─────────────────────────────────────────────────┤
│  🔍 Filter                                      │
│                                                 │
│  Manually add scopes:                           │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│  [+ ADD TO TABLE]                               │
│                                                 │
│  Google API Scopes:                             │
│                                                 │
│  ☐ .../auth/userinfo.email                     │
│     View your email address                     │
│                                                 │
│  ☐ .../auth/userinfo.profile                   │
│     See your personal info                      │
│                                                 │
│  ☐ openid                                       │
│     Associate you with your personal info       │
│                                                 │
│  (Scroll to find more...)                       │
│                                                 │
│         [CANCEL]         [UPDATE]               │
└─────────────────────────────────────────────────┘
```

**Check these boxes:**
- ✅ `.../auth/userinfo.email`
- ✅ `.../auth/userinfo.profile`
- ✅ `openid`

**Click:** [UPDATE]

**Then click:** [SAVE AND CONTINUE]

### Step 3: Test users (Only if you selected "External")

**Skip this for "Internal" apps**

```
┌─────────────────────────────────────────────────┐
│  Test users                                     │
│                                                 │
│  Add email addresses for test users             │
│                                                 │
│  [+ ADD USERS]  ← Click if External             │
│                                                 │
│  your-email@gmail.com                           │
│                                                 │
│         [SAVE AND CONTINUE]                     │
└─────────────────────────────────────────────────┘
```

**For External apps only:**
- Click [+ ADD USERS]
- Enter your email address
- Click [ADD]

**Click:** [SAVE AND CONTINUE]

### Step 4: Summary

```
┌─────────────────────────────────────────────────┐
│  Summary                                        │
│                                                 │
│  ✓ OAuth consent screen configured              │
│  ✓ Scopes configured                            │
│  ✓ Test users configured                        │
│                                                 │
│  Review your app information...                 │
│                                                 │
│         [BACK TO DASHBOARD]                     │
└─────────────────────────────────────────────────┘
```

**Click:** [BACK TO DASHBOARD]

---

## 📍 STEP 5: Create OAuth Credentials

### 5.1 Navigate to Credentials
**Navigation Path:**
```
☰ Menu → APIs & Services → Credentials
```

**What you'll see:**
```
┌─────────────────────────────────────────────────┐
│  Credentials                                    │
├─────────────────────────────────────────────────┤
│  [+ CREATE CREDENTIALS ▼]  ← Click here         │
│     │                                           │
│     ├─ API key                                  │
│     ├─ OAuth client ID      ← Select this       │
│     └─ Service account key                      │
│                                                 │
│  Credentials:                                   │
│  (empty or existing credentials)                │
└─────────────────────────────────────────────────┘
```

**Click:** [+ CREATE CREDENTIALS] → Select "OAuth client ID"

### 5.2 Create OAuth Client ID

```
┌─────────────────────────────────────────────────┐
│  Create OAuth client ID                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  Application type *                             │
│  ○ Web application      ← Select this           │
│  ○ Android                                      │
│  ○ Chrome app                                   │
│  ○ iOS                                          │
│  ○ TV and Limited Input devices                 │
│  ○ Desktop app                                  │
│                                                 │
│  [CREATE]                                       │
└─────────────────────────────────────────────────┘
```

**Select:** Web application

**You'll see the full form:**

```
┌─────────────────────────────────────────────────┐
│  Create OAuth client ID                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  Application type: Web application              │
│                                                 │
│  Name                                           │
│  ┌───────────────────────────────────────────┐ │
│  │ Employee Directory Web Client             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Authorized JavaScript origins                  │
│  For use with requests from a browser          │
│  [+ ADD URI]                                    │
│  ┌───────────────────────────────────────────┐ │
│  │ http://localhost:3000                     │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │ https://your-app.vercel.app               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Authorized redirect URIs                       │
│  For use with requests from a web server        │
│  [+ ADD URI]                                    │
│  ┌───────────────────────────────────────────┐ │
│  │ http://localhost:3000/api/auth/callback/  │ │
│  │ google                                    │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │ https://your-app.vercel.app/api/auth/     │ │
│  │ callback/google                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│         [CANCEL]         [CREATE]               │
└─────────────────────────────────────────────────┘
```

**Fill in:**

1. **Name:** `Employee Directory Web Client`

2. **Authorized JavaScript origins** (click [+ ADD URI] for each):
   - `http://localhost:3000`
   - `https://your-app.vercel.app` (replace with your actual Vercel URL)

3. **Authorized redirect URIs** (click [+ ADD URI] for each):
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google`

**IMPORTANT:**
- No trailing slashes!
- Must be exact: `/api/auth/callback/google`
- Update `your-app.vercel.app` with your actual Vercel URL

**Click:** [CREATE]

### 5.3 Copy Your Credentials

**You'll see a success popup:**

```
┌─────────────────────────────────────────────────┐
│  OAuth client created                       [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Here is your client ID and secret:             │
│                                                 │
│  Your Client ID                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 123456789012-abc...googleusercontent.com  │📋│
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Your Client Secret                             │
│  ┌───────────────────────────────────────────┐ │
│  │ GOCSPX-abc123xyz789...                    │📋│
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ⚠ Keep your client secret private!            │
│                                                 │
│         [DOWNLOAD JSON]      [OK]               │
└─────────────────────────────────────────────────┘
```

**IMPORTANT - Copy both values:**

1. **Client ID** - Click the 📋 copy icon
   - Format: `123456789012-abc...apps.googleusercontent.com`
   - Save to `.env` as `GOOGLE_CLIENT_ID`

2. **Client Secret** - Click the 📋 copy icon
   - Format: `GOCSPX-abc123xyz789...`
   - Save to `.env` as `GOOGLE_CLIENT_SECRET`

**Optional:** Click [DOWNLOAD JSON] to save a backup

**Click:** [OK]

---

## 📍 STEP 6: Add to Your .env File

**Create or update `.env`:**

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID="123456789012-abc...apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz789..."

# Other environment variables
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-with-openssl-rand-base64-32"
ALLOWED_EMAIL_DOMAIN="yourcompany.com"
DATABASE_URL="postgresql://..."
```

---

## 📍 Quick Reference: Finding Your Credentials Later

If you need to find your credentials again:

1. Go to: **APIs & Services → Credentials**
2. Look under "OAuth 2.0 Client IDs"
3. Click on your client name: "Employee Directory Web Client"
4. You'll see:
   - Client ID (always visible)
   - Client Secret (click "RESET SECRET" if lost - this will invalidate the old one)

---

## 🎯 Final Checklist

Before testing, make sure:

- ✅ Google+ API is enabled
- ✅ OAuth consent screen is configured
- ✅ OAuth client ID created (Web application)
- ✅ Authorized JavaScript origins include your domains
- ✅ Authorized redirect URIs include `/api/auth/callback/google`
- ✅ Client ID and Secret copied to `.env`
- ✅ `ALLOWED_EMAIL_DOMAIN` set in `.env`

---

## 🐛 Common Issues

### "Error 400: redirect_uri_mismatch"
**Fix:** Go back to Credentials → Edit your OAuth client → Make sure redirect URI exactly matches:
```
http://localhost:3000/api/auth/callback/google
```
(No trailing slash, exact path)

### "Access blocked: This app's request is invalid"
**Fix:** Make sure OAuth consent screen is configured and published

### "This app isn't verified"
**Normal for testing.** Click "Advanced" → "Go to [App Name] (unsafe)"

For production with external users, you'll need to submit for Google verification.

---

## 📸 Need More Help?

If you get stuck on any screen:
1. Take a screenshot
2. Share it with me
3. I'll tell you exactly what to do!

You can also share your screen/screenshot at any step and I'll guide you through it.
