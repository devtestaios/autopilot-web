'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  ExternalLink, 
  Info,
  Loader2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// =============================================================================
// TYPES
// =============================================================================

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  scopes: string[];
  isEnabled: boolean;
  requiredPermissions?: string[];
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

// =============================================================================
// PLATFORM SETUP WIZARD
// =============================================================================

export default function PlatformSetupPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();
  
  const steps: SetupStep[] = [
    {
      id: 'select',
      title: 'Select Platform',
      description: 'Choose the marketing platform you want to connect',
      isComplete: !!selectedPlatform
    },
    {
      id: 'permissions',
      title: 'Review Permissions',
      description: 'Understand what data we\'ll access from your account',
      isComplete: false
    },
    {
      id: 'connect',
      title: 'Connect Account',
      description: 'Authorize PulseBridge to access your marketing data',
      isComplete: false
    }
  ];
  
  // Load available platforms
  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const response = await fetch('/api/oauth');
        const data = await response.json();
        
        if (data.success) {
          setPlatforms(data.platforms.filter((p: Platform) => p.isEnabled));
        } else {
          toast({
            title: 'Loading Failed',
            description: 'Failed to load platform configurations',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading platforms:', error);
        toast({
          title: 'Loading Failed',
          description: 'Failed to load platform configurations',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlatforms();
  }, [toast]);
  
  // Handle platform selection
  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setCurrentStep(1);
  };
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle platform connection
  const handleConnect = async () => {
    if (!selectedPlatform) return;
    
    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform: selectedPlatform.id,
          redirectUrl: '/platforms?setup=complete'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to OAuth provider
        window.location.href = data.authUrl;
      } else {
        toast({
          title: 'Connection Failed',
          description: data.error || 'Failed to initiate platform connection',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error connecting platform:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to initiate platform connection',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading setup wizard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Connect Marketing Platform</h1>
          <p className="text-muted-foreground mt-2">
            Follow the steps below to connect your marketing platform
          </p>
        </div>
        
        <Button variant="outline" onClick={() => router.push('/platforms')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Platforms
        </Button>
      </div>
      
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-1 mx-4
                  ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold">{steps[currentStep].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </div>
      
      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Step 1: Platform Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Choose Your Platform</h2>
                <p className="text-muted-foreground">
                  Select the marketing platform you want to connect to PulseBridge
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map(platform => (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPlatform?.id === platform.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handlePlatformSelect(platform)}
                  >
                    <CardContent className="p-4 text-center">
                      <div 
                        className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center text-white text-lg font-semibold"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.name.charAt(0)}
                      </div>
                      <h3 className="font-semibold mb-1">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {platform.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {platform.scopes.length} permissions
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {platforms.length === 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No platforms are currently available for connection. Please contact your administrator.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          {/* Step 2: Permissions Review */}
          {currentStep === 1 && selectedPlatform && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center text-white text-xl font-semibold"
                  style={{ backgroundColor: selectedPlatform.color }}
                >
                  {selectedPlatform.name.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold mb-2">{selectedPlatform.name} Permissions</h2>
                <p className="text-muted-foreground">
                  Review what data PulseBridge will access from your {selectedPlatform.name} account
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                      What We'll Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedPlatform.requiredPermissions?.map((permission, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Zap className="h-5 w-5 mr-2 text-blue-600" />
                      What We'll Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Sync your campaign performance data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Generate automated performance reports</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Send alerts for campaign optimization</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Provide unified campaign analytics</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  <strong>Your data is secure:</strong> We use industry-standard encryption and only access data necessary for campaign optimization. We never make changes to your campaigns without your explicit permission.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {/* Step 3: Connect */}
          {currentStep === 2 && selectedPlatform && (
            <div className="space-y-6 text-center">
              <div>
                <div 
                  className="w-20 h-20 rounded-lg mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold"
                  style={{ backgroundColor: selectedPlatform.color }}
                >
                  {selectedPlatform.name.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold mb-2">Ready to Connect</h2>
                <p className="text-muted-foreground">
                  Click the button below to securely connect your {selectedPlatform.name} account
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold">What happens next:</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-medium">1. Authorize</p>
                    <p className="text-muted-foreground">Login to {selectedPlatform.name} and grant permissions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-medium">2. Sync Data</p>
                    <p className="text-muted-foreground">We'll import your campaign data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-medium">3. Complete</p>
                    <p className="text-muted-foreground">Start viewing unified analytics</p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                size="lg"
                className="px-8"
                style={{ backgroundColor: selectedPlatform.color }}
              >
                {isConnecting ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-5 w-5 mr-2" />
                )}
                Connect {selectedPlatform.name}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < 2 && (
          <Button
            onClick={handleNext}
            disabled={currentStep === 0 && !selectedPlatform}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}