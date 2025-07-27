import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Get conversations where user is either buyer or seller
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        listing:listings(*),
        buyer:users!conversations_buyer_id_fkey(name),
        seller:users!conversations_seller_id_fkey(name),
        messages:messages(*)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, buyerId, sellerId } = body;

    if (!listingId || !buyerId || !sellerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('listing_id', listingId)
      .eq('buyer_id', buyerId)
      .eq('seller_id', sellerId)
      .single();

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 