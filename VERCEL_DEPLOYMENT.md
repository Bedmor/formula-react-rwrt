# Deploying to Vercel with Supabase

## Quick Setup (5 minutes)

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these two variables:

#### DATABASE_URL (Session Mode - for queries)

```
postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### DIRECT_URL (Direct Mode - for migrations)

```
postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Important Settings for Each Variable:**

- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**

### Step 2: Get Your Supabase Connection Strings

#### If you haven't set up Supabase yet:

1. Go to [supabase.com](https://supabase.com) and create a project
2. Wait ~2 minutes for it to be ready
3. Go to **Settings** → **Database**
4. Find **Connection string** section

#### For DATABASE_URL (Session Mode):

1. Select **Session** mode from dropdown
2. Copy the connection string
3. Replace `[YOUR-PASSWORD]` with your actual database password

Example:

```
postgresql://postgres.abcdefgh123:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### For DIRECT_URL (Direct Mode):

1. Take your DATABASE_URL
2. Change port from `6543` to `5432`
3. Remove `?pgbouncer=true` from the end

Example:

```
postgresql://postgres.abcdefgh123:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### Step 3: Push Your Database Schema to Supabase

Before deploying, make sure your Supabase database has the tables:

**Locally, run:**

```bash
# Create .env file with your connection strings first
npm run db:push
```

This creates the `formulas` table in Supabase.

### Step 4: Deploy to Vercel

Option A - **Push to Git:**

```bash
git add .
git commit -m "Configure Supabase and Vercel"
git push
```

Option B - **Deploy via Vercel CLI:**

```bash
npm install -g vercel
vercel --prod
```

Option C - **Redeploy from Vercel Dashboard:**

- Go to your Vercel project
- Click **Deployments** tab
- Click the ⋮ menu on the latest deployment
- Click **Redeploy**

### Step 5: Verify Deployment

1. Visit your deployed URL
2. Check the homepage loads
3. Try searching for a formula (won't find any yet, but should connect to DB)
4. Check Vercel logs if there are errors:
   - Go to your deployment
   - Click **View Function Logs**

## Common Vercel Deployment Issues

### Issue: "PrismaClientInitializationError"

**Solution:** Make sure both `DATABASE_URL` and `DIRECT_URL` are set in Vercel environment variables.

### Issue: "Can't reach database server"

**Solution:**

- Verify your connection strings are correct
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check there are no extra spaces in the environment variables

### Issue: "Error: Prisma Client not generated"

**Solution:** This should be fixed by the `vercel.json` configuration, but if it still happens:

1. Make sure `package.json` has: `"postinstall": "prisma generate"`
2. Redeploy

### Issue: "SSL connection required"

**Solution:** Supabase requires SSL. Make sure your connection string includes all parameters as shown above.

### Issue: Build succeeds but runtime fails

**Solution:**

- You might be using `DIRECT_URL` in your app code
- Check `src/lib/prisma.ts` - it should use `DATABASE_URL`
- `DIRECT_URL` is only for migrations

## Vercel Configuration Files

### vercel.json

This ensures Prisma generates before building:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs"
}
```

### package.json scripts

```json
{
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

The `postinstall` hook ensures Prisma generates on Vercel automatically.

## Database Management on Vercel

### View Your Data

Use Supabase dashboard:

1. Go to your Supabase project
2. Click **Table Editor**
3. Select `formulas` table

### Edit Data

Use Prisma Studio locally:

```bash
npm run db:studio
```

### Run Migrations

Migrations should be run locally, then committed:

```bash
# Local only
npm run db:migrate

# Commit the migration files
git add prisma/migrations
git commit -m "Add new migration"
git push
```

On Vercel, migrations are applied automatically via `postinstall` hook.

## Environment Variables Checklist

Make sure these are set in Vercel:

- [x] `DATABASE_URL` - Session mode connection (port 6543, with pgbouncer)
- [x] `DIRECT_URL` - Direct connection (port 5432, no pgbouncer)

Both should be available in:

- [x] Production
- [x] Preview
- [x] Development

## Monitoring Your Deployment

### Check Logs

1. Go to Vercel project → **Deployments**
2. Click on a deployment
3. Click **View Function Logs**
4. Look for any Prisma or database errors

### Test Your API Routes

```bash
# Test search endpoint
curl https://your-app.vercel.app/api/search

# Should return either formulas or "No formulas found"
```

## Production Best Practices

### 1. Connection Pooling

✅ Already configured via `?pgbouncer=true` in DATABASE_URL

### 2. Use Supabase Connection Pooling

- Session mode (port 6543) handles concurrent connections
- Don't use Direct mode (port 5432) in production code

### 3. Database Backups

- Supabase automatically backs up your database daily
- Upgrade to Pro for point-in-time recovery

### 4. Monitor Usage

- Check Supabase dashboard for:
  - Database size
  - Number of connections
  - Query performance

## Scaling Considerations

### Free Tier Limits (Supabase)

- 500MB database storage
- 2GB bandwidth per month
- Unlimited API requests
- Direct database connections: 60
- Pooled connections: 200

### Upgrading

If you hit limits:

1. Go to Supabase project → **Settings** → **Billing**
2. Upgrade to Pro ($25/month):
   - 8GB database
   - 50GB bandwidth
   - Daily backups
   - Point-in-time recovery

## Next Steps

1. ✅ Set environment variables in Vercel
2. ✅ Push schema to Supabase (`npm run db:push`)
3. ✅ Deploy to Vercel (git push or vercel CLI)
4. ✅ Verify deployment works
5. 🎉 Your app is live!

## Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Prisma Vercel Guide:** [prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## Quick Commands Reference

```bash
# Local development
npm run dev

# Push schema to Supabase
npm run db:push

# Create migration
npm run db:migrate

# Open database GUI
npm run db:studio

# Build locally (test before deploying)
npm run build

# Deploy to Vercel
git push
```
