'use client';

import { useState } from 'react';
import { 
  Target, DollarSign, Calendar, Globe, Users, Settings, 
  Info, ChevronRight, CheckCircle, AlertTriangle, Lightbulb,
  MapPin, Clock, Smartphone, Monitor, Tablet
} from 'lucide-react';
import type { CampaignFormData } from '@/types';

interface EnhancedCampaignFormProps {
  campaign?: CampaignFormData;
  onSubmit: (campaign: CampaignFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface TargetingOptions {
  ageGroups: string[];
  genders: string[];
  locations: string[];
  interests: string[];
  devices: string[];
  adSchedule: {
    days: string[];
    hours: { start: string; end: string };
  };
}

interface ValidationError {
  field: string;
  message: string;
}

export default function EnhancedCampaignForm({ campaign, onSubmit, onCancel, loading }: EnhancedCampaignFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: campaign?.name || '',
    platform: campaign?.platform || 'google_ads',
    client_name: campaign?.client_name || '',
    budget: campaign?.budget || undefined,
    spend: campaign?.spend || 0,
    metrics: campaign?.metrics || {}
  });

  const [targeting, setTargeting] = useState<TargetingOptions>({
    ageGroups: [],
    genders: [],
    locations: [],
    interests: [],
    devices: [],
    adSchedule: {
      days: [],
      hours: { start: '09:00', end: '17:00' }
    }
  });

  const [budgetType, setBudgetType] = useState<'daily' | 'total'>('daily');
  const [campaignObjective, setCampaignObjective] = useState('conversions');
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const platformOptions = [
    { 
      value: 'google_ads', 
      label: 'Google Ads', 
      description: 'Search, Display, YouTube, and Shopping ads',
      icon: '🔍',
      features: ['Search Ads', 'Display Network', 'YouTube', 'Shopping']
    },
    { 
      value: 'meta', 
      label: 'Meta Ads', 
      description: 'Facebook and Instagram advertising',
      icon: '📘',
      features: ['Facebook Feed', 'Instagram', 'Stories', 'Reels']
    },
    { 
      value: 'linkedin', 
      label: 'LinkedIn Ads', 
      description: 'Professional B2B targeting',
      icon: '💼',
      features: ['Sponsored Content', 'Message Ads', 'Text Ads', 'Dynamic Ads']
    },
    { 
      value: 'tiktok', 
      label: 'TikTok Ads', 
      description: 'Short-form video advertising',
      icon: '🎵',
      features: ['In-Feed Ads', 'Spark Ads', 'TopView', 'Branded Hashtag']
    },
    { 
      value: 'twitter', 
      label: 'X (Twitter) Ads', 
      description: 'Real-time conversation advertising',
      icon: '🐦',
      features: ['Promoted Tweets', 'Promoted Accounts', 'Promoted Trends']
    }
  ];

  const campaignObjectives = [
    { value: 'awareness', label: 'Brand Awareness', description: 'Increase brand recognition' },
    { value: 'traffic', label: 'Website Traffic', description: 'Drive visitors to your website' },
    { value: 'engagement', label: 'Engagement', description: 'Increase likes, shares, and comments' },
    { value: 'leads', label: 'Lead Generation', description: 'Collect prospect information' },
    { value: 'conversions', label: 'Conversions', description: 'Drive sales or specific actions' },
    { value: 'app_installs', label: 'App Installs', description: 'Promote mobile app downloads' }
  ];

  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const genders = ['Male', 'Female', 'All'];
  const devices = ['Mobile', 'Desktop', 'Tablet'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const steps = [
    { number: 1, title: 'Campaign Basics', icon: Settings },
    { number: 2, title: 'Platform & Objective', icon: Target },
    { number: 3, title: 'Budget & Schedule', icon: DollarSign },
    { number: 4, title: 'Targeting', icon: Users },
    { number: 5, title: 'Review & Launch', icon: CheckCircle }
  ];

  const validateStep = (step: number): ValidationError[] => {
    const stepErrors: ValidationError[] = [];

    switch (step) {
      case 1:
        if (!formData.name) stepErrors.push({ field: 'name', message: 'Campaign name is required' });
        if (!formData.client_name) stepErrors.push({ field: 'client_name', message: 'Client name is required' });
        break;
      case 2:
        if (!formData.platform) stepErrors.push({ field: 'platform', message: 'Platform selection is required' });
        if (!campaignObjective) stepErrors.push({ field: 'objective', message: 'Campaign objective is required' });
        break;
      case 3:
        if (!formData.budget || formData.budget <= 0) stepErrors.push({ field: 'budget', message: 'Budget must be greater than 0' });
        break;
    }

    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    setErrors(stepErrors);

    if (stepErrors.length === 0 && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    let allErrors: ValidationError[] = [];
    for (let i = 1; i <= 4; i++) {
      allErrors = [...allErrors, ...validateStep(i)];
    }

    if (allErrors.length > 0) {
      setErrors(allErrors);
      return;
    }

    // Include targeting and other enhanced data
    const enhancedFormData = {
      ...formData,
      objective: campaignObjective,
      budget_type: budgetType,
      targeting: targeting,
      enhanced_features: true
    };

    onSubmit(enhancedFormData);
  };

  const handleInputChange = (field: keyof CampaignFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const toggleTargetingOption = (category: keyof TargetingOptions, value: string) => {
    if (category === 'adSchedule') return;
    
    setTargeting(prev => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(value)
        ? (prev[category] as string[]).filter(item => item !== value)
        : [...(prev[category] as string[]), value]
    }));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Campaign Basics</h2>
              <p className="text-gray-600 dark:text-gray-400">Let's start with the essential information about your campaign.</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  getFieldError('name') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Summer Sale 2024 - Google Ads"
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('name')}</p>
              )}
            </div>

            <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  getFieldError('client_name') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Acme Corporation"
              />
              {getFieldError('client_name') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('client_name')}</p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Naming Best Practices</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• Include the client name, campaign type, and time period</li>
                    <li>• Use consistent naming conventions across campaigns</li>
                    <li>• Keep names descriptive but concise (under 50 characters)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Platform & Objective</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose your advertising platform and campaign goal.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Select Advertising Platform *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platformOptions.map((platform) => (
                  <button
                    key={platform.value}
                    type="button"
                    onClick={() => handleInputChange('platform', platform.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      formData.platform === platform.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{platform.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{platform.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {platform.features.map((feature) => (
                            <span key={feature} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {getFieldError('platform') && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('platform')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Campaign Objective *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {campaignObjectives.map((objective) => (
                  <button
                    key={objective.value}
                    type="button"
                    onClick={() => setCampaignObjective(objective.value)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      campaignObjective === objective.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">{objective.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{objective.description}</p>
                  </button>
                ))}
              </div>
              {getFieldError('objective') && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('objective')}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Budget & Schedule</h2>
              <p className="text-gray-600 dark:text-gray-400">Set your campaign budget and scheduling preferences.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setBudgetType('daily')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  budgetType === 'daily'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">Daily Budget</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set daily spending limit</p>
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('total')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  budgetType === 'total'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">Total Budget</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set campaign lifetime budget</p>
              </button>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {budgetType === 'daily' ? 'Daily' : 'Total'} Budget ($) *
              </label>
              <input
                type="number"
                id="budget"
                min="1"
                step="0.01"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value ? parseFloat(e.target.value) : undefined)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  getFieldError('budget') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder={`Enter ${budgetType} budget amount...`}
              />
              {getFieldError('budget') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('budget')}</p>
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {budgetType === 'daily' 
                  ? 'This amount will be spent each day on average'
                  : 'This is the total amount that will be spent over the campaign lifetime'
                }
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-1">Budget Recommendations</h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                    <li>• Start with a modest budget and scale up based on performance</li>
                    <li>• Daily budgets provide better spend control</li>
                    <li>• Consider your client's monthly marketing budget</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Audience Targeting</h2>
              <p className="text-gray-600 dark:text-gray-400">Define your target audience for better campaign performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Age Groups</label>
                <div className="space-y-2">
                  {ageGroups.map((age) => (
                    <label key={age} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={targeting.ageGroups.includes(age)}
                        onChange={() => toggleTargetingOption('ageGroups', age)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gender</label>
                <div className="space-y-2">
                  {genders.map((gender) => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={targeting.genders.includes(gender)}
                        onChange={() => setTargeting(prev => ({ ...prev, genders: [gender] }))}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Devices</label>
                <div className="space-y-2">
                  {devices.map((device) => (
                    <label key={device} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={targeting.devices.includes(device)}
                        onChange={() => toggleTargetingOption('devices', device)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        {device === 'Mobile' && <Smartphone className="w-4 h-4" />}
                        {device === 'Desktop' && <Monitor className="w-4 h-4" />}
                        {device === 'Tablet' && <Tablet className="w-4 h-4" />}
                        {device}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Ad Schedule</label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400">Start Time</label>
                      <input
                        type="time"
                        value={targeting.adSchedule.hours.start}
                        onChange={(e) => setTargeting(prev => ({
                          ...prev,
                          adSchedule: { ...prev.adSchedule, hours: { ...prev.adSchedule.hours, start: e.target.value } }
                        }))}
                        className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400">End Time</label>
                      <input
                        type="time"
                        value={targeting.adSchedule.hours.end}
                        onChange={(e) => setTargeting(prev => ({
                          ...prev,
                          adSchedule: { ...prev.adSchedule, hours: { ...prev.adSchedule.hours, end: e.target.value } }
                        }))}
                        className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleTargetingOption('adSchedule' as any, day)}
                        className={`px-2 py-1 text-xs rounded transition-all ${
                          targeting.adSchedule.days.includes(day)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">Targeting Tips</h4>
                  <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
                    <li>• Start broad and narrow down based on performance data</li>
                    <li>• Consider your client's typical customer demographics</li>
                    <li>• Test different audience segments to find what works best</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review & Launch</h2>
              <p className="text-gray-600 dark:text-gray-400">Review your campaign settings before launching.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Campaign Name:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Client:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.client_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Platform:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {platformOptions.find(p => p.value === formData.platform)?.label}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Objective:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {campaignObjectives.find(o => o.value === campaignObjective)?.label}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Budget:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${formData.budget} ({budgetType})
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Targeting:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {targeting.ageGroups.length > 0 ? `${targeting.ageGroups.length} age groups` : 'All ages'}, 
                      {' '}{targeting.genders.length > 0 ? targeting.genders.join(', ') : 'All genders'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-900 dark:text-red-300 mb-2">Please fix the following errors:</h4>
                    <ul className="text-sm text-red-800 dark:text-red-400 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                currentStep >= step.number
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Creating...' : 'Launch Campaign'}
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}