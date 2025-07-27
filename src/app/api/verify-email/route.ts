import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Find user with this verification token
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    // Check if token has expired
    if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
      return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 });
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Mark email as verified and clear token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_expires: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user verification:', updateError);
      return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully! You can now log in to your account.' 
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 