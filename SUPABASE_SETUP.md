# Supabase PostgreSQL Setup Guide

Your project has been converted from MySQL to Supabase PostgreSQL!

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: formula-react-rwrt (or any name you want)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Wait for the project to be created (~2 minutes)

## Step 2: Get Your Database Connection Strings

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. You'll need TWO connection strings:

### Connection String (Session Mode - for Prisma queries)

- Select **Session** mode
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your actual database password
- This goes in `DATABASE_URL`

Example:

```
postgresql://postgres.abc123xyz:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Connection String (Direct - for Prisma migrations)

- Select **Session** mode, but change port from `6543` to `5432`
- Remove `?pgbouncer=true` from the end
- This goes in `DIRECT_URL`

Example:

```
postgresql://postgres.abc123xyz:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

## Step 3: Update Your .env File

Create or update `.env` file in the project root:

```env
# Supabase Database URLs
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**Replace:**

- `[YOUR-PROJECT-REF]` with your project reference (e.g., `abc123xyz`)
- `[YOUR-PASSWORD]` with your database password
- `[REGION]` with your region (e.g., `us-west-1`)

## Step 4: Push Schema to Supabase

Run this command to create the `formulas` table in your Supabase database:

```bash
npm run db:push
```

This will create the table structure without creating migration files.

**OR** if you want to create migrations:

```bash
npm run db:migrate
```

## Step 5: Verify Your Setup

1. Check your database in Supabase:

   - Go to **Table Editor** in your Supabase dashboard
   - You should see the `formulas` table with these columns:
     - `formula_id` (int4, primary key)
     - `formula_name` (text, nullable, unique)
     - `formula` (text, nullable)
     - `creation_time` (timestamp, nullable, default: now())
     - `approved` (int2, default: 0)

2. Test the connection:

```bash
npm run db:studio
```

This opens Prisma Studio where you can view/edit your data.

## Step 6: Deploy to Vercel

1. Add environment variables to Vercel:

   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add `DATABASE_URL` (paste your Session mode connection string)
   - Add `DIRECT_URL` (paste your Direct connection string)
   - Make sure both are available for **Production**, **Preview**, and **Development**

2. Redeploy your project

## Changes Made to Your Project

### 1. `prisma/schema.prisma`

- Changed `provider` from `"mysql"` to `"postgresql"`
- Added `directUrl` for migrations
- Removed MySQL-specific types:
  - `@db.VarChar(45)` → removed (PostgreSQL uses `text` by default)
  - `@db.DateTime(0)` → removed (PostgreSQL uses `timestamp` by default)
  - `@db.TinyInt` → `@db.SmallInt` (PostgreSQL equivalent)
- Simplified unique constraint (no need for map name)

### 2. `package.json`

- Added helper scripts:
  - `db:push` - Push schema to database
  - `db:migrate` - Create and run migrations
  - `db:studio` - Open Prisma Studio

### 3. `.env.example`

- Added Supabase connection string examples

## What's Different: PostgreSQL vs MySQL

### Data Types

- PostgreSQL uses `text` instead of `VARCHAR` (no need to specify length)
- `TinyInt` → `SmallInt` (0-32767 instead of 0-255)
- Better support for JSON, arrays, and advanced types

### Performance

- Supabase includes connection pooling via PgBouncer
- Better concurrent connection handling
- Real-time subscriptions available (if you want to add them later)

### Benefits of Supabase

- ✅ Free tier with 500MB database
- ✅ Auto-scaling
- ✅ Daily backups
- ✅ Built-in authentication (if needed later)
- ✅ Auto-generated REST APIs
- ✅ Real-time subscriptions
- ✅ Storage for files
- ✅ Edge functions

## Troubleshooting

### Error: "Can't reach database server"

- Check your connection strings are correct
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Verify your IP isn't blocked (Supabase allows all IPs by default)

### Error: "Connection pool timeout"

- You might be using `DATABASE_URL` for migrations
- Use `DIRECT_URL` for `prisma migrate` commands
- Use `DATABASE_URL` for regular queries

### Error: "SSL connection required"

- Supabase requires SSL
- Your connection string should work automatically
- If issues, add `?sslmode=require` to the end

## Next Steps (Optional)

### Enable Row Level Security (RLS)

If you want to add user authentication later:

```sql
-- In Supabase SQL Editor
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
```

### Add Supabase Client (for real-time features)

```bash
npm install @supabase/supabase-js
```

Then you can add real-time subscriptions to see changes instantly!

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Supabase Discord](https://discord.supabase.com/)
