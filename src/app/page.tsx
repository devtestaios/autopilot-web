'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Shield,
  Wifi,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import HomeBanner from '@/components/HomeBanner';

export default function HomePage() {
  const features = [
    {
      icon: Wifi,
      title: 'OAuth Platform Connections',
      description: 'Securely connect Facebook Ads, Google Ads, LinkedIn, and more using industry-standard OAuth 2.0',
      status: 'Ready',
      color: 'text-green-600'
    },
    {
      icon: BarChart3,
      title: 'Unified Campaign Analytics',
      description: 'View performance metrics from all your marketing platforms in one centralized dashboard',
      status: 'Active',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      title: 'Real-time Data Sync',
      description: 'Automatically sync campaign data every hour with configurable alerts and notifications',
      status: 'Live',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, SOC 2 compliance, and read-only access to protect your data',
      status: 'Secure',
      color: 'text-orange-600'
    }
  ];
  
  const platforms = [
    { name: 'Facebook Ads', logo: '📘', status: 'Ready' },
    { name: 'Google Ads', logo: '🎯', status: 'Ready' },
    { name: 'LinkedIn Ads', logo: '💼', status: 'Ready' },
    { name: 'TikTok Business', logo: '🎵', status: 'Coming Soon' },
    { name: 'Twitter Ads', logo: '🐦', status: 'Coming Soon' },
    { name: 'Instagram Business', logo: '📸', status: 'Ready' }
  ];
  
  const benefits = [
    '✅ Save 10+ hours per week on manual reporting',
    '✅ Increase campaign ROI by 25% with unified insights',
    '✅ Reduce setup time from days to minutes',
    '✅ Never miss optimization opportunities with real-time alerts'
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeBanner />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Marketing Automation
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Made Simple
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect all your marketing platforms through secure OAuth flows and get unified campaign analytics, 
            automated reporting, and AI-powered optimization recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/platforms/setup">
              <Button size="lg" className="px-8">
                <Wifi className="h-5 w-5 mr-2" />
                Connect Your First Platform
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/platforms">
              <Button variant="outline" size="lg" className="px-8">
                <ExternalLink className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center ${feature.color} bg-opacity-10`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {feature.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Supported Platforms */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Supported Marketing Platforms</CardTitle>
            <CardDescription>
              Connect your existing marketing accounts through secure OAuth 2.0 authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {platforms.map((platform, index) => (
                <div key={index} className="text-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="text-3xl mb-2">{platform.logo}</div>
                  <h3 className="font-medium text-sm mb-1">{platform.name}</h3>
                  <Badge 
                    variant={platform.status === 'Ready' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {platform.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Benefits & CTA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose PulseBridge?
            </h2>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/platforms/setup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Connect your first marketing platform in under 2 minutes. 
                  No credit card required.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Read-only access</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span>OAuth 2.0 authentication</span>
                  </div>
                </div>
                
                <Link href="/platforms/setup" className="block mt-6">
                  <Button className="w-full" size="lg">
                    Connect Platform Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}