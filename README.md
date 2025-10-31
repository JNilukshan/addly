# Adly - Ad Management Platform

A minimal ad platform built with Next.js, Supabase, and SST where users can create and manage their own ads with strong row-level security.

## Features

- **Authentication**: Email magic link and Google OAuth sign-in
- **CRUD Operations**: Create, read, update, and delete ads
- **Row-Level Security**: Users can only access their own ads
- **Modern UI**: Black and green minimal design
- **Deployment Ready**: Configured with SST for easy deployment

## Tech Stack

- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: SST (Serverless Stack)

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard, go to SQL Editor
3. Run the SQL commands from `supabase-schema.sql` to create the database schema
4. Go to Authentication → Settings → Auth Providers
5. Enable Email provider and Google OAuth provider
6. For Google OAuth, add your OAuth credentials

### 2. Environment Variables

Your `.env.local` file should contain:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 4. Deployment with SST

```bash
# Deploy to AWS
npx sst deploy

# Remove deployment
npx sst remove
```

## Application Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── sign-in/          # Sign-in page
│   │   └── callback/         # Auth callback handler
│   ├── dashboard/
│   │   ├── create/           # Create new ad
│   │   ├── edit/[id]/        # Edit existing ad
│   │   ├── layout.tsx        # Dashboard layout with header
│   │   └── page.tsx          # My ads list
│   ├── layout.tsx            # Root layout with AuthProvider
│   └── page.tsx              # Home page (redirects based on auth)
├── components/
│   └── AdForm.tsx            # Reusable form for create/edit
└── lib/
    ├── auth.tsx              # Auth context and hooks
    └── supabaseClient.ts     # Supabase client setup
```

## Database Schema

The application uses a single `ads` table with the following structure:

- `id` (UUID, Primary Key)
- `title` (Text, Required)
- `description` (Text, Required)
- `destination_url` (Text, Required)
- `status` (Text, 'active' or 'inactive')
- `user_id` (UUID, Foreign Key to auth.users)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Row-Level Security (RLS)

The application implements strong RLS policies:

- Users can only view their own ads
- Users can only create ads for themselves
- Users can only update their own ads
- Users can only delete their own ads

## Authentication Flow

1. User visits the site and is redirected to sign-in page
2. User can sign in with email (magic link) or Google OAuth
3. After successful authentication, user is redirected to dashboard
4. All ad operations are scoped to the authenticated user

## Key Features

### Authentication
- Email magic link authentication
- Google OAuth integration
- Persistent sessions
- Sign-out functionality

### Ad Management
- **List**: View all user's ads with status indicators
- **Create**: Form validation with helpful error messages
- **Edit**: Update existing ads with pre-filled forms
- **Delete**: Confirmation dialog before deletion

### Security
- Row-level security ensures data isolation
- Client-side route protection
- Server-side authentication validation

### UI/UX
- Minimal black and green color scheme
- Responsive design
- Loading states and error handling
- Success feedback for actions

## Validation

The application includes comprehensive validation:

- **Title**: Required, minimum 3 characters
- **Description**: Required, minimum 10 characters
- **URL**: Required, valid URL format
- **Status**: Active or Inactive

## Development Notes

- Uses Next.js App Router with TypeScript
- Client-side state management with React Context
- Tailwind CSS for styling
- ESLint for code quality
- Row-level security testing recommended

## Deployment

The application is configured for deployment with SST, which will:

- Deploy the Next.js application to AWS
- Configure environment variables
- Set up CDN and SSL certificates
- Provide deployment URLs

Run `npx sst deploy` to deploy to your AWS account.
