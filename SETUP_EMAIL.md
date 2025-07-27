# Email Setup Guide for Eggconomy

## Step 1: Create/Update your `.env.local` file

Add these lines to your `.env.local` file in the root of your project:

```bash
# Your existing Supabase config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NEW: Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Set up Gmail App Password

1. **Go to your Google Account settings**: https://myaccount.google.com/
2. **Enable 2-Factor Authentication** if not already enabled
3. **Go to Security → App passwords**
4. **Generate a new app password**:
   - Select "Mail" as the app
   - Select "Other" as device
   - Name it "Eggconomy"
   - Copy the 16-character password

## Step 3: Update your .env.local

Replace `your_app_specific_password` with the 16-character password from Google.

## Example .env.local:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ikrcjlngfamnlgrnmlod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcmNqbG5nZmFtbmxncm5tbG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Njg0MTUsImV4cCI6MjA2OTE0NDQxNX0.eH2Y7RwMjKg15AA5QJ5OCnAQkfE7hFx6VOzIx5irdcY

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Alternative Email Services

If you don't want to use Gmail, you can use:

### SendGrid (Recommended for production):
```bash
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

### Outlook/Hotmail:
```bash
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

## Testing Email Verification

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Sign up with an email** on the login page

3. **Check your email** for the verification link

4. **Click the verification link** to verify your account

## Troubleshooting

- **"Authentication failed"**: Check your app password is correct
- **"Email not sending"**: Make sure 2FA is enabled on your Google account
- **"Invalid credentials"**: Double-check the EMAIL_USER and EMAIL_PASS values

## Security Note

Never commit your `.env.local` file to git! It should already be in your `.gitignore` file. 