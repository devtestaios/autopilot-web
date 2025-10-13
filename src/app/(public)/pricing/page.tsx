'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
// NavigationTabs removed - using root layout Navigation instead
import { 
  CheckCircle,
  Star,
  Users,
  Building,
  Crown,
  Sparkles,
  Timer,
  ArrowRight,
  Zap,
  Shield,
  Infinity,
  TrendingUp,
  Target,
  Brain,
  Rocket,
  Heart,
  Trophy,
  DollarSign,
  Calendar,
  Mail,
  MessageSquare,
  BarChart3,
  Globe,
  Settings,
  Cpu,
  Database,
  Headphones,
  Award
} from 'lucide-react';

// ✅ DATABASE CONNECTED: Import pricing data from enterprise API
import { SUBSCRIPTION_PLANS as API_PLANS } from '@/lib/enterpriseAPI';

// Transform enterprise API data to pricing page format
const SUBSCRIPTION_PLANS = API_PLANS.map(plan => ({
  id: plan.id,
  name: plan.name,
  description: plan.description,
  price: plan.price_monthly,
  billingPeriod: 'month',
  maxUsers: plan.limits.users,
  features: plan.features,
  limitations: plan.id === 'trial' ? '14-day trial period' : 
               plan.id === 'solo_professional' ? 'Single user only' :
               plan.id === 'growth_team' ? 'Up to 5 team members' :
               plan.id === 'professional_agency' ? 'Up to 15 team members' :
               plan.id === 'enterprise' ? 'Up to 50 team members' :
               'Unlimited users',
  isPopular: plan.id === 'growth_team',
  badge: plan.id === 'trial' ? 'Start Here' :
         plan.id === 'solo_professional' ? 'Starter' :
         plan.id === 'growth_team' ? 'Most Popular' :
         plan.id === 'professional_agency' ? 'Agency' :
         plan.id === 'enterprise' ? 'Enterprise' :
         'White Glove',
  color: plan.id === 'trial' ? 'gray' :
         plan.id === 'solo_professional' ? 'blue' :
         plan.id === 'growth_team' ? 'green' :
         plan.id === 'professional_agency' ? 'purple' :
         plan.id === 'enterprise' ? 'indigo' :
         'gold',
  ctaText: plan.id === 'trial' ? 'Start Free Trial' :
           plan.id === 'solo_professional' ? 'Choose Starter' :
           plan.id === 'growth_team' ? 'Start Growing' :
           plan.id === 'professional_agency' ? 'Scale Agency' :
           plan.id === 'enterprise' ? 'Go Enterprise' :
           'Talk to Specialist',
  enterprise: plan.id === 'enterprise' || plan.id === 'enterprise_plus',
  customPricing: plan.custom_pricing || false,
  contactSales: plan.contact_sales || false
}));

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('growth_team');
  const { initiateCheckout, getStripePriceId, isLoading, error } = useStripeCheckout();

  const handlePlanSelect = async (planId: string, planName: string) => {
    if (planId === 'trial') {
      // Direct signup for trial
      window.location.href = '/signup?plan=trial';
      return;
    }

    if (planId === 'enterprise_plus') {
      // Enhanced contact sales for white glove enterprise
      window.location.href = '/contact?plan=enterprise_plus&type=white_glove&utm_source=pricing_page';
      return;
    }

    // Stripe checkout for paid plans
    const priceId = getStripePriceId(planId, isAnnual);
    await initiateCheckout({
      priceId,
      planName,
      isAnnual,
    });
  };

  const getPrice = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    const price = plan.price;
    if (isAnnual && price > 0) {
      return Math.floor(price * 10); // 2 months free annually
    }
    return price;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      gray: 'border-gray-300 dark:border-gray-600',
      blue: 'border-blue-300 dark:border-blue-600',
      green: 'border-green-300 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-800',
      purple: 'border-purple-300 dark:border-purple-600',
      indigo: 'border-indigo-300 dark:border-indigo-600',
      gold: 'border-yellow-300 dark:border-yellow-600'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getBadgeClasses = (color: string) => {
    const badges = {
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
      gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
    };
    return badges[color as keyof typeof badges] || badges.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300">
              <DollarSign className="w-4 h-4 mr-1" />
              Transparent Pricing • No Hidden Fees
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Simple Pricing.
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Maximum Value.</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Start with a risk-free 15-day trial, then choose the plan that grows with your business. 
              Most companies save 60% compared to managing separate tools.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg ${!isAnnual ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-teal-600"
              />
              <span className={`text-lg ${isAnnual ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                Annual
                <Badge className="ml-2 bg-green-100 text-green-700 text-xs">Save 17%</Badge>
              </span>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-green-500" />
                <span>15-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>30-day money back</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${plan.isPopular ? 'lg:col-span-1 xl:col-span-2' : 'lg:col-span-1 xl:col-span-1'}`}
              >
                <Card className={`h-full relative overflow-hidden ${getColorClasses(plan.color)} ${plan.isPopular ? 'shadow-xl scale-105' : 'shadow-lg hover:shadow-xl'} transition-all duration-300`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-teal-500 text-white text-center py-2 text-sm font-semibold">
                      ⭐ Most Popular Choice
                    </div>
                  )}
                  
                  <CardHeader className={`${plan.isPopular ? 'pt-12' : 'pt-6'} pb-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getBadgeClasses(plan.color)}>
                        {plan.badge}
                      </Badge>
                      {plan.enterprise && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="mb-4">
                      {plan.customPricing ? (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Custom Pricing
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tailored to your organization's needs
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              ${getPrice(plan)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              /{isAnnual ? 'year' : 'month'}
                            </span>
                          </div>
                          {isAnnual && plan.price > 0 && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              Save ${plan.price * 2}/year
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {plan.maxUsers ? `Up to ${plan.maxUsers} user${plan.maxUsers > 1 ? 's' : ''}` : 'Unlimited users'}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                      <Button 
                        onClick={() => handlePlanSelect(plan.id, plan.name)}
                        disabled={isLoading}
                        className={`w-full mb-6 ${
                          plan.isPopular 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : plan.contactSales
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg'
                            : plan.enterprise
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        size="lg"
                      >
                        {isLoading ? 'Processing...' : plan.ctaText}
                        {!isLoading && (
                          plan.contactSales ? (
                            <Headphones className="w-4 h-4 ml-2" />
                          ) : (
                            <ArrowRight className="w-4 h-4 ml-2" />
                          )
                        )}
                      </Button>                    {error && (
                      <div className="text-red-500 text-sm mb-4 text-center">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        Everything included:
                      </h4>
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {plan.limitations}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Comparison */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why PulseBridge Pays for Itself
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stop paying for 15+ separate tools. One platform replaces them all.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Before PulseBridge */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                ❌ The Old Way (Per Month)
              </h3>
              <div className="space-y-3">
                {[
                  { tool: 'HubSpot CRM', price: '$50' },
                  { tool: 'Mailchimp Pro', price: '$35' },
                  { tool: 'Hootsuite Business', price: '$99' },
                  { tool: 'Slack Pro', price: '$12.50' },
                  { tool: 'Zoom Pro', price: '$19.99' },
                  { tool: 'Asana Business', price: '$24.99' },
                  { tool: 'Google Ads Management', price: '$200' },
                  { tool: 'Canva Pro', price: '$15' },
                  { tool: 'Analytics Tools', price: '$49' },
                  { tool: 'Integration Tools', price: '$99' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">{item.tool}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-4 text-xl font-bold border-t-2 border-red-200">
                  <span className="text-red-700 dark:text-red-400">Total Monthly Cost:</span>
                  <span className="text-red-700 dark:text-red-400">$604.48</span>
                </div>
                <div className="text-red-600 dark:text-red-400 text-sm">
                  + Setup time, training costs, data silos, integration headaches
                </div>
              </div>
            </div>

            {/* With PulseBridge */}
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
                ✅ The PulseBridge Way
              </h3>
              <div className="space-y-3">
                <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      PulseBridge Growth Team
                    </span>
                    <span className="text-2xl font-bold text-green-600">$150</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div>✓ All CRM features</div>
                    <div>✓ Advanced email marketing</div>
                    <div>✓ Social media management</div>
                    <div>✓ Team collaboration</div>
                    <div>✓ Video conferencing</div>
                    <div>✓ Project management</div>
                    <div>✓ Campaign automation</div>
                    <div>✓ Design studio</div>
                    <div>✓ Business intelligence</div>
                    <div>✓ 200+ integrations</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-4 text-xl font-bold border-t-2 border-green-200">
                  <span className="text-green-700 dark:text-green-400">Total Monthly Cost:</span>
                  <span className="text-green-700 dark:text-green-400">$150</span>
                </div>
                
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <div className="text-green-800 dark:text-green-300 font-bold text-lg mb-2">
                    💰 Monthly Savings: $454.48
                  </div>
                  <div className="text-green-700 dark:text-green-400 text-sm">
                    💪 Annual Savings: $5,453.76
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-sm mt-2">
                    + Unified data, instant setup, included training, 24/7 support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Pricing Questions Answered
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                q: "What happens after the 15-day trial?",
                a: "You can continue with any paid plan or your account will be paused. No automatic charges, no credit card required for trial."
              },
              {
                q: "Can I change plans anytime?",
                a: "Yes! Upgrade or downgrade anytime. Changes take effect immediately, and we'll pro-rate billing fairly."
              },
              {
                q: "What's included in the trial?",
                a: "Everything. Full access to all features, no limitations. Experience the complete platform before deciding."
              },
              {
                q: "Do you offer custom enterprise pricing?",
                a: "Yes! Enterprise Plus plans are fully customizable. Contact our sales team for volume discounts and custom features."
              },
              {
                q: "Is there a setup fee?",
                a: "Never. Setup is free, onboarding is included, and our team helps you migrate data at no extra cost."
              },
              {
                q: "What if I need more users?",
                a: "Easy! Add users anytime for a prorated amount. Enterprise plans offer unlimited users with custom pricing."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Save $5,000+ Per Year?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Join 2,500+ companies that chose growth over status quo. 
              Start your risk-free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-xl"
                >
                  <Timer className="w-5 h-5 mr-2" />
                  Start 15-Day Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-teal-600 px-6 py-4"
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  Talk to Sales
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-teal-100 text-sm">
              ✓ No credit card required ✓ Full feature access ✓ Cancel anytime ✓ 30-day money back
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}