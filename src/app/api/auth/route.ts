import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

type User = {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  createdAt: string;
  lastLogin: string;
};

// Fallback in-memory user storage when Supabase is not configured
const fallbackUsers: User[] = [];

// Helper function to generate verification token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Helper function to hash password
const hashPassword = async (password: string) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to compare password
const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Helper function to validate email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone
const isValidPhone = (phone: string) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Helper function to check rate limiting
const checkRateLimit = async (identifier: string, type: 'email' | 'phone' | 'login') => {
  if (!supabase) return true; // Skip rate limiting if no database
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data: attempts } = await supabase
    .from('verification_attempts')
    .select('*')
    .eq('email', identifier)
    .eq('attempt_type', type)
    .gte('created_at', oneHourAgo);
  
  const maxAttempts = type === 'login' ? 5 : 3;
  return (attempts?.length || 0) < maxAttempts;
};

// Helper function to record attempt
const recordAttempt = async (identifier: string, type: 'email' | 'phone' | 'login', request: NextRequest) => {
  if (!supabase) return;
  
  await supabase
    .from('verification_attempts')
    .insert({
      email: identifier,
      attempt_type: type,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    });
};

const handleFallbackAuth = async (name: string, password: string, email?: string) => {
  // Find existing user
  const existingUser = fallbackUsers.find(user => user.name === name);
  
  if (existingUser) {
    // Verify password
    const isValid = await comparePassword(password, existingUser.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login
    existingUser.lastLogin = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      user: {
        id: existingUser.name, // Use name as ID for fallback
        name: existingUser.name,
        email: existingUser.email,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        emailVerified: true // Assume verified for fallback
      }
    });
  } else {
    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    fallbackUsers.push(newUser);
    
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.name, // Use name as ID for fallback
        name: newUser.name,
        email: newUser.email,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        emailVerified: true // Assume verified for fallback
      }
    });
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password, email, phone, action } = body;

    // Input validation
    if (!name || !password) {
      return NextResponse.json(
        { error: 'Name and password are required' },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      // Check rate limiting
      const canAttempt = await checkRateLimit(email || name, 'login');
      if (!canAttempt) {
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' },
          { status: 429 }
        );
      }

      if (supabase) {
        console.log('Attempting to authenticate with Supabase...');
        
        // Use Supabase if configured
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('name', name)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Supabase fetch error:', fetchError);
          
          // If table doesn't exist, use fallback
          if (fetchError.code === '42P01') {
            console.log('Users table not found, using fallback');
            return handleFallbackAuth(name, password, email);
          }
          
          return NextResponse.json(
            { error: 'Authentication failed', details: fetchError.message },
            { status: 500 }
          );
        }

        let user;
        if (!existingUser) {
          console.log('Creating new user in Supabase...');
          
          // Generate verification token
          const verificationToken = generateToken();
          const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          
          // Hash password
          const hashedPassword = await hashPassword(password);
          
          // Create new user
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{
              name,
              email,
              phone,
              password: hashedPassword,
              verification_token: verificationToken,
              verification_expires: verificationExpires.toISOString(),
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
            }])
            .select()
            .single();

          if (insertError) {
            console.error('Supabase insert error:', insertError);
            
            // If table doesn't exist, use fallback
            if (insertError.code === '42P01') {
              console.log('Users table not found, using fallback');
              return handleFallbackAuth(name, password, email);
            }
            
            // Handle unique constraint violations
            if (insertError.code === '23505') {
              if (insertError.message.includes('email')) {
                return NextResponse.json(
                  { error: 'An account with this email already exists. Please sign in instead.' },
                  { status: 409 }
                );
              } else if (insertError.message.includes('name')) {
                return NextResponse.json(
                  { error: 'This username is already taken. Please choose a different name.' },
                  { status: 409 }
                );
              }
            }
            
            return NextResponse.json(
              { error: 'Failed to create user', details: insertError.message },
              { status: 500 }
            );
          }
          user = newUser;
          
          // Send verification email if email provided
          if (email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
              await sendVerificationEmail(email, verificationToken, name);
              console.log('Verification email sent');
            } catch (emailError) {
              console.error('Failed to send verification email:', emailError);
              // Don't fail the registration if email fails
            }
          }
        } else {
          console.log('Updating existing user in Supabase...');
          
          // Check if account is locked
          if (existingUser.locked_until && new Date(existingUser.locked_until) > new Date()) {
            return NextResponse.json(
              { error: 'Account is temporarily locked due to too many failed attempts' },
              { status: 423 }
            );
          }
          
          // Verify password
          const isValidPassword = await comparePassword(password, existingUser.password);
          if (!isValidPassword) {
            // Increment failed login attempts
            const failedAttempts = (existingUser.failed_login_attempts || 0) + 1;
            const lockedUntil = failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // Lock for 15 minutes
            
            await supabase
              .from('users')
              .update({ 
                failed_login_attempts: failedAttempts,
                locked_until: lockedUntil?.toISOString()
              })
              .eq('id', existingUser.id);
            
            await recordAttempt(email || name, 'login', request);
            
            return NextResponse.json(
              { error: 'Invalid credentials' },
              { status: 401 }
            );
          }
          
          // Reset failed login attempts on successful login
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ 
              last_login: new Date().toISOString(),
              failed_login_attempts: 0,
              locked_until: null
            })
            .eq('name', name)
            .select()
            .single();

          if (updateError) {
            console.error('Supabase update error:', updateError);
            return NextResponse.json(
              { error: 'Authentication failed', details: updateError.message },
              { status: 500 }
            );
          }
          user = updatedUser;
        }

        console.log('Successfully authenticated with Supabase');
        
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            emailVerified: user.email_verified,
            phoneVerified: user.phone_verified
          }
        });
      } else {
        console.log('Supabase not configured, using fallback');
        return handleFallbackAuth(name, password, email);
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 