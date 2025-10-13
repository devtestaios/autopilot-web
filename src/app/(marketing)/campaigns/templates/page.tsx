'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// NavigationTabs removed - using root layout Navigation instead
import CampaignTemplateLibrary from '@/components/CampaignTemplateLibrary';
import { useToast } from '@/components/ui/Toast';

interface CampaignTemplate {
  id: string;
  name: string;
  category: string;
  industry: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedSetupTime: string;
  expectedROAS: string;
  platforms: string[];
}

export default function CampaignTemplatesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSelectTemplate = (template: CampaignTemplate) => {
    showToast({
      type: 'success',
      title: 'Template Selected',
      description: 'Creating new campaign from template...',
      duration: 3000
    });
    
    router.push('/campaigns/new?template=' + template.id);
  };

  const handlePreviewTemplate = (template: CampaignTemplate) => {
    showToast({
      type: 'info',
      title: 'Template Preview',
      description: 'Previewing template details',
      duration: 2000
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      <main className="p-4 md:p-8">
        <CampaignTemplateLibrary
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handlePreviewTemplate}
        />
      </main>
    </div>
  );
}
