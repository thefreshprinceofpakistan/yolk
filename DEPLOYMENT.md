# Eggconomy Deployment Guide

## Backend Setup Options

### Option 1: Supabase (Recommended for MVP)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up and create a new project
   - Note your project URL and anon key

2. **Set Up Database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL commands from `database-setup.sql`

3. **Configure Environment Variables**
   - Create a `.env.local` file in your project root
   - Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Test Locally**
   ```bash
   npm run dev
   ```

### Option 2: PlanetScale (Alternative)

1. **Create PlanetScale Account**
   - Go to [planetscale.com](https://planetscale.com)
   - Create a new database
   - Get your connection string

2. **Install Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

3. **Configure Database Schema**
   - Update `prisma/schema.prisma` with your schema
   - Run `npx prisma db push`

### Option 3: Vercel + PostgreSQL

1. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Vercel will auto-deploy your Next.js app

2. **Add PostgreSQL Database**
   - In Vercel dashboard, go to Storage
   - Create a new PostgreSQL database
   - Add the connection string to environment variables

## Deployment Steps

### 1. Prepare Your Code
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally
npm run dev
```

### 2. Deploy to Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to connect your GitHub repo
```

### 3. Set Environment Variables in Production
- Go to your Vercel dashboard
- Navigate to Settings > Environment Variables
- Add your database credentials

### 4. Custom Domain (Optional)
- In Vercel dashboard, go to Settings > Domains
- Add your custom domain
- Update DNS settings with your domain provider

## Security Considerations

### For Production:
1. **Password Hashing**
   - Install bcrypt: `npm install bcrypt`
   - Hash passwords before storing in database

2. **Input Validation**
   - Add validation for all form inputs
   - Sanitize user data

3. **Rate Limiting**
   - Install rate limiting middleware
   - Prevent abuse of your API

4. **HTTPS**
   - Vercel provides HTTPS by default
   - Ensure all API calls use HTTPS

## Monitoring & Analytics

### 1. Error Tracking
- Set up Sentry for error monitoring
- Monitor API errors and user feedback

### 2. Analytics
- Add Google Analytics or Plausible
- Track user engagement and listings

### 3. Database Monitoring
- Monitor database performance
- Set up alerts for high usage

## Scaling Considerations

### When to Scale:
- 100+ daily active users
- 1000+ listings
- Multiple locations/communities

### Scaling Options:
1. **Database**: Upgrade to paid Supabase plan
2. **CDN**: Add image optimization and caching
3. **Caching**: Implement Redis for frequently accessed data
4. **Search**: Add full-text search with Elasticsearch

## Maintenance

### Regular Tasks:
1. **Backup Database**: Set up automated backups
2. **Update Dependencies**: Keep packages updated
3. **Monitor Performance**: Check loading times and errors
4. **User Feedback**: Collect and address user issues

### Emergency Procedures:
1. **Database Issues**: Check Supabase status page
2. **Deployment Issues**: Rollback to previous version in Vercel
3. **Security Issues**: Immediately rotate API keys

## Support & Documentation

### For Users:
- Create a simple FAQ page
- Add contact form for support
- Document how to use the platform

### For Developers:
- Document API endpoints
- Create contribution guidelines
- Set up development environment guide 