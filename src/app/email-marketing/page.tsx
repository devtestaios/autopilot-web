/**
 * Email Marketing Platform - Main Interface
 * Comprehensive email marketing management with campaigns, automation, and analytics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useEmailMarketing } from '@/contexts/EmailMarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import NavigationTabs from '@/components/NavigationTabs';
import { 
  Mail, 
  Users, 
  Send, 
  Calendar, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Target,
  Zap,
  TrendingUp,
  Eye,
  Clock,
  UserMinus,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

// ==================== COMPONENT INTERFACES ====================

interface CampaignStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

interface QuickActionsProps {
  onCreateCampaign: () => void;
  onImportContacts: () => void;
  onCreateTemplate: () => void;
  onCreateAutomation: () => void;
}

// ==================== SUB-COMPONENTS ====================

const CampaignStatsCard: React.FC<CampaignStatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral' 
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {change && (
              <p className={`text-sm font-medium ${trendColor} flex items-center gap-1`}>
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {change}
              </p>
            )}
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateCampaign,
  onImportContacts,
  onCreateTemplate,
  onCreateAutomation
}) => {
  const actions = [
    { 
      label: 'Create Campaign', 
      icon: <Plus className="h-4 w-4" />, 
      onClick: onCreateCampaign,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      label: 'Import Contacts', 
      icon: <Upload className="h-4 w-4" />, 
      onClick: onImportContacts,
      color: 'bg-green-600 hover:bg-green-700'
    },
    { 
      label: 'New Template', 
      icon: <Mail className="h-4 w-4" />, 
      onClick: onCreateTemplate,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    { 
      label: 'Create Automation', 
      icon: <Zap className="h-4 w-4" />, 
      onClick: onCreateAutomation,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.onClick}
          className={`${action.color} text-white border-0 h-12 flex items-center gap-2 transition-all hover:scale-105`}
        >
          {action.icon}
          <span className="hidden sm:inline">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

const CampaignsList: React.FC = () => {
  const { campaigns, loading, sendCampaign, setActiveCampaign } = useEmailMarketing();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading.campaigns) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {campaign.name}
                    </h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Subject: {campaign.subject}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{campaign.stats.openRate.toFixed(1)}% Open Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{campaign.stats.clickRate.toFixed(1)}% Click Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{campaign.stats.totalSent.toLocaleString()} Sent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{campaign.sentDate ? new Date(campaign.sentDate).toLocaleDateString() : 'Not sent'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveCampaign(campaign)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Copy campaign */}}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => sendCampaign(campaign.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  )}
                  {campaign.status === 'sending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Pause campaign */}}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first email campaign.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ContactsOverview: React.FC = () => {
  const { contacts, segments, selectedContacts, selectContacts } = useEmailMarketing();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.firstName && contact.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.lastName && contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const subscribedCount = contacts.filter(c => c.status === 'subscribed').length;
  const unsubscribedCount = contacts.filter(c => c.status === 'unsubscribed').length;
  const bouncedCount = contacts.filter(c => c.status === 'bounced').length;

  return (
    <div className="space-y-6">
      {/* Contact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{subscribedCount.toLocaleString()}</div>
            <div className="text-sm text-green-600">Subscribed</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <UserMinus className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-600">{unsubscribedCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Unsubscribed</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{bouncedCount.toLocaleString()}</div>
            <div className="text-sm text-red-600">Bounced</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{segments.length}</div>
            <div className="text-sm text-blue-600">Segments</div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Search and List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contacts
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="col-span-1">
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Engagement</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.slice(0, 50).map((contact) => (
                  <div key={contact.id} className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-1">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              selectContacts([...selectedContacts, contact.id]);
                            } else {
                              selectContacts(selectedContacts.filter(id => id !== contact.id));
                            }
                          }}
                        />
                      </div>
                      <div className="col-span-4 font-medium text-gray-900 dark:text-white">
                        {contact.email}
                      </div>
                      <div className="col-span-2 text-gray-600 dark:text-gray-400">
                        {contact.firstName && contact.lastName 
                          ? `${contact.firstName} ${contact.lastName}` 
                          : 'No name'
                        }
                      </div>
                      <div className="col-span-2">
                        <Badge className={
                          contact.status === 'subscribed' ? 'bg-green-100 text-green-800' :
                          contact.status === 'unsubscribed' ? 'bg-gray-100 text-gray-800' :
                          contact.status === 'bounced' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {contact.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${contact.engagementScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{contact.engagementScore}%</span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AutomationsOverview: React.FC = () => {
  const { automations, loading } = useEmailMarketing();

  const activeAutomations = automations.filter(a => a.status === 'active').length;
  const totalTriggered = automations.reduce((sum, a) => sum + a.stats.totalTriggered, 0);
  const totalSent = automations.reduce((sum, a) => sum + a.stats.totalSent, 0);
  const avgConversionRate = automations.length > 0 
    ? (automations.reduce((sum, a) => sum + a.stats.conversionRate, 0) / automations.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Automation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <CampaignStatsCard
          title="Active Automations"
          value={activeAutomations}
          icon={<Zap className="h-6 w-6" />}
        />
        <CampaignStatsCard
          title="Total Triggered"
          value={totalTriggered.toLocaleString()}
          icon={<Play className="h-6 w-6" />}
        />
        <CampaignStatsCard
          title="Emails Sent"
          value={totalSent.toLocaleString()}
          icon={<Send className="h-6 w-6" />}
        />
        <CampaignStatsCard
          title="Avg. Conversion"
          value={`${avgConversionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Automations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Email Automations
            </CardTitle>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading.automations ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {automations.map((automation) => (
                <Card key={automation.id} className="bg-gray-50 dark:bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {automation.name}
                          </h4>
                          <Badge className={
                            automation.status === 'active' ? 'bg-green-100 text-green-800' :
                            automation.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {automation.status}
                          </Badge>
                        </div>
                        {automation.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {automation.description}
                          </p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Triggered:</span>
                            <span className="font-medium ml-1">{automation.stats.totalTriggered}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Sent:</span>
                            <span className="font-medium ml-1">{automation.stats.totalSent}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Open Rate:</span>
                            <span className="font-medium ml-1">
                              {automation.stats.totalSent > 0 
                                ? ((automation.stats.totalOpened / automation.stats.totalSent) * 100).toFixed(1) 
                                : 0}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Conversion:</span>
                            <span className="font-medium ml-1">{automation.stats.conversionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {/* Toggle automation */}}
                        >
                          {automation.status === 'active' ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {automations.length === 0 && (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No automations yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create automated email sequences to engage your audience.
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Automation
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function EmailMarketingPlatform() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'contacts' | 'automations' | 'analytics' | 'templates'>('overview');
  const { 
    campaigns, 
    contacts, 
    automations,
    loading,
    createCampaign,
    importContacts
  } = useEmailMarketing();

  // Calculate overview stats with proper null checks
  const totalCampaigns = (Array.isArray(campaigns) ? campaigns : []).length;
  const activeCampaigns = (Array.isArray(campaigns) ? campaigns.filter(c => c?.status === 'sending' || c?.status === 'scheduled') : []).length;
  const totalContacts = (Array.isArray(contacts) ? contacts : []).length;
  const subscribedContacts = (Array.isArray(contacts) ? contacts.filter(c => c?.status === 'subscribed') : []).length;
  const totalSent = (Array.isArray(campaigns) ? campaigns.reduce((sum, c) => sum + (c?.stats?.totalSent || 0), 0) : 0);
  const avgOpenRate = (Array.isArray(campaigns) && campaigns.length > 0) 
    ? (campaigns.reduce((sum, c) => sum + (c?.stats?.openRate || 0), 0) / campaigns.length)
    : 0;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'createCampaign':
        // Open campaign creation modal/page
        console.log('Create campaign');
        break;
      case 'importContacts':
        // Open contact import modal
        console.log('Import contacts');
        break;
      case 'createTemplate':
        // Open template creation
        console.log('Create template');
        break;
      case 'createAutomation':
        // Open automation creation
        console.log('Create automation');
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns':
        return <CampaignsList />;
      case 'contacts':
        return <ContactsOverview />;
      case 'automations':
        return <AutomationsOverview />;
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Analytics Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive email marketing analytics and reporting.
            </p>
          </div>
        );
      case 'templates':
        return (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Templates Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Email template library and designer.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CampaignStatsCard
                title="Total Campaigns"
                value={totalCampaigns}
                change={`${activeCampaigns} active`}
                icon={<Mail className="h-6 w-6" />}
                trend="neutral"
              />
              <CampaignStatsCard
                title="Total Contacts"
                value={totalContacts.toLocaleString()}
                change={`${subscribedContacts} subscribed`}
                icon={<Users className="h-6 w-6" />}
                trend="up"
              />
              <CampaignStatsCard
                title="Emails Sent"
                value={totalSent.toLocaleString()}
                change="Last 30 days"
                icon={<Send className="h-6 w-6" />}
                trend="up"
              />
              <CampaignStatsCard
                title="Avg Open Rate"
                value={`${avgOpenRate.toFixed(1)}%`}
                change="Industry avg: 21.3%"
                icon={<Eye className="h-6 w-6" />}
                trend={avgOpenRate > 21.3 ? "up" : "down"}
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions
                  onCreateCampaign={() => handleQuickAction('createCampaign')}
                  onImportContacts={() => handleQuickAction('importContacts')}
                  onCreateTemplate={() => handleQuickAction('createTemplate')}
                  onCreateAutomation={() => handleQuickAction('createAutomation')}
                />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {campaign.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {campaign.stats.openRate.toFixed(1)}% open rate • {campaign.stats.totalSent} sent
                        </p>
                      </div>
                      <Badge className={
                        campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Active Automations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {automations.filter(a => a.status === 'active').slice(0, 5).map((automation) => (
                    <div key={automation.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {automation.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {automation.stats.totalTriggered} triggered • {automation.stats.conversionRate.toFixed(1)}% conversion
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Email Marketing
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create, send, and analyze email campaigns with AI-powered optimization
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'campaigns', label: 'Campaigns', icon: Mail },
                  { id: 'contacts', label: 'Contacts', icon: Users },
                  { id: 'automations', label: 'Automations', icon: Zap },
                  { id: 'templates', label: 'Templates', icon: Settings },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}