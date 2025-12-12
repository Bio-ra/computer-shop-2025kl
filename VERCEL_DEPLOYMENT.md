# Vercel Deployment Guide for Computer Shop 2025 KL

## Prerequisites

1. **Database Setup**: You need a PostgreSQL database (e.g., from AWS RDS, Neon, or Supabase)
2. **GitHub OAuth**: Set up GitHub OAuth credentials if using GitHub for authentication

## Environment Variables Required on Vercel

Add these environment variables in your Vercel project settings:

### Database
- `DATABASE_URL` - Your PostgreSQL connection string
  - Example: `postgresql://user:password@host:5432/computer_shop`

### Authentication (NextAuth/Auth.js)
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `AUTH_GITHUB_ID` - Your GitHub OAuth App ID
- `AUTH_GITHUB_SECRET` - Your GitHub OAuth App Secret
- `AUTH_URL` - Your deployment URL (e.g., `https://your-app.vercel.app`)

## Steps to Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Fix Prisma schema and add deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select your project

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add all required variables from the list above
   - Make sure to set them for Production and Preview environments

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically run `npm install` → `prisma generate` → `next build`

## What Was Fixed

1. **Added `url` to datasource in prisma/schema.prisma**
   - Now reads from `DATABASE_URL` environment variable
   - Required for Prisma to connect to your database

2. **Created `.env.example`**
   - Documents all required environment variables
   - Helps team members understand what needs to be configured

3. **Your existing setup already handles build-time issues**
   - `prisma.config.ts` allows empty `DATABASE_URL` during build
   - `lib/prisma.ts` gracefully handles missing Prisma client
   - This prevents failures when `prisma generate` runs with no database

## Troubleshooting

### "error: connect ECONNREFUSED" during build
- Vercel doesn't need database access during `prisma generate`
- If this happens, make sure `DATABASE_URL` is set (even to a dummy value during build)
- Your build should skip database connection during the generate step

### "PrismaClientInitializationError"
- Ensure `DATABASE_URL` is set in production environment variables
- Check that your database is accessible from Vercel's region

### GitHub OAuth not working
- Verify `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` are correct
- Set OAuth callback URL to: `https://your-app.vercel.app/api/auth/callback/github`
- Update this in your GitHub OAuth app settings
