'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Target, DollarSign, Users, Image, Calendar, Zap, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

interface CampaignWizardData {
  name: string;
  objective: string;
  platforms: string[];
  budget: {
    total: number;
    dailyLimit: number;
    allocation: Record<string, number>;
  };
  targeting: {
    demographics: {
      ageMin: number;
      ageMax: number;
      genders: string[];
      locations: string[];
    };
    interests: string[];
    behaviors: string[];
    customAudiences: string[];
  };
  creative: {
    assets: any[];
    headlines: string[];
    descriptions: string[];
    callToActions: string[];
  };
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
    dayParting: Record<string, boolean[]>;
  };
  abTesting: {
    enabled: boolean;
    variants: any[];
    duration: number;
    metrics: string[];
  };
}

export default function CampaignWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignWizardData>({
    name: '',
    objective: '',
    platforms: [],
    budget: { total: 1000, dailyLimit: 100, allocation: {} },
    targeting: {
      demographics: { ageMin: 18, ageMax: 65, genders: [], locations: [] },
      interests: [],
      behaviors: [],
      customAudiences: []
    },
    creative: { assets: [], headlines: [], descriptions: [], callToActions: [] },
    schedule: {
      startDate: '',
      endDate: '',
      timezone: 'America/New_York',
      dayParting: {}
    },
    abTesting: { enabled: false, variants: [], duration: 14, metrics: [] }
  });
  const [isCreating, setIsCreating] = useState(false);
  const [creationResult, setCreationResult] = useState<any>(null);

  const steps = [
    { id: 1, title: 'Campaign Basics', icon: Target },
    { id: 2, title: 'Budget & Platforms', icon: DollarSign },
    { id: 3, title: 'Targeting', icon: Users },
    { id: 4, title: 'Creative Assets', icon: Image },
    { id: 5, title: 'Schedule', icon: Calendar },
    { id: 6, title: 'A/B Testing', icon: Zap },
    { id: 7, title: 'Review & Create', icon: CheckCircle }
  ];

  const platformOptions = [
    { id: 'facebook', name: 'Facebook', description: 'Reach billions of users' },
    { id: 'google', name: 'Google Ads', description: 'Target search intent' },
    { id: 'linkedin', name: 'LinkedIn', description: 'Professional audience' },
    { id: 'twitter', name: 'Twitter/X', description: 'Real-time engagement' }
  ];

  const objectiveOptions = [
    { id: 'awareness', name: 'Brand Awareness', description: 'Increase brand recognition' },
    { id: 'consideration', name: 'Consideration', description: 'Drive interest and engagement' },
    { id: 'conversion', name: 'Conversions', description: 'Drive purchases or actions' },
    { id: 'retention', name: 'Retention', description: 'Re-engage existing customers' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateCampaign = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });
      const result = await response.json();
      setCreationResult(result);
    } catch (error) {
      console.error('Campaign creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter campaign name"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Campaign Objective</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {objectiveOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      campaignData.objective === option.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setCampaignData(prev => ({ ...prev, objective: option.id }))}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{option.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="total-budget">Total Budget ($)</Label>
                <Input
                  id="total-budget"
                  type="number"
                  value={campaignData.budget.total}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    budget: { ...prev.budget, total: Number(e.target.value) }
                  }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="daily-limit">Daily Limit ($)</Label>
                <Input
                  id="daily-limit"
                  type="number"
                  value={campaignData.budget.dailyLimit}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    budget: { ...prev.budget, dailyLimit: Number(e.target.value) }
                  }))}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Select Platforms</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {platformOptions.map((platform) => (
                  <Card
                    key={platform.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      campaignData.platforms.includes(platform.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      const isSelected = campaignData.platforms.includes(platform.id);
                      setCampaignData(prev => ({
                        ...prev,
                        platforms: isSelected
                          ? prev.platforms.filter(p => p !== platform.id)
                          : [...prev.platforms, platform.id]
                      }));
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{platform.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{platform.description}</p>
                        </div>
                        {campaignData.platforms.includes(platform.id) && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Age Range</Label>
                <div className="mt-2">
                  <Slider
                    value={[campaignData.targeting.demographics.ageMin, campaignData.targeting.demographics.ageMax]}
                    onValueChange={([min, max]) => setCampaignData(prev => ({
                      ...prev,
                      targeting: {
                        ...prev.targeting,
                        demographics: {
                          ...prev.targeting.demographics,
                          ageMin: min,
                          ageMax: max
                        }
                      }
                    }))}
                    min={13}
                    max={65}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{campaignData.targeting.demographics.ageMin}</span>
                    <span>{campaignData.targeting.demographics.ageMax}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Gender</Label>
                <Select
                  value={campaignData.targeting.demographics.genders[0] || ''}
                  onValueChange={(value) => setCampaignData(prev => ({
                    ...prev,
                    targeting: {
                      ...prev.targeting,
                      demographics: {
                        ...prev.targeting.demographics,
                        genders: value ? [value] : []
                      }
                    }
                  }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="locations">Target Locations</Label>
              <Input
                id="locations"
                placeholder="Enter countries/regions (comma-separated)"
                value={campaignData.targeting.demographics.locations.join(', ')}
                onChange={(e) => setCampaignData(prev => ({
                  ...prev,
                  targeting: {
                    ...prev.targeting,
                    demographics: {
                      ...prev.targeting.demographics,
                      locations: e.target.value.split(',').map(l => l.trim()).filter(Boolean)
                    }
                  }
                }))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="interests">Interests</Label>
              <Textarea
                id="interests"
                placeholder="Enter interests (one per line)"
                value={campaignData.targeting.interests.join('\n')}
                onChange={(e) => setCampaignData(prev => ({
                  ...prev,
                  targeting: {
                    ...prev.targeting,
                    interests: e.target.value.split('\n').filter(Boolean)
                  }
                }))}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Headlines</Label>
              <Textarea
                placeholder="Enter headlines (one per line)"
                value={campaignData.creative.headlines.join('\n')}
                onChange={(e) => setCampaignData(prev => ({
                  ...prev,
                  creative: {
                    ...prev.creative,
                    headlines: e.target.value.split('\n').filter(Boolean)
                  }
                }))}
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label>Descriptions</Label>
              <Textarea
                placeholder="Enter descriptions (one per line)"
                value={campaignData.creative.descriptions.join('\n')}
                onChange={(e) => setCampaignData(prev => ({
                  ...prev,
                  creative: {
                    ...prev.creative,
                    descriptions: e.target.value.split('\n').filter(Boolean)
                  }
                }))}
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label>Call to Actions</Label>
              <Textarea
                placeholder="Enter CTAs (one per line)"
                value={campaignData.creative.callToActions.join('\n')}
                onChange={(e) => setCampaignData(prev => ({
                  ...prev,
                  creative: {
                    ...prev.creative,
                    callToActions: e.target.value.split('\n').filter(Boolean)
                  }
                }))}
                className="mt-2"
                rows={3}
              />
            </div>

            <Card className="p-4 border-dashed border-2">
              <div className="text-center">
                <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Upload creative assets</p>
                <Button variant="outline" className="mt-2">Choose Files</Button>
              </div>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={campaignData.schedule.startDate}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, startDate: e.target.value }
                  }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={campaignData.schedule.endDate}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, endDate: e.target.value }
                  }))}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Timezone</Label>
              <Select
                value={campaignData.schedule.timezone}
                onValueChange={(value) => setCampaignData(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, timezone: value }
                }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Enable A/B Testing</h3>
                <p className="text-gray-600">Test different variations to optimize performance</p>
              </div>
              <Switch
                checked={campaignData.abTesting.enabled}
                onCheckedChange={(checked) => setCampaignData(prev => ({
                  ...prev,
                  abTesting: { ...prev.abTesting, enabled: checked }
                }))}
              />
            </div>

            {campaignData.abTesting.enabled && (
              <div className="space-y-4">
                <div>
                  <Label>Test Duration (days)</Label>
                  <Input
                    type="number"
                    value={campaignData.abTesting.duration}
                    onChange={(e) => setCampaignData(prev => ({
                      ...prev,
                      abTesting: { ...prev.abTesting, duration: Number(e.target.value) }
                    }))}
                    className="mt-2"
                    min={7}
                    max={30}
                  />
                </div>

                <div>
                  <Label>Success Metrics</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['CTR', 'Conversions', 'CPA', 'ROAS'].map((metric) => (
                      <label key={metric} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={campaignData.abTesting.metrics.includes(metric)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setCampaignData(prev => ({
                              ...prev,
                              abTesting: {
                                ...prev.abTesting,
                                metrics: isChecked
                                  ? [...prev.abTesting.metrics, metric]
                                  : prev.abTesting.metrics.filter(m => m !== metric)
                              }
                            }));
                          }}
                          className="rounded"
                        />
                        <span>{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            {!creationResult ? (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Campaign Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {campaignData.name}</p>
                    <p><strong>Objective:</strong> {campaignData.objective}</p>
                    <p><strong>Platforms:</strong> {campaignData.platforms.join(', ')}</p>
                    <p><strong>Budget:</strong> ${campaignData.budget.total} (${campaignData.budget.dailyLimit}/day)</p>
                    <p><strong>A/B Testing:</strong> {campaignData.abTesting.enabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Before You Continue</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        Please review all campaign settings carefully. Once created, some settings may require campaign restart to modify.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateCampaign}
                  disabled={isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating Campaign...
                    </>
                  ) : (
                    'Create Campaign'
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                {creationResult.success ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="text-lg font-semibold text-green-900">Campaign Created Successfully!</h3>
                    <p className="text-gray-600">{creationResult.message}</p>
                    
                    <div className="bg-green-50 p-4 rounded-lg text-left">
                      <h4 className="font-semibold mb-2">Campaign Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Estimated Reach</p>
                          <p className="font-semibold">{creationResult.data.metrics.estimatedReach.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Estimated CPM</p>
                          <p className="font-semibold">${creationResult.data.metrics.estimatedCPM}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Estimated CTR</p>
                          <p className="font-semibold">{creationResult.data.metrics.estimatedCTR}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Platforms</p>
                          <p className="font-semibold">{creationResult.data.metrics.successful}/{campaignData.platforms.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => window.location.href = '/campaigns'}>
                        View All Campaigns
                      </Button>
                      <Button onClick={() => window.location.href = `/campaigns/${creationResult.data.id}`}>
                        View Campaign Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <h3 className="text-lg font-semibold text-red-900">Campaign Creation Failed</h3>
                    <p className="text-gray-600">{creationResult.error}</p>
                    <Button onClick={() => setCreationResult(null)} variant="outline">
                      Try Again
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
        <p className="text-gray-600">Set up your marketing campaign across multiple platforms with AI optimization</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${isActive ? 'border-blue-500 bg-blue-500 text-white' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                    'border-gray-300 bg-white text-gray-400'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <Progress value={(currentStep / steps.length) * 100} className="w-full" />
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {steps[currentStep - 1] && (
              <>
                {React.createElement(steps[currentStep - 1].icon, { className: 'w-5 h-5 mr-2' })}
                {steps[currentStep - 1].title}
              </>
            )}
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {!creationResult && (
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length}
          >
            {currentStep === steps.length ? 'Review' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}