/**
 * Stripe Webhook Handler
 * Processes subscription events from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
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
  
  // Update user subscription in your database
  // This would typically involve:
  // 1. Find user by session.customer
  // 2. Update their subscription status
  // 3. Grant access to paid features
  
  // Example database update (implement with your database)
  // await updateUserSubscription({
  //   customerId: session.customer as string,
  //   subscriptionId: session.subscription as string,
  //   status: 'active'
  // });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  // Update user access and features based on subscription
  const priceId = subscription.items.data[0]?.price.id;
  const planId = subscription.metadata.plan_id;
  
  // Grant user access to subscription features
  // await grantSubscriptionAccess({
  //   customerId: subscription.customer as string,
  //   subscriptionId: subscription.id,
  //   planId: planId,
  //   priceId: priceId
  // });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // Handle plan changes, upgrades/downgrades
  const status = subscription.status;
  const planId = subscription.metadata.plan_id;
  
  // Update user access based on new subscription
  // await updateSubscriptionAccess({
  //   customerId: subscription.customer as string,
  //   subscriptionId: subscription.id,
  //   status: status,
  //   planId: planId
  // });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // Revoke user access
  // await revokeSubscriptionAccess({
  //   customerId: subscription.customer as string,
  //   subscriptionId: subscription.id
  // });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);
  
  // Send payment receipt, update billing records
  // await sendPaymentReceipt({
  //   customerId: invoice.customer as string,
  //   amount: invoice.amount_paid,
  //   invoiceId: invoice.id
  // });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);
  
  // Send payment failure notification
  // Handle dunning management
  // await handleFailedPayment({
  //   customerId: invoice.customer as string,
  //   amount: invoice.amount_due,
  //   invoiceId: invoice.id
  // });
}