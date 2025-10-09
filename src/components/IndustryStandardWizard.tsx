/**
 * Industry-Standard Modular Business Setup Wizard
 * Conversion-optimized onboarding with suite-based pricing
 * Target: 25%+ trial-to-paid conversion rate
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  TrendingUp, 
  DollarSign,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Star,
  Zap,
  Clock,
  Target,
  Play,
  Check,
  Building,
  Briefcase,
  Globe,
  Calculator,
  Percent
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Suite Icons
const SuiteIcons = {
  predictive_analytics: BarChart3,
  financial_management: DollarSign,
  conversational_ai: MessageSquare,
  hr_management: Users
};

const WIZARD_STEPS = [
  { id: 'welcome', title: 'Welcome', description: 'Discover PulseBridge.ai' },
  { id: 'company', title: 'Company', description: 'Tell us about your business' },
  { id: 'suites', title: 'Features', description: 'Choose your capabilities' },
  { id: 'pricing', title: 'Pricing', description: 'Customize your plan' },
  { id: 'trial', title: 'Trial', description: 'Start your free trial' }
];

const INDUSTRIES = [
  'Marketing Agency', 'E-commerce', 'SaaS', 'Consulting', 'Healthcare', 
  'Education', 'Real Estate', 'Manufacturing', 'Financial Services', 'Other'
];

const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup', description: '1-10 employees', multiplier: '1.0x' },
  { value: 'small', label: 'Small Business', description: '11-50 employees', multiplier: '1.5x' },
  { value: 'medium', label: 'Medium Business', description: '51-200 employees', multiplier: '2.0x' },
  { value: 'enterprise', label: 'Enterprise', description: '201+ employees', multiplier: '3.0x' }
];

const CHALLENGES = [
  'marketing_optimization', 'financial_management', 'customer_support', 
  'employee_management', 'data_analysis', 'automation'
];

export default function IndustryStandardWizard() {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [companyProfile, setCompanyProfile] = useState({
    company_name: '',
    industry: '',
    company_size: 'startup',
    employees_count: 10,
    primary_challenges: [],
    current_tools: [],
    goals: [],
    estimated_monthly_spend: 5000
  });
  const [selectedSuites, setSelectedSuites] = useState([]);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [suiteCatalog, setSuiteCatalog] = useState({});
  const [pricingData, setPricingData] = useState(null);
  const [roiAnalysis, setROIAnalysis] = useState(null);
  const [competitorComparison, setCompetitorComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Fetch suite catalog on mount
  useEffect(() => {
    fetchSuiteCatalog();
  }, []);

  const fetchSuiteCatalog = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/onboarding/suite-catalog`);
      const data = await response.json();
      if (data.success) {
        setSuiteCatalog(data.suites);
      }
    } catch (error) {
      console.error('Failed to fetch suite catalog:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      trackStep(WIZARD_STEPS[currentStep + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const trackStep = async (stepName) => {
    try {
      await fetch(`${API_BASE}/api/v1/onboarding/track-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_name: stepName,
          session_id: sessionId || 'anonymous',
          selections: { currentStep: stepName }
        })
      });
    } catch (error) {
      console.error('Tracking failed:', error);
    }
  };

  const submitCompanyProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/onboarding/company-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyProfile)
      });
      
      const data = await response.json();
      if (data.success) {
        setSessionId(data.session_id);
        setSelectedSuites(data.recommended_suites);
        nextStep();
      }
    } catch (error) {
      console.error('Profile submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (selectedSuites.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/onboarding/calculate-pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_suites: selectedSuites,
          company_size: companyProfile.company_size,
          annual_billing: annualBilling
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setPricingData(data.pricing);
        setROIAnalysis(data.roi_analysis);
        setCompetitorComparison(data.competitor_comparison);
      }
    } catch (error) {
      console.error('Pricing calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pricing when suites or billing changes
  useEffect(() => {
    if (selectedSuites.length > 0 && companyProfile.company_size) {
      calculatePricing();
    }
  }, [selectedSuites, companyProfile.company_size, annualBilling]);

  const toggleSuite = (suiteKey) => {
    setSelectedSuites(prev => 
      prev.includes(suiteKey) 
        ? prev.filter(s => s !== suiteKey)
        : [...prev, suiteKey]
    );
  };

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-lg">PulseBridge.ai Setup</span>
            </div>
            <Badge variant="outline" className="text-sm">
              Step {currentStep + 1} of {WIZARD_STEPS.length}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between mt-3 text-sm">
            {WIZARD_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index < currentStep ? 'bg-blue-600 text-white' :
                  index === currentStep ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="hidden sm:block font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Transform Your Business with 
                  <span className="text-blue-600"> AI-Powered Automation</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Join 1,847 companies using PulseBridge.ai to automate their operations,
                  reduce costs by 60%, and increase productivity by 300%.
                </p>
                
                {/* Feature Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <Card className="p-4">
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Predictive Analytics</h3>
                    <p className="text-sm text-gray-600">AI-powered forecasting</p>
                  </Card>
                  <Card className="p-4">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Financial Management</h3>
                    <p className="text-sm text-gray-600">Complete automation</p>
                  </Card>
                  <Card className="p-4">
                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Conversational AI</h3>
                    <p className="text-sm text-gray-600">Multi-language support</p>
                  </Card>
                  <Card className="p-4">
                    <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">HR Management</h3>
                    <p className="text-sm text-gray-600">Employee lifecycle</p>
                  </Card>
                </div>

                {/* Social Proof */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">1,847</div>
                    <div className="text-sm text-gray-600">Active Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-gray-600">Trial Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">$2.4M</div>
                    <div className="text-sm text-gray-600">Customer Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">4.9⭐</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button size="lg" onClick={nextStep} className="px-8 py-4 text-lg">
                    Start Free Setup - No Credit Card Required
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  
                  <p className="text-sm text-gray-500">
                    ✅ 14-day free trial ✅ 5-minute setup ✅ Cancel anytime
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Company Profile */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Building className="h-7 w-7 mr-3 text-blue-600" />
                    Tell Us About Your Business
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    This helps us personalize your experience and recommend the best features for your needs.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Company Name */}
                  <div>
                    <Label htmlFor="company_name" className="text-base font-medium">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={companyProfile.company_name}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        company_name: e.target.value
                      })}
                      placeholder="Enter your company name"
                      className="mt-2 h-12 text-base"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <Label className="text-base font-medium">Industry *</Label>
                    <select 
                      className="w-full mt-2 p-3 border rounded-md h-12 text-base"
                      value={companyProfile.industry}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        industry: e.target.value
                      })}
                    >
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  {/* Company Size */}
                  <div>
                    <Label className="text-base font-medium">Company Size *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {COMPANY_SIZES.map(size => (
                        <Card 
                          key={size.value}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            companyProfile.company_size === size.value 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'hover:border-gray-300'
                          }`}
                          onClick={() => setCompanyProfile({
                            ...companyProfile,
                            company_size: size.value
                          })}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-base">{size.label}</div>
                                <div className="text-gray-600">{size.description}</div>
                                <div className="text-sm text-blue-600 mt-1">Pricing {size.multiplier}</div>
                              </div>
                              {companyProfile.company_size === size.value && (
                                <CheckCircle2 className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Primary Challenges */}
                  <div>
                    <Label className="text-base font-medium">What are your biggest business challenges? (Select up to 3)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {[
                        { key: 'marketing_optimization', label: 'Marketing Optimization' },
                        { key: 'financial_management', label: 'Financial Management' },
                        { key: 'customer_support', label: 'Customer Support' },
                        { key: 'employee_management', label: 'Employee Management' },
                        { key: 'data_analysis', label: 'Data Analysis' },
                        { key: 'automation', label: 'Process Automation' }
                      ].map(challenge => (
                        <Badge
                          key={challenge.key}
                          variant={companyProfile.primary_challenges.includes(challenge.key) ? "default" : "outline"}
                          className="cursor-pointer p-3 justify-center text-sm hover:shadow-sm transition-all"
                          onClick={() => {
                            const challenges = companyProfile.primary_challenges;
                            if (challenges.includes(challenge.key)) {
                              setCompanyProfile({
                                ...companyProfile,
                                primary_challenges: challenges.filter(c => c !== challenge.key)
                              });
                            } else if (challenges.length < 3) {
                              setCompanyProfile({
                                ...companyProfile,
                                primary_challenges: [...challenges, challenge.key]
                              });
                            }
                          }}
                        >
                          {challenge.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={prevStep} className="px-6 py-3">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={submitCompanyProfile}
                      disabled={!companyProfile.company_name || !companyProfile.industry || loading}
                      className="px-6 py-3"
                    >
                      {loading ? 'Analyzing...' : 'Continue to Features'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Suite Selection */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Choose Your Business Automation Suites
                </h2>
                <p className="text-lg text-gray-600">
                  Based on your profile, we recommend these capabilities. You can add or remove any suite.
                </p>
              </div>

              {/* Suite Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(suiteCatalog).map(([suiteKey, suite]) => {
                  const IconComponent = SuiteIcons[suiteKey] || Star;
                  const isSelected = selectedSuites.includes(suiteKey);
                  const isRecommended = selectedSuites.includes(suiteKey);
                  
                  return (
                    <Card 
                      key={suiteKey}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                          : 'hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => toggleSuite(suiteKey)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{suite.name}</h3>
                              {isRecommended && (
                                <Badge variant="secondary" className="text-xs">
                                  Recommended for you
                                </Badge>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">{suite.description}</p>
                        
                        <div className="mb-4">
                          <div className="text-sm text-gray-500 mb-2">Key Features:</div>
                          <ul className="text-sm space-y-1">
                            {suite.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${suite.base_price}/month
                            </div>
                            <div className="text-sm text-gray-500">
                              {suite.endpoints} API endpoints
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {suite.value_proposition}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Bundle Discount Alert */}
              {selectedSuites.length >= 2 && (
                <Card className="bg-green-50 border-green-200 mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        {selectedSuites.length === 2 && "10% Bundle Discount Applied!"}
                        {selectedSuites.length === 3 && "20% Bundle Discount Applied!"}
                        {selectedSuites.length === 4 && "30% Bundle Discount Applied - Maximum Savings!"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} className="px-6 py-3">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={selectedSuites.length === 0}
                  className="px-6 py-3"
                >
                  View Pricing ({selectedSuites.length} suite{selectedSuites.length !== 1 ? 's' : ''})
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 3 && pricingData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Custom {pricingData.recommended_plan} Plan
                </h2>
                <p className="text-lg text-gray-600">
                  Tailored pricing for {companyProfile.company_name}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pricing Breakdown */}
                <div className="lg:col-span-2">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calculator className="h-6 w-6 mr-2 text-blue-600" />
                        Pricing Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Base Platform */}
                      <div className="flex justify-between items-center py-2">
                        <span>Platform Base</span>
                        <span className="font-medium">${pricingData.base_platform_price}/month</span>
                      </div>

                      {/* Selected Suites */}
                      {Object.entries(pricingData.suite_costs).map(([suiteKey, cost]) => (
                        <div key={suiteKey} className="flex justify-between items-center py-2">
                          <span>{suiteCatalog[suiteKey]?.name || suiteKey}</span>
                          <span className="font-medium">${cost}/month</span>
                        </div>
                      ))}

                      <hr />

                      {/* Subtotal */}
                      <div className="flex justify-between items-center py-2">
                        <span>Subtotal</span>
                        <span className="font-medium">${pricingData.subtotal}/month</span>
                      </div>

                      {/* Bundle Discount */}
                      {pricingData.bundle_discount_percent > 0 && (
                        <div className="flex justify-between items-center py-2 text-green-600">
                          <span>Bundle Discount ({pricingData.bundle_discount_percent}%)</span>
                          <span className="font-medium">-${pricingData.bundle_discount_amount}</span>
                        </div>
                      )}

                      {/* Company Size Multiplier */}
                      {pricingData.company_size_multiplier > 1 && (
                        <div className="flex justify-between items-center py-2">
                          <span>Company Size Adjustment ({pricingData.company_size_multiplier}x)</span>
                          <span className="font-medium">
                            +${(pricingData.size_adjusted_total - (pricingData.subtotal - pricingData.bundle_discount_amount)).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <hr />

                      {/* Final Pricing */}
                      <div className="space-y-4">
                        {/* Billing Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">Annual Billing</span>
                            <div className="text-sm text-gray-600">Save 2 months (16.7% discount)</div>
                          </div>
                          <Switch
                            checked={annualBilling}
                            onCheckedChange={setAnnualBilling}
                          />
                        </div>

                        {/* Final Price */}
                        <div className="flex justify-between items-center text-xl font-bold">
                          <span>Total Price</span>
                          <div className="text-right">
                            <div className="text-2xl text-blue-600">
                              ${pricingData.final_monthly_price}/month
                            </div>
                            {annualBilling && (
                              <div className="text-sm text-gray-600">
                                Billed annually: ${pricingData.final_annual_price}
                              </div>
                            )}
                          </div>
                        </div>

                        {pricingData.total_savings > 0 && (
                          <div className="text-center text-green-600 font-medium">
                            You're saving ${pricingData.total_savings}/month!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ROI Analysis */}
                <div>
                  {roiAnalysis && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                          ROI Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {roiAnalysis.roi_percentage}%
                          </div>
                          <div className="text-sm text-gray-600">Expected ROI</div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Monthly Investment</span>
                            <span className="font-medium">${roiAnalysis.monthly_investment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Monthly Savings</span>
                            <span className="font-medium text-green-600">
                              ${roiAnalysis.monthly_savings}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Net Monthly Benefit</span>
                            <span className="font-bold text-green-600">
                              ${roiAnalysis.monthly_net_benefit}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Annual Net Benefit</span>
                            <span className="font-bold text-green-600">
                              ${roiAnalysis.annual_net_benefit.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Payback Period</span>
                            <span className="font-medium">{roiAnalysis.payback_period_days} days</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Competitor Comparison */}
                  {competitorComparison && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="h-6 w-6 mr-2 text-purple-600" />
                          vs. Competitors
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            ${competitorComparison.monthly_savings}
                          </div>
                          <div className="text-sm text-gray-600">Monthly savings vs. competitors</div>
                        </div>

                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span>Competitor Tools</span>
                            <span>${competitorComparison.competitor_total_cost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PulseBridge.ai</span>
                            <span>${competitorComparison.our_cost}</span>
                          </div>
                          <div className="flex justify-between font-medium text-purple-600">
                            <span>You Save</span>
                            <span>{competitorComparison.savings_percentage}%</span>
                          </div>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                          {competitorComparison.tool_count_reduced}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep} className="px-6 py-3">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Features
                </Button>
                <Button onClick={nextStep} className="px-8 py-3 text-lg">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Trial Setup */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="max-w-2xl mx-auto">
                <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  You're All Set!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Your {pricingData?.recommended_plan} plan is ready. 
                  Start your 14-day free trial now - no credit card required.
                </p>

                {/* Plan Summary */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Your Plan Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{selectedSuites.length}</div>
                        <div className="text-sm text-gray-600">Business Suites</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          ${pricingData?.final_monthly_price}
                        </div>
                        <div className="text-sm text-gray-600">Per Month</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">14 Days</div>
                        <div className="text-sm text-gray-600">Free Trial</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <Button size="lg" className="w-full py-4 text-lg">
                    <Zap className="h-5 w-5 mr-2" />
                    Start Free Trial Now
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    ✅ No credit card required ✅ Cancel anytime ✅ Full access to all features
                  </div>
                </div>

                {/* What happens next */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>What happens next?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-left">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
                        <span>Instant access to your personalized dashboard</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                        <span>Connect your existing tools and accounts</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</div>
                        <span>Start automating your business processes immediately</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}