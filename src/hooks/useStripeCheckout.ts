/**
 * Custom hook for Stripe Checkout integration with pricing page
 * Connects frontend pricing tiers to backend billing system
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutOptions {
  priceId: string;
  planName: string;
  isAnnual?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const initiateCheckout = async (options: CheckoutOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const { priceId, planName, isAnnual = false, successUrl, cancelUrl } = options;
      
      // Call your billing API endpoint
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          billing_period: isAnnual ? 'annual' : 'monthly',
          success_url: successUrl || `${window.location.origin}/dashboard?checkout=success&plan=${planName}`,
          cancel_url: cancelUrl || `${window.location.origin}/pricing?checkout=cancelled`,
          metadata: {
            plan_name: planName,
            billing_period: isAnnual ? 'annual' : 'monthly',
            source: 'pricing_page'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkout_url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = checkout_url;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const getStripePriceId = (planId: string, isAnnual: boolean): string => {
    // Map your subscription plan IDs to Stripe price IDs
    const priceMap = {
      // Monthly prices
      solo_professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO_MONTHLY || 'price_solo_monthly',
      growth_team: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_MONTHLY || 'price_growth_monthly', 
      professional_agency: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_MONTHLY || 'price_agency_monthly',
      enterprise: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
      enterprise_plus: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_PLUS_MONTHLY || 'price_enterprise_plus_monthly',
      
      // Annual prices (if different)
      solo_professional_annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO_ANNUAL || 'price_solo_annual',
      growth_team_annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_ANNUAL || 'price_growth_annual',
      professional_agency_annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_ANNUAL || 'price_agency_annual', 
      enterprise_annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL || 'price_enterprise_annual',
      enterprise_plus_annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_PLUS_ANNUAL || 'price_enterprise_plus_annual',
    };

    const key = isAnnual ? `${planId}_annual` : planId;
    return priceMap[key as keyof typeof priceMap] || priceMap[planId as keyof typeof priceMap];
  };

  return {
    initiateCheckout,
    getStripePriceId,
    isLoading,
    error,
  };
}