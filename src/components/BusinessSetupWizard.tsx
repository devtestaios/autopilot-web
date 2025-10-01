'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useBusinessConfiguration, BusinessType, BusinessSize, BusinessTemplate } from '@/contexts/BusinessConfigurationContext';
import { useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Building, 
  Target, 
  Zap,
  Clock,
  DollarSign,
  CheckCircle,
  Star,
  Rocket,
  User,
  UserPlus,
  Building2,
  Briefcase
} from 'lucide-react';

interface BusinessSetupWizardProps {
  onComplete?: (businessProfile: {
    businessName: string;
    businessType: string;
    businessSize: string;
    industry: string;
    goals: string[];
    selectedPlatforms: string[];
  }) => void;
  onSkip?: () => void;
}

const businessTypeOptions: { value: BusinessType; label: string; icon: any; description: string; }[] = [
  {
    value: 'solo_entrepreneur',
    label: 'Solo Entrepreneur',
    icon: User,
    description: 'Individual creator, freelancer, or consultant working alone'
  },
  {
    value: 'freelancer',
    label: 'Freelancer',
    icon: Briefcase,
    description: 'Independent professional offering specialized services'
  },
  {
    value: 'startup',
    label: 'Startup',
    icon: Rocket,
    description: 'Early-stage company building innovative products or services'
  },
  {
    value: 'small_business',
    label: 'Small Business',
    icon: Building,
    description: 'Local business serving customers in your community'
  },
  {
    value: 'growing_business',
    label: 'Growing Business',
    icon: Target,
    description: 'Established business ready to scale operations'
  },
  {
    value: 'medium_business',
    label: 'Medium Business',
    icon: Building2,
    description: 'Mid-size company with multiple departments'
  },
  {
    value: 'agency',
    label: 'Agency',
    icon: Users,
    description: 'Service provider managing multiple clients'
  }
];

const businessSizeOptions: { value: BusinessSize; label: string; range: string; }[] = [
  { value: 'solo', label: 'Just Me', range: '1 person' },
  { value: 'micro', label: 'Micro Team', range: '2-9 people' },
  { value: 'small', label: 'Small Team', range: '10-49 people' },
  { value: 'medium', label: 'Medium Company', range: '50-249 people' },
  { value: 'large', label: 'Large Company', range: '250-999 people' },
  { value: 'enterprise', label: 'Enterprise', range: '1000+ people' }
];

const industryOptions = [
  'Technology & Software',
  'Marketing & Advertising',
  'E-commerce & Retail',
  'Professional Services',
  'Healthcare',
  'Education',
  'Finance & Banking',
  'Real Estate',
  'Food & Restaurant',
  'Manufacturing',
  'Creative & Design',
  'Consulting',
  'Other'
];

const goalOptions = [
  'Increase sales and revenue',
  'Improve marketing effectiveness',
  'Streamline operations',
  'Better customer management',
  'Enhance team productivity',
  'Scale business growth',
  'Reduce manual tasks',
  'Improve data insights',
  'Better project management',
  'Enhance customer support'
];

export default function BusinessSetupWizard({ onComplete, onSkip }: BusinessSetupWizardProps) {
  const {
    businessTemplates,
    getTemplatesBySize,
    getTemplatesByType,
    createBusinessProfile,
    completeSetup
  } = useBusinessConfiguration();

  const { applyBusinessSetupResults } = useDashboardCustomization();

  // Setup form state
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '' as BusinessType,
    businessSize: '' as BusinessSize,
    industry: '',
    goals: [] as string[],
    selectedTemplate: null as BusinessTemplate | null,
    customPlatforms: [] as string[]
  });

  const [recommendedTemplates, setRecommendedTemplates] = useState<BusinessTemplate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update recommended templates when type/size changes
  React.useEffect(() => {
    if (formData.businessType && formData.businessSize) {
      const typeTemplates = getTemplatesByType(formData.businessType);
      const sizeTemplates = getTemplatesBySize(formData.businessSize);
      
      // Find templates that match both criteria
      const matching = typeTemplates.filter(t => 
        sizeTemplates.some(s => s.id === t.id)
      );
      
      setRecommendedTemplates(matching.length > 0 ? matching : [...typeTemplates, ...sizeTemplates]);
    }
  }, [formData.businessType, formData.businessSize, getTemplatesByType, getTemplatesBySize]);

  // Calculate step completion status for better progress tracking
  const isStepComplete = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: return formData.businessName.trim().length > 0;
      case 1: return formData.businessType !== '';
      case 2: return formData.businessSize !== '';
      case 3: return formData.industry !== '' && formData.goals.length > 0;
      case 4: return formData.selectedTemplate !== null;
      case 5: return formData.selectedTemplate !== null;
      default: return false;
    }
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleGoalToggle = (goal: string) => {
    const newGoals = formData.goals.includes(goal)
      ? formData.goals.filter(g => g !== goal)
      : [...formData.goals, goal];
    updateFormData({ goals: newGoals });
  };

  const handleComplete = async () => {
    if (!formData.selectedTemplate) return;

    setIsSubmitting(true);
    
    try {
      // Create the business profile
      await createBusinessProfile({
        name: formData.businessName,
        type: formData.businessType,
        size: formData.businessSize,
        industry: formData.industry,
        goals: formData.goals,
        selectedPlatforms: [
          ...formData.selectedTemplate.essentialPlatforms,
          ...formData.selectedTemplate.recommendedPlatforms,
          ...formData.customPlatforms
        ],
        customizations: {
          brandColors: {
            primary: '#00c9a7',
            secondary: '#e07856', 
            accent: '#0a2540'
          },
          dashboardLayout: formData.businessSize === 'solo' ? 'simple' : 'standard',
          navigationStyle: formData.businessSize === 'enterprise' ? 'detailed' : 'standard',
          enabledFeatures: [],
          automationLevel: formData.businessSize === 'solo' ? 'basic' : 'intermediate',
          reportingDepth: formData.businessSize === 'enterprise' ? 'comprehensive' : 'standard'
        }
      });

      // Apply setup results to dashboard customization
      await applyBusinessSetupResults({
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessSize: formData.businessSize,
        industry: formData.industry,
        goals: formData.goals,
        selectedPlatforms: [
          ...formData.selectedTemplate.essentialPlatforms,
          ...formData.selectedTemplate.recommendedPlatforms,
          ...formData.customPlatforms
        ],
        dashboardLayout: formData.businessSize === 'solo' ? 'minimal' : 
                        formData.businessSize === 'enterprise' ? 'comprehensive' : 'balanced',
        priorityMetrics: formData.goals.includes('Increase sales and revenue') ? ['revenue', 'conversion_rate'] :
                        formData.goals.includes('Improve marketing effectiveness') ? ['campaigns', 'leads'] :
                        ['revenue', 'leads'],
        automationLevel: formData.businessSize === 'solo' ? 'basic' : 
                        formData.businessSize === 'enterprise' ? 'advanced' : 'intermediate'
      });

      completeSetup();
      
      // Pass the collected business profile data to parent component
      const businessProfileData = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessSize: formData.businessSize,
        industry: formData.industry,
        goals: formData.goals,
        selectedPlatforms: [
          ...formData.selectedTemplate.essentialPlatforms,
          ...formData.selectedTemplate.recommendedPlatforms,
          ...formData.customPlatforms
        ]
      };
      
      onComplete?.(businessProfileData);
    } catch (error) {
      console.error('Failed to complete setup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    'Business Details',
    'Business Type', 
    'Team Size',
    'Industry & Goals',
    'Choose Your Setup',
    'Final Review'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to PulseBridge.ai
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let's customize your business command center in just a few minutes
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + (isStepComplete(step) ? 1 : 0.5)) / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            {steps.map((stepName, index) => (
              <span 
                key={index} 
                className={`${
                  index < step ? 'text-blue-600 font-medium' : 
                  index === step ? (isStepComplete(step) ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300') :
                  'text-gray-400'
                }`}
              >
                {stepName}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <AnimatePresence mode="wait">
            {/* Step 0: Business Details */}
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us recommend the perfect setup for your needs
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName" className="text-base font-medium">
                      What's your business name?
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => updateFormData({ businessName: e.target.value })}
                      placeholder="Enter your business name"
                      className="mt-2 text-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.businessName.trim()}
                    size="lg"
                    className="px-8"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Business Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">What type of business is {formData.businessName}?</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us understand your primary business model
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessTypeOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <div
                        key={option.value}
                        className="cursor-pointer transition-all hover:shadow-md"
                        onClick={() => updateFormData({ businessType: option.value })}
                      >
                        <Card
                          className={`border-2 ${
                            formData.businessType === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <IconComponent className="w-6 h-6 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{option.label}</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">{option.description}</p>
                            </div>
                            {formData.businessType === option.value && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} size="lg" className="px-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.businessType}
                    size="lg"
                    className="px-8"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Team Size */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">How big is your team?</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us configure the right features and permissions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessSizeOptions.map((option) => (
                    <div
                      key={option.value}
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => updateFormData({ businessSize: option.value })}
                    >
                      <Card
                        className={`border-2 ${
                          formData.businessSize === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <Users className="w-8 h-8 text-blue-600 mx-auto" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{option.label}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{option.range}</p>
                        {formData.businessSize === option.value && (
                          <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                        )}
                      </CardContent>
                    </Card>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} size="lg" className="px-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.businessSize}
                    size="lg"
                    className="px-8"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Industry & Goals */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Tell us more about your focus</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us recommend the most relevant tools and features
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Industry Selection */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      What industry are you in?
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {industryOptions.map((industry) => (
                        <Button
                          key={industry}
                          variant={formData.industry === industry ? 'default' : 'outline'}
                          size="sm"
                          className="justify-start"
                          onClick={() => updateFormData({ industry })}
                        >
                          {industry}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Goals Selection */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      What are your main goals? (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {goalOptions.map((goal) => (
                        <div 
                          key={goal} 
                          className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleGoalToggle(goal)}
                        >
                          <Checkbox 
                            checked={formData.goals.includes(goal)}
                            onChange={() => handleGoalToggle(goal)}
                          />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} size="lg" className="px-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.industry || formData.goals.length === 0}
                    size="lg"
                    className="px-8"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Template Selection */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose your perfect setup</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Based on your answers, here are our recommended configurations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedTemplates.slice(0, 4).map((template) => (
                    <div
                      key={template.id}
                      className="cursor-pointer transition-all hover:shadow-lg"
                      onClick={() => updateFormData({ selectedTemplate: template })}
                    >
                      <Card
                        className={`border-2 ${
                          formData.selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                              <h3 className="font-semibold text-lg">{template.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {template.setupTime}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {template.complexity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {formData.selectedTemplate?.id === template.id && (
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {template.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Monthly Value:</span>
                            <span className="text-green-600 font-semibold">{template.monthlyValue}</span>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Includes:</p>
                            <div className="flex flex-wrap gap-1">
                              {template.essentialPlatforms.slice(0, 3).map((platform) => (
                                <Badge key={platform} variant="default" className="text-xs">
                                  {platform.replace('-', ' ')}
                                </Badge>
                              ))}
                              {template.essentialPlatforms.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.essentialPlatforms.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} size="lg" className="px-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!formData.selectedTemplate}
                    size="lg"
                    className="px-8"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Final Review */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Ready to launch your command center!</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Review your setup and click launch to get started
                  </p>
                </div>

                {formData.selectedTemplate && (
                  <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl">{formData.selectedTemplate.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold">{formData.selectedTemplate.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Perfect for {formData.businessName}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Business Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span>{businessTypeOptions.find(t => t.value === formData.businessType)?.label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Size:</span>
                              <span>{businessSizeOptions.find(s => s.value === formData.businessSize)?.label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Industry:</span>
                              <span>{formData.industry}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Your Goals ({formData.goals.length})</h4>
                          <div className="space-y-1 text-sm">
                            {formData.goals.slice(0, 3).map((goal, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>{goal}</span>
                              </div>
                            ))}
                            {formData.goals.length > 3 && (
                              <span className="text-gray-500 text-xs">
                                +{formData.goals.length - 3} more goals
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-green-200">
                        <h4 className="font-semibold mb-3">Included Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            ...formData.selectedTemplate.essentialPlatforms,
                            ...formData.selectedTemplate.recommendedPlatforms
                          ].map((platform) => (
                            <Badge key={platform} variant="default" className="text-xs">
                              {platform.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} size="lg" className="px-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onSkip} size="lg" className="px-6">
                      Skip Setup
                    </Button>
                    <Button 
                      onClick={handleComplete}
                      disabled={isSubmitting}
                      size="lg"
                      className="px-8 bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Launch My Command Center
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}