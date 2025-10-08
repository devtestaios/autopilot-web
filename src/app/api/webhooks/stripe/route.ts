/**
 * Stripe Webhook Handler
 * Processes subscription events from Stripe and saves to Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe only if API key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  
  try {
    // Log webhook event
    await supabase.from('stripe_webhook_events').insert({
      stripe_event_id: `checkout_${session.id}`,
      event_type: 'checkout.session.completed',
      raw_data: session,
      processed: false
    });

    // Create or update customer in database
    if (session.customer && typeof session.customer === 'string') {
      const customerData = {
        stripe_customer_id: session.customer,
        email: session.customer_details?.email || '',
        name: session.customer_details?.name || '',
        phone: session.customer_details?.phone || '',
        address: session.customer_details?.address || {},
        metadata: session.metadata || {}
      };

      await supabase.from('stripe_customers')
        .upsert(customerData, { 
          onConflict: 'stripe_customer_id',
          ignoreDuplicates: false 
        });

      console.log('Customer created/updated:', session.customer);
    }

    // Mark event as processed
    await supabase.from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', `checkout_${session.id}`);

  } catch (error) {
    console.error('Error handling checkout completed:', error);
    
    // Log error in webhook events
    await supabase.from('stripe_webhook_events')
      .update({ 
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('stripe_event_id', `checkout_${session.id}`);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  try {
    // Log webhook event
    await supabase.from('stripe_webhook_events').insert({
      stripe_event_id: `sub_created_${subscription.id}`,
      event_type: 'customer.subscription.created',
      raw_data: subscription,
      processed: false
    });

    // Get plan details
    const priceId = subscription.items.data[0]?.price.id;
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('stripe_price_id', priceId)
      .single();

    // Create subscription record
    const subscriptionData = {
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      plan_id: plan?.id || null,
      status: subscription.status,
      current_period_start: (subscription as any).current_period_start ? new Date((subscription as any).current_period_start * 1000).toISOString() : null,
      current_period_end: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
      trial_start: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000).toISOString() : null,
      trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      canceled_at: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000).toISOString() : null,
      ended_at: (subscription as any).ended_at ? new Date((subscription as any).ended_at * 1000).toISOString() : null,
      metadata: subscription.metadata || {}
    };

    await supabase.from('subscriptions').insert(subscriptionData);

    // Mark event as processed
    await supabase.from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', `sub_created_${subscription.id}`);

    console.log('Subscription saved to database:', subscription.id);

  } catch (error) {
    console.error('Error handling subscription created:', error);
    
    await supabase.from('stripe_webhook_events')
      .update({ 
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('stripe_event_id', `sub_created_${subscription.id}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  try {
    // Log webhook event
    await supabase.from('stripe_webhook_events').insert({
      stripe_event_id: `sub_updated_${subscription.id}`,
      event_type: 'customer.subscription.updated',
      raw_data: subscription,
      processed: false
    });

    // Get plan details
    const priceId = subscription.items.data[0]?.price.id;
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('stripe_price_id', priceId)
      .single();

    // Update subscription record
    const subscriptionData = {
      plan_id: plan?.id || null,
      status: subscription.status,
      current_period_start: (subscription as any).current_period_start ? new Date((subscription as any).current_period_start * 1000).toISOString() : null,
      current_period_end: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
      trial_start: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000).toISOString() : null,
      trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      canceled_at: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000).toISOString() : null,
      ended_at: (subscription as any).ended_at ? new Date((subscription as any).ended_at * 1000).toISOString() : null,
      metadata: subscription.metadata || {},
      updated_at: new Date().toISOString()
    };

    await supabase.from('subscriptions')
      .update(subscriptionData)
      .eq('stripe_subscription_id', subscription.id);

    // Mark event as processed
    await supabase.from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', `sub_updated_${subscription.id}`);

    console.log('Subscription updated in database:', subscription.id);

  } catch (error) {
    console.error('Error handling subscription updated:', error);
    
    await supabase.from('stripe_webhook_events')
      .update({ 
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('stripe_event_id', `sub_updated_${subscription.id}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  try {
    // Log webhook event
    await supabase.from('stripe_webhook_events').insert({
      stripe_event_id: `sub_deleted_${subscription.id}`,
      event_type: 'customer.subscription.deleted',
      raw_data: subscription,
      processed: false
    });

    // Update subscription status to canceled and set ended_at
    await supabase.from('subscriptions')
      .update({ 
        status: 'canceled',
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    // Mark event as processed
    await supabase.from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', `sub_deleted_${subscription.id}`);

    console.log('Subscription marked as deleted in database:', subscription.id);

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    
    await supabase.from('stripe_webhook_events')
      .update({ 
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('stripe_event_id', `sub_deleted_${subscription.id}`);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);
  
  try {
    // Log webhook event
    await supabase.from('stripe_webhook_events').insert({
      stripe_event_id: `payment_succeeded_${invoice.id}`,
      event_type: 'invoice.payment_succeeded',
      raw_data: invoice,
      processed: false
    });

    // Get subscription ID if this invoice is for a subscription
    let subscriptionId = null;
    if ((invoice as any).subscription) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('stripe_subscription_id', (invoice as any).subscription as string)
        .single();
      subscriptionId = subscription?.id || null;
    }

    // Create or update invoice record
    const invoiceData = {
      stripe_invoice_id: invoice.id,
      stripe_customer_id: invoice.customer as string,
      subscription_id: subscriptionId,
      amount_due: invoice.amount_due || 0,
      amount_paid: invoice.amount_paid || 0,
      currency: invoice.currency || 'usd',
      status: invoice.status || 'draft',
      invoice_pdf: (invoice as any).invoice_pdf || null,
      hosted_invoice_url: (invoice as any).hosted_invoice_url || null,
      payment_intent_id: (invoice as any).payment_intent as string || null,
      due_date: (invoice as any).due_date ? new Date((invoice as any).due_date * 1000).toISOString() : null,
      paid_at: (invoice as any).status_transitions?.paid_at ? new Date((invoice as any).status_transitions.paid_at * 1000).toISOString() : null,
      metadata: invoice.metadata || {}
    };

    await supabase.from('invoices')
      .upsert(invoiceData, { 
        onConflict: 'stripe_invoice_id',
        ignoreDuplicates: false 
      });

    // Mark event as processed
    await supabase.from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', `payment_succeeded_${invoice.id}`);

    console.log('Payment success recorded in database:', invoice.id);

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
    
    await supabase.from('stripe_webhook_events')
      .update({ 
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('stripe_event_id', `payment_succeeded_${invoice.id}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);
  
  try {
    // Log webhook event
    await supabase.from('stripe_webhook_events').insert({
      stripe_event_id: `payment_failed_${invoice.id}`,
      event_type: 'invoice.payment_failed',
      raw_data: invoice,
      processed: false
    });

    // Get subscription ID if this invoice is for a subscription
    let subscriptionId = null;
    if ((invoice as any).subscription) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('stripe_subscription_id', (invoice as any).subscription as string)
        .single();
      subscriptionId = subscription?.id || null;
    }

    // Create or update invoice record with failed status
    const invoiceData = {
      stripe_invoice_id: invoice.id,
      stripe_customer_id: invoice.customer as string,
      subscription_id: subscriptionId,
      amount_due: invoice.amount_due || 0,
      amount_paid: invoice.amount_paid || 0,
      currency: invoice.currency || 'usd',
      status: 'open', // Failed payments typically remain 'open' for retry
      invoice_pdf: (invoice as any).invoice_pdf || null,
      hosted_invoice_url: (invoice as any).hosted_invoice_url || null,
      payment_intent_id: (invoice as any).payment_intent as string || null,
      due_date: (invoice as any).due_date ? new Date((invoice as any).due_date * 1000).toISOString() : null,
      paid_at: null, // Payment failed, so no paid_at date
      metadata: { ...invoice.metadata, payment_failed: true }
    };

    await supabase.from('invoices')
      .upsert(invoiceData, { 
        onConflict: 'stripe_invoice_id',
        ignoreDuplicates: false 
      });

    // Mark event as processed
    await supabase.from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', `payment_failed_${invoice.id}`);

    console.log('Payment failure recorded in database:', invoice.id);

  } catch (error) {
    console.error('Error handling payment failed:', error);
    
    await supabase.from('stripe_webhook_events')
      .update({ 
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('stripe_event_id', `payment_failed_${invoice.id}`);
  }
}