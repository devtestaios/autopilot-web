import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  BarChart3, 
  Zap, 
  Users,
  Shield,
  Brain,
  Crosshair,
  Palette,
  Server,
  Building,
  TrendingUp,
  CheckCircle,
  Star,
  Globe,
  Sparkles,
  Activity,
  Target,
  Crown,
  Rocket,
  Database,
  Settings,
  Lock,
  Eye,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: "Unified Campaign Management",
      description: "Multi-platform campaign orchestration with real-time optimization and automated performance tracking",
      icon: <Target className="h-8 w-8" />,
      href: "/unified",
      color: "blue",
      status: "Live",
      metrics: "45+ Platforms"
    },
    {
      title: "Advanced AI/ML Optimization",
      description: "Neural networks, reinforcement learning, and sophisticated ML models for campaign optimization",
      icon: <Brain className="h-8 w-8" />,
      href: "/ai",
      color: "purple",
      status: "Live", 
      metrics: "99.2% Accuracy"
    },
    {
      title: "Competitive Intelligence",
      description: "Real-time competitor tracking, market analysis, and gap identification to stay ahead",
      icon: <Crosshair className="h-8 w-8" />,
      href: "/competitive",
      color: "orange",
      status: "Live",
      metrics: "Real-time Monitoring"
    },
    {
      title: "Enterprise Authentication",
      description: "Role-based access control, SSO integration, and multi-tenancy with audit logging",
      icon: <Shield className="h-8 w-8" />,
      href: "/enterprise",
      color: "green",
      status: "Live",
      metrics: "Enterprise Grade"
    },
    {
      title: "White-Label & Partners",
      description: "Custom branding, API marketplace, partner portals, and revenue sharing ecosystem",
      icon: <Palette className="h-8 w-8" />,
      href: "/whitelabel",
      color: "pink",
      status: "Live",
      metrics: "Agency Ready"
    },
    {
      title: "Production Infrastructure",
      description: "99.99% uptime infrastructure with global CDN, auto-scaling, and enterprise security",
      icon: <Server className="h-8 w-8" />,
      href: "/infrastructure",
      color: "indigo",
      status: "Live",
      metrics: "99.97% Uptime"
    },
    {
      title: "Autopilot Mode",
      description: "Fully autonomous campaign management with AI-driven optimization and budget allocation",
      icon: <Bot className="h-8 w-8" />,
      href: "/autopilot",
      color: "red",
      status: "Live",
      metrics: "Full Automation"
    },
    {
      title: "Analytics & Insights",
      description: "Advanced analytics, predictive insights, and comprehensive reporting across all platforms",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/analytics",
      color: "cyan",
      status: "Live",
      metrics: "Deep Insights"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "border-blue-200 bg-blue-50 text-blue-700",
      purple: "border-purple-200 bg-purple-50 text-purple-700",
      orange: "border-orange-200 bg-orange-50 text-orange-700",
      green: "border-green-200 bg-green-50 text-green-700",
      pink: "border-pink-200 bg-pink-50 text-pink-700",
      indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
      red: "border-red-200 bg-red-50 text-red-700",
      cyan: "border-cyan-200 bg-cyan-50 text-cyan-700"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Rocket className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Autopilot
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            The Ultimate Enterprise Marketing Automation Platform
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Surpass Google Marketing Platform, Adobe Analytics, and all competitors with our AI-powered 
            marketing automation that autonomously manages campaigns, optimizes performance, and scales infinitely.
          </p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              99.97% Uptime
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
              <Brain className="h-5 w-5 mr-2" />
              AI-Powered
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-lg">
              <Crown className="h-5 w-5 mr-2" />
              Enterprise Grade
            </Badge>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Zap className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              <ExternalLink className="h-5 w-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Enterprise Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features That Dominate the Market
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built to outperform every competitor with advanced AI, real-time optimization, 
              enterprise security, and full automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 group cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl ${getColorClasses(feature.color)}`}>
                        {feature.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {feature.metrics}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">45+</div>
              <div className="text-sm text-gray-600">Integrated Platforms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
              <div className="text-sm text-gray-600">AI Accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$2.5M+</div>
              <div className="text-sm text-gray-600">Ad Spend Optimized</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Autonomous Operation</div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Dominate Your Market?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join the elite tier of marketing teams using the world's most advanced automation platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border border-gray-200">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Your Transformation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Building className="h-5 w-5 mr-2" />
              Enterprise Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}