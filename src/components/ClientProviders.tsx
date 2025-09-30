'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { UnifiedAIProvider } from "@/contexts/UnifiedAIContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { CacheProvider } from "@/contexts/CacheContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { ABTestProvider } from "@/contexts/ABTestContext";
import { SocialMediaProvider } from "@/contexts/SocialMediaContext";
import { EmailMarketingProvider } from "@/contexts/EmailMarketingContext";
import { MarketingOptimizationProvider } from "@/contexts/MarketingOptimizationContext";
import { BusinessConfigurationProvider } from "@/contexts/BusinessConfigurationContext";
import { ProjectManagementProvider } from "@/contexts/ProjectManagementContext";
import { AIProjectAutomationProvider } from "@/contexts/AIProjectAutomationContext";
import { CollaborationProvider } from "@/contexts/CollaborationContext";
import { IntegrationsProvider } from "@/contexts/IntegrationsContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { UserTierProvider } from "@/contexts/UserTierContext";
import { DashboardCustomizationProvider } from "@/contexts/DashboardCustomizationContext";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorProvider } from "@/components/providers/ErrorProvider";
import PageTransition from "@/components/PageTransition";

interface ClientProvidersProps {
  children: React.ReactNode;
}

// Default A/B tests configuration
const defaultTests = [
  {
    id: 'landing_hero_test',
    name: 'Landing Hero CTA Test',
    description: 'Test different call-to-action buttons on the landing page',
    variants: [
      {
        id: 'control',
        name: 'Original CTA',
        weight: 50,
        config: {
          buttonText: 'Get Started Free',
          buttonColor: 'blue'
        }
      },
      {
        id: 'variant_a',
        name: 'Urgent CTA',
        weight: 50,
        config: {
          buttonText: 'Start Your Free Trial Today',
          buttonColor: 'green'
        }
      }
    ],
    isActive: true,
    startDate: new Date().toISOString(),
    targetPage: '/'
  },
  {
    id: 'pricing_layout_test',
    name: 'Pricing Page Layout Test',
    description: 'Test different pricing page layouts',
    variants: [
      {
        id: 'control',
        name: 'Grid Layout',
        weight: 50,
        config: {
          layout: 'grid',
          highlightPlan: 'pro'
        }
      },
      {
        id: 'variant_a',
        name: 'List Layout',
        weight: 50,
        config: {
          layout: 'list',
          highlightPlan: 'enterprise'
        }
      }
    ],
    isActive: true,
    startDate: new Date().toISOString(),
    targetPage: '/pricing'
  }
];

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorProvider>
      <ThemeProvider>
        <CacheProvider>
          <WebSocketProvider>
            <AuthProvider>
              <UserTierProvider>
                <SearchProvider>
                  <UnifiedAIProvider>
                    <AnalyticsProvider>
                      <SocialMediaProvider>
                        <EmailMarketingProvider>
                          <MarketingOptimizationProvider>
                            <BusinessConfigurationProvider>
                              <DashboardCustomizationProvider>
                                <ProjectManagementProvider>
                                  <AIProjectAutomationProvider>
                                    <CollaborationProvider>
                                      <IntegrationsProvider>
                                        <PerformanceProvider>
                                          <ABTestProvider tests={defaultTests}>
                                            <ToastProvider>
                                              <PageTransition>
                                                {children}
                                              </PageTransition>
                                            </ToastProvider>
                                          </ABTestProvider>
                                        </PerformanceProvider>
                                      </IntegrationsProvider>
                                    </CollaborationProvider>
                                  </AIProjectAutomationProvider>
                                </ProjectManagementProvider>
                              </DashboardCustomizationProvider>
                            </BusinessConfigurationProvider>
                          </MarketingOptimizationProvider>
                        </EmailMarketingProvider>
                      </SocialMediaProvider>
                    </AnalyticsProvider>
                  </UnifiedAIProvider>
                </SearchProvider>
              </UserTierProvider>
            </AuthProvider>
          </WebSocketProvider>
        </CacheProvider>
      </ThemeProvider>
    </ErrorProvider>
  );
}