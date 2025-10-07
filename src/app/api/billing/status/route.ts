/**
 * Next.js API Route for Subscription Status
 * Returns current subscription status and usage
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the customer ID from the authenticated user
    // For demo purposes, we'll simulate subscription data
    
    const mockSubscriptionStatus = {
      plan_id: 'growth_team',
      status: 'active' as const,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usage: {
        users: 2,
        storage_gb: 12,
        api_calls_month: 8500,
        campaigns: 15,
      },
      billing_info: {
        next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 150,
        payment_method: 'Visa ending in 4242',
      },
    };

    return NextResponse.json(mockSubscriptionStatus);

  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}