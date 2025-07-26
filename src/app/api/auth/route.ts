import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type User = {
  name: string;
  password: string;
  createdAt: string;
  lastLogin: string;
};

// Fallback in-memory user storage when Supabase is not configured
const fallbackUsers: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password, action } = body;

    if (action === 'login') {
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
            return handleFallbackAuth(name, password);
          }
          
          return NextResponse.json(
            { error: 'Authentication failed', details: fetchError.message },
            { status: 500 }
          );
        }

        let user;
        if (!existingUser) {
          console.log('Creating new user in Supabase...');
          // Create new user
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{
              name,
              password, // In production, hash this password!
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
              return handleFallbackAuth(name, password);
            }
            
            return NextResponse.json(
              { error: 'Failed to create user', details: insertError.message },
              { status: 500 }
            );
          }
          user = newUser;
        } else {
          console.log('Updating existing user in Supabase...');
          // Update last login
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
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
            name: user.name,
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
          }
        });
      } else {
        console.log('Supabase not configured, using fallback');
        return handleFallbackAuth(name, password);
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function handleFallbackAuth(name: string, password: string) {
  let user = fallbackUsers.find(u => u.name === name);
  
  if (!user) {
    // Create new user
    user = {
      name,
      password, // In production, hash this password!
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    fallbackUsers.push(user);
  } else {
    // Update last login
    user.lastLogin = new Date().toISOString();
  }

  return NextResponse.json({
    success: true,
    user: {
      name: user.name,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    }
  });
} 