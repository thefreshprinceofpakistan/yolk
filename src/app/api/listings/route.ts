import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type Listing = {
  id: string;
  name: string;
  quantity: number;
  exchangeType: 'gift' | 'barter' | 'cash' | 'hybrid';
  location: string;
  notes?: string;
  datePosted: string;
  barterFor?: string;
  suggestedCash?: string;
  paymentHandles?: {
    venmo?: string;
    paypal?: string;
  };
};

// Fallback in-memory storage when Supabase is not configured
const fallbackListings: Listing[] = [
  {
    id: '1',
    name: 'Sarah from Berea',
    quantity: 12,
    exchangeType: 'gift',
    location: 'Berea, KY',
    notes: 'Fresh from our backyard hens! Laid this morning.',
    datePosted: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mike\'s Farm',
    quantity: 24,
    exchangeType: 'barter',
    barterFor: 'Fresh vegetables or homemade bread',
    location: 'Richmond, KY',
    notes: 'Organic, free-range eggs. Looking to trade for garden produce.',
    datePosted: '2024-01-14',
  },
  {
    id: '3',
    name: 'Granny Betty',
    quantity: 6,
    exchangeType: 'cash',
    suggestedCash: '$3/dozen',
    paymentHandles: {
      venmo: '@grannybetty',
    },
    location: 'Berea, KY',
    notes: 'Small batch, very fresh. Perfect for baking!',
    datePosted: '2024-01-13',
  },
];

export async function GET() {
  try {
    if (supabase) {
      console.log('Attempting to fetch from Supabase...');
      
      // Use Supabase if configured
      const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .order('date_posted', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        
        // If table doesn't exist, return fallback data
        if (error.code === '42P01') { // Table doesn't exist
          console.log('Table not found, using fallback data');
          return NextResponse.json({ listings: fallbackListings });
        }
        
        return NextResponse.json(
          { error: 'Failed to fetch listings', details: error.message },
          { status: 500 }
        );
      }

      console.log('Successfully fetched from Supabase:', listings?.length || 0, 'listings');
      return NextResponse.json({ listings: listings || [] });
    } else {
      console.log('Supabase not configured, using fallback data');
      // Fallback to in-memory storage
      return NextResponse.json({ listings: fallbackListings });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newListing = {
      ...body,
      date_posted: new Date().toISOString().split('T')[0],
    };
    
    if (supabase) {
      console.log('Attempting to save to Supabase...');
      
      // Use Supabase if configured
      const { data, error } = await supabase
        .from('listings')
        .insert([newListing])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // If table doesn't exist, save to fallback
        if (error.code === '42P01') {
          console.log('Table not found, saving to fallback');
          const fallbackListing = {
            ...newListing,
            id: Date.now().toString(),
          };
          fallbackListings.unshift(fallbackListing);
          
          return NextResponse.json({ 
            success: true, 
            listing: fallbackListing 
          }, { status: 201 });
        }
        
        return NextResponse.json(
          { error: 'Failed to create listing', details: error.message },
          { status: 500 }
        );
      }
      
      console.log('Successfully saved to Supabase');
      return NextResponse.json({ 
        success: true, 
        listing: data 
      }, { status: 201 });
    } else {
      console.log('Supabase not configured, saving to fallback');
      // Fallback to in-memory storage
      const fallbackListing = {
        ...newListing,
        id: Date.now().toString(),
      };
      fallbackListings.unshift(fallbackListing);
      
      return NextResponse.json({ 
        success: true, 
        listing: fallbackListing 
      }, { status: 201 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to create listing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 