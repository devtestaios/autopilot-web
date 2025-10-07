/**
 * Next.js API Route for Stripe Checkout
 * Creates checkout sessions for subscription plans
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if API key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

interface CheckoutRequest {
  price_id: string;
  billing_period: 'monthly' | 'annual';
  success_url?: string;
  cancel_url?: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.' },
        { status: 503 }
      );
    }

    const body: CheckoutRequest = await request.json();
    const { price_id, success_url, cancel_url, metadata } = body;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: success_url || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkout=success`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?checkout=cancelled`,
      metadata: metadata || {},
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
      subscription_data: {
        metadata: metadata || {},
      },
    });

    return NextResponse.json({ 
      checkout_url: session.url,
      session_id: session.id 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}