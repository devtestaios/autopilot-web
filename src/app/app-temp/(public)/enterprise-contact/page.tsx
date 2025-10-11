'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NavigationTabs from '@/components/NavigationTabs';
import { 
  Crown,
  Users,
  Building,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Headphones,
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

export default function EnterpriseContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
    companySize: '',
    useCase: '',
    timeline: '',
    budget: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Thank You!
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Your enterprise inquiry has been received. Our Customer Account Specialist will contact you within 24 hours to discuss your custom solution.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What happens next?
                </h3>
                <div className="text-left text-blue-800 dark:text-blue-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Account Specialist review (within 2 hours)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Discovery call scheduled (within 24 hours)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>Custom proposal delivered (within 3 business days)</span>
                  </div>
                </div>
              </div>
              
              <Button asChild>
                <a href="/pricing">Back to Pricing</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-yellow-100 text-yellow-800 border-yellow-200">
              <Crown className="w-4 h-4 mr-1" />
              White Glove Enterprise Solutions
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Custom Enterprise Solutions
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Built for Scale
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Fortune 500 companies trust PulseBridge for mission-critical operations. 
              Get a custom solution designed specifically for your organization's unique needs.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>Global Infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-400" />
                <span>24/7 Dedicated Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    Speak with a Customer Account Specialist
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get a custom proposal within 24 hours. No generic demos - just solutions for your specific needs.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          First Name *
                        </label>
                        <Input
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Last Name *
                        </label>
                        <Input
                          required
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Smith"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Business Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john.smith@company.com"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Company *
                        </label>
                        <Input
                          required
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Acme Corporation"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Job Title *
                        </label>
                        <Input
                          required
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          placeholder="VP of Marketing"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Company Size *
                      </label>
                      <Select onValueChange={(value) => handleInputChange('companySize', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50-200">50-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                          <SelectItem value="1001-5000">1,001-5,000 employees</SelectItem>
                          <SelectItem value="5000+">5,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Implementation Timeline
                      </label>
                      <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="When are you looking to implement?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate (within 30 days)</SelectItem>
                          <SelectItem value="quarter">This quarter (within 90 days)</SelectItem>
                          <SelectItem value="planning">Planning phase (3-6 months)</SelectItem>
                          <SelectItem value="future">Future consideration (6+ months)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Annual Budget Range
                      </label>
                      <Select onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                          <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                          <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                          <SelectItem value="500k+">$500K+</SelectItem>
                          <SelectItem value="custom">Custom requirements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Tell us about your specific needs *
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Describe your organization's challenges, integration requirements, compliance needs, or any specific features you're looking for..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                      size="lg"
                    >
                      {isSubmitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          Get Custom Proposal
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By submitting this form, you agree to our privacy policy. We'll only contact you about enterprise solutions.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits & Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* What You Get */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    What You Get
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Dedicated Customer Success Manager',
                    'Custom onboarding & training program', 
                    'Priority feature development',
                    'White-label & custom branding',
                    'Enterprise security & compliance',
                    '24/7 priority support with SLAs',
                    'Custom integrations & API access',
                    'Volume discounts & flexible billing'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Process */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    Our Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Discovery Call</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Deep dive into your requirements and challenges
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Custom Proposal</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Tailored solution with pricing and implementation plan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">White Glove Launch</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Full implementation with dedicated success team
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Prefer to talk directly?
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span>enterprise@pulsebridge.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}