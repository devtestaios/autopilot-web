// Enhanced Enterprise API Testing Suite  
// Target: Increase enterpriseAPI coverage from 5.33% to 50%+

import { 
  SUBSCRIPTION_PLANS,
  EnterpriseCompanyAPI,
  type SubscriptionPlan,
  type EnterpriseCompany,
  type EnterpriseUser
} from '@/lib/enterpriseAPI';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Enhanced Enterprise API Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Subscription Plans Configuration', () => {
    test('validates complete pricing structure', () => {
      expect(SUBSCRIPTION_PLANS).toHaveLength(6);
      
      const expectedIds = ['trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus'];
      expectedIds.forEach(id => {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === id);
        expect(plan).toBeDefined();
        expect(plan?.name).toBeTruthy();
        expect(typeof plan?.price_monthly).toBe('number');
        expect(plan?.features).toBeInstanceOf(Array);
        expect(plan?.limits).toBeDefined();
      });
    });

    test('validates pricing progression', () => {
      const prices = SUBSCRIPTION_PLANS.map(p => p.price_monthly);
      
      // Verify ascending price order (except trial = 0)
      expect(prices[0]).toBe(0); // trial
      expect(prices[1]).toBe(50); // solo_professional
      expect(prices[2]).toBe(150); // growth_team
      expect(prices[3]).toBe(400); // professional_agency
      expect(prices[4]).toBe(1200); // enterprise
      expect(prices[5]).toBe(2500); // enterprise_plus
    });

    test('validates user limits progression', () => {
      const userLimits = SUBSCRIPTION_PLANS.map(p => p.limits.users);
      
      expect(userLimits[0]).toBe(10); // trial
      expect(userLimits[1]).toBe(1); // solo_professional
      expect(userLimits[2]).toBe(3); // growth_team
      expect(userLimits[3]).toBe(10); // professional_agency
      expect(userLimits[4]).toBe(30); // enterprise
      expect(userLimits[5]).toBe(-1); // enterprise_plus (unlimited)
    });

    test('validates feature inclusion by tier', () => {
      const trialPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'trial');
      const enterprisePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'enterprise');
      
      expect(trialPlan?.features).toContain('Full platform access');
      expect(enterprisePlan?.features).toContain('Enterprise security');
      expect(enterprisePlan?.features.length).toBeGreaterThanOrEqual(trialPlan?.features.length || 0);
    });

    test('validates enterprise features by tier', () => {
      const soloProPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'solo_professional');
      const enterprisePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'enterprise');
      
      expect(soloProPlan?.enterprise_features.sso).toBe(false);
      expect(soloProPlan?.enterprise_features.white_label).toBe(false);
      
      expect(enterprisePlan?.enterprise_features.sso).toBe(true);
      expect(enterprisePlan?.enterprise_features.white_label).toBe(true);
      expect(enterprisePlan?.enterprise_features.dedicated_support).toBe(true);
    });

    test('validates yearly pricing discounts', () => {
      SUBSCRIPTION_PLANS.forEach(plan => {
        if (plan.price_monthly > 0) {
          const expectedYearly = plan.price_monthly * 10; // 2 months free
          expect(plan.price_yearly).toBe(expectedYearly);
        }
      });
    });
  });

  describe('Subscription Plan Utilities', () => {
    test('finds plans by id correctly', () => {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === 'growth_team');
      
      expect(plan).toBeDefined();
      expect(plan?.name).toBe('Growth Team');
      expect(plan?.price_monthly).toBe(150);
      expect(plan?.limits.users).toBe(3);
    });

    test('validates unlimited resources in enterprise_plus', () => {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === 'enterprise_plus');
      
      expect(plan?.limits.users).toBe(-1);
      expect(plan?.limits.storage_gb).toBe(-1);
      expect(plan?.limits.api_calls_month).toBe(-1);
      expect(plan?.limits.campaigns).toBe(-1);
      expect(plan?.limits.social_accounts).toBe(-1);
      expect(plan?.limits.email_contacts).toBe(-1);
    });

    test('validates resource scaling by tier', () => {
      const trial = SUBSCRIPTION_PLANS.find(p => p.id === 'trial');
      const solo = SUBSCRIPTION_PLANS.find(p => p.id === 'solo_professional');
      const growth = SUBSCRIPTION_PLANS.find(p => p.id === 'growth_team');
      
      expect(trial?.limits.storage_gb).toBeLessThan(solo?.limits.storage_gb || 0);
      expect(solo?.limits.storage_gb).toBeLessThan(growth?.limits.storage_gb || 0);
      
      expect(trial?.limits.api_calls_month).toBeLessThan(solo?.limits.api_calls_month || 0);
      expect(solo?.limits.api_calls_month).toBeLessThan(growth?.limits.api_calls_month || 0);
    });
  });

  describe('Enterprise Company API', () => {
    test('EnterpriseCompanyAPI class exists and has static methods', () => {
      expect(EnterpriseCompanyAPI).toBeDefined();
      expect(typeof EnterpriseCompanyAPI.fetchCompanies).toBe('function');
      expect(typeof EnterpriseCompanyAPI.fetchCompanyById).toBe('function');
      expect(typeof EnterpriseCompanyAPI.createCompany).toBe('function');
      expect(typeof EnterpriseCompanyAPI.updateCompany).toBe('function');
      expect(typeof EnterpriseCompanyAPI.updateSubscription).toBe('function');
      expect(typeof EnterpriseCompanyAPI.fetchCompanyUsageStats).toBe('function');
      expect(typeof EnterpriseCompanyAPI.enforceUsageLimits).toBe('function');
    });

    test('static methods are accessible', () => {
      // Test that we can access the static methods without instantiation
      expect(() => EnterpriseCompanyAPI.fetchCompanies).not.toThrow();
      expect(() => EnterpriseCompanyAPI.createCompany).not.toThrow();
      expect(() => EnterpriseCompanyAPI.updateCompany).not.toThrow();
    });
  });

  describe('Integration Testing', () => {
    test('handles subscription plan lookups', () => {
      const getSubscriptionPlan = (id: string): SubscriptionPlan | undefined => {
        return SUBSCRIPTION_PLANS.find(plan => plan.id === id);
      };

      const growthPlan = getSubscriptionPlan('growth_team');
      expect(growthPlan).toBeDefined();
      expect(growthPlan?.limits.users).toBe(3);
      expect(growthPlan?.price_monthly).toBe(150);
    });

    test('validates subscription limits by tier', () => {
      const getSubscriptionLimits = (planId: string) => {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        return plan?.limits || null;
      };

      const trialLimits = getSubscriptionLimits('trial');
      const enterpriseLimits = getSubscriptionLimits('enterprise');

      expect(trialLimits?.storage_gb).toBe(5);
      expect(enterpriseLimits?.storage_gb).toBe(1000);
      expect(enterpriseLimits?.storage_gb).toBeGreaterThan(trialLimits?.storage_gb || 0);
    });

    test('checks enterprise feature availability', () => {
      const hasEnterpriseFeature = (planId: string, feature: keyof SubscriptionPlan['enterprise_features']) => {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        return plan?.enterprise_features[feature] || false;
      };

      expect(hasEnterpriseFeature('solo_professional', 'sso')).toBe(false);
      expect(hasEnterpriseFeature('enterprise', 'sso')).toBe(true);
      expect(hasEnterpriseFeature('professional_agency', 'white_label')).toBe(true);
    });

    test('calculates pricing comparisons', () => {
      const calculateAnnualSavings = (planId: string) => {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        if (!plan || plan.price_monthly === 0) return 0;
        
        const monthlyTotal = plan.price_monthly * 12;
        const yearlySavings = monthlyTotal - plan.price_yearly;
        return yearlySavings;
      };

      const growthSavings = calculateAnnualSavings('growth_team');
      expect(growthSavings).toBe(300); // 2 months free

      const enterpriseSavings = calculateAnnualSavings('enterprise');
      expect(enterpriseSavings).toBe(2400); // 2 months free
    });
  });

  describe('Data Validation', () => {
    test('subscription plans have consistent structure', () => {
      SUBSCRIPTION_PLANS.forEach(plan => {
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('name');
        expect(plan).toHaveProperty('description');
        expect(plan).toHaveProperty('price_monthly');
        expect(plan).toHaveProperty('price_yearly');
        expect(plan).toHaveProperty('features');
        expect(plan).toHaveProperty('limits');
        expect(plan).toHaveProperty('enterprise_features');

        expect(typeof plan.id).toBe('string');
        expect(typeof plan.name).toBe('string');
        expect(typeof plan.price_monthly).toBe('number');
        expect(Array.isArray(plan.features)).toBe(true);
        expect(typeof plan.limits).toBe('object');
      });
    });

    test('enterprise features structure is consistent', () => {
      SUBSCRIPTION_PLANS.forEach(plan => {
        const features = plan.enterprise_features;
        
        expect(features).toHaveProperty('sso');
        expect(features).toHaveProperty('white_label');
        expect(features).toHaveProperty('custom_domain');
        expect(features).toHaveProperty('dedicated_support');
        expect(features).toHaveProperty('advanced_analytics');
        expect(features).toHaveProperty('api_access');

        expect(typeof features.sso).toBe('boolean');
        expect(typeof features.white_label).toBe('boolean');
        expect(typeof features.custom_domain).toBe('boolean');
        expect(typeof features.dedicated_support).toBe('boolean');
        expect(typeof features.advanced_analytics).toBe('boolean');
        expect(typeof features.api_access).toBe('boolean');
      });
    });

    test('limits structure is consistent', () => {
      SUBSCRIPTION_PLANS.forEach(plan => {
        const limits = plan.limits;
        
        expect(limits).toHaveProperty('users');
        expect(limits).toHaveProperty('storage_gb');
        expect(limits).toHaveProperty('api_calls_month');
        expect(limits).toHaveProperty('campaigns');
        expect(limits).toHaveProperty('social_accounts');
        expect(limits).toHaveProperty('email_contacts');

        expect(typeof limits.users).toBe('number');
        expect(typeof limits.storage_gb).toBe('number');
        expect(typeof limits.api_calls_month).toBe('number');
        expect(typeof limits.campaigns).toBe('number');
        expect(typeof limits.social_accounts).toBe('number');
        expect(typeof limits.email_contacts).toBe('number');
      });
    });
  });

  describe('Business Logic Validation', () => {
    test('higher tiers generally have higher limits', () => {
      const planIds = ['trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise'];
      
      for (let i = 0; i < planIds.length - 1; i++) {
        const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === planIds[i]);
        const nextPlan = SUBSCRIPTION_PLANS.find(p => p.id === planIds[i + 1]);
        
        if (currentPlan && nextPlan) {
          // Skip unlimited values (-1)
          if (nextPlan.limits.storage_gb !== -1 && currentPlan.limits.storage_gb !== -1) {
            expect(nextPlan.limits.storage_gb).toBeGreaterThanOrEqual(currentPlan.limits.storage_gb);
          }
          
          if (nextPlan.limits.api_calls_month !== -1 && currentPlan.limits.api_calls_month !== -1) {
            expect(nextPlan.limits.api_calls_month).toBeGreaterThanOrEqual(currentPlan.limits.api_calls_month);
          }
        }
      }
    });

    test('enterprise features unlock progressively', () => {
      const basicPlans = SUBSCRIPTION_PLANS.filter(p => ['trial', 'solo_professional', 'growth_team'].includes(p.id));
      const premiumPlans = SUBSCRIPTION_PLANS.filter(p => ['professional_agency', 'enterprise', 'enterprise_plus'].includes(p.id));
      
      basicPlans.forEach(plan => {
        expect(plan.enterprise_features.sso).toBe(false);
        expect(plan.enterprise_features.dedicated_support).toBe(false);
      });
      
      premiumPlans.forEach(plan => {
        expect(plan.enterprise_features.sso).toBe(true);
        expect(plan.enterprise_features.dedicated_support).toBe(true);
      });
    });

    test('all plans include essential features', () => {
      SUBSCRIPTION_PLANS.forEach(plan => {
        expect(plan.enterprise_features.advanced_analytics).toBe(true);
        expect(plan.enterprise_features.api_access).toBe(true);
        expect(plan.features.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles non-existent plan lookups gracefully', () => {
      const getPlan = (id: string) => SUBSCRIPTION_PLANS.find(p => p.id === id);
      
      expect(getPlan('nonexistent')).toBeUndefined();
      expect(getPlan('')).toBeUndefined();
      expect(getPlan('TRIAL')).toBeUndefined(); // Case sensitive
    });

    test('validates unlimited values consistently', () => {
      const enterprisePlusPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'enterprise_plus');
      
      if (enterprisePlusPlan) {
        const unlimitedFields = Object.entries(enterprisePlusPlan.limits).filter(([_, value]) => value === -1);
        expect(unlimitedFields.length).toBeGreaterThan(0); // Should have some unlimited features
      }
    });

    test('pricing validation', () => {
      SUBSCRIPTION_PLANS.forEach(plan => {
        expect(plan.price_monthly).toBeGreaterThanOrEqual(0);
        expect(plan.price_yearly).toBeGreaterThanOrEqual(0);
        
        if (plan.price_monthly > 0) {
          expect(plan.price_yearly).toBeGreaterThan(0);
          expect(plan.price_yearly).toBeLessThan(plan.price_monthly * 12); // Annual discount
        }
      });
    });
  });
});