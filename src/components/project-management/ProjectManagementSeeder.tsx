'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2, CheckCircle2 } from 'lucide-react';

// ============================================================================
// SAMPLE DATA SEEDER
// ============================================================================

export function ProjectManagementSeeder() {
  const {
    projects,
    tasks,
    teamMembers,
    createProject,
    createTask,
    addTeamMember,
    createFromTemplate,
    getProjectTemplates
  } = useProjectManagement();

  const [isSeeding, setIsSeeding] = React.useState(false);
  const [seedStatus, setSeedStatus] = React.useState<string>('');

  // ========== SAMPLE PROJECT DATA ==========
  const sampleProjects = [
    {
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX and improved performance',
      priority: 'high' as const,
      budget: 25000,
      color: '#3B82F6',
      tags: ['Design', 'Development', 'UX'],
      templateId: 'software_development'
    },
    {
      name: 'Q1 Marketing Campaign',
      description: 'Launch comprehensive marketing campaign for Q1 product launch',
      priority: 'highest' as const,
      budget: 50000,
      color: '#EC4899',
      tags: ['Marketing', 'Campaign', 'Launch'],
      templateId: 'marketing_campaign'
    },
    {
      name: 'Mobile App Development',
      description: 'Develop native mobile application for iOS and Android platforms',
      priority: 'high' as const,
      budget: 75000,
      color: '#8B5CF6',
      tags: ['Mobile', 'iOS', 'Android', 'Development'],
      templateId: 'software_development'
    },
    {
      name: 'Annual Conference Planning',
      description: 'Plan and execute the annual company conference with 500+ attendees',
      priority: 'medium' as const,
      budget: 100000,
      color: '#F59E0B',
      tags: ['Event', 'Conference', 'Planning'],
      templateId: 'event_planning'
    }
  ];

  // ========== SAMPLE TASK DATA ==========
  const sampleTasks = [
    // Website Redesign Tasks
    {
      title: 'User Research & Analysis',
      description: 'Conduct user interviews and analyze current website performance',
      status: 'done' as const,
      priority: 'high' as const,
      estimatedHours: 40,
      tags: ['Research', 'UX']
    },
    {
      title: 'Design System Creation',
      description: 'Create comprehensive design system and component library',
      status: 'in_progress' as const,
      priority: 'high' as const,
      estimatedHours: 60,
      tags: ['Design', 'System']
    },
    {
      title: 'Frontend Development',
      description: 'Implement responsive frontend using React and TypeScript',
      status: 'todo' as const,
      priority: 'high' as const,
      estimatedHours: 120,
      tags: ['Development', 'React', 'TypeScript']
    },
    // Marketing Campaign Tasks
    {
      title: 'Market Research',
      description: 'Analyze target market and competitor strategies',
      status: 'done' as const,
      priority: 'highest' as const,
      estimatedHours: 32,
      tags: ['Research', 'Market']
    },
    {
      title: 'Campaign Strategy Document',
      description: 'Create comprehensive campaign strategy and timeline',
      status: 'in_progress' as const,
      priority: 'highest' as const,
      estimatedHours: 24,
      tags: ['Strategy', 'Planning']
    },
    {
      title: 'Creative Asset Production',
      description: 'Design and produce all marketing materials and assets',
      status: 'todo' as const,
      priority: 'high' as const,
      estimatedHours: 80,
      tags: ['Creative', 'Design']
    },
    // Mobile App Tasks
    {
      title: 'Technical Architecture',
      description: 'Define technical architecture and technology stack',
      status: 'review' as const,
      priority: 'high' as const,
      estimatedHours: 40,
      tags: ['Architecture', 'Technical']
    },
    {
      title: 'iOS Development',
      description: 'Develop native iOS application',
      status: 'todo' as const,
      priority: 'high' as const,
      estimatedHours: 200,
      tags: ['iOS', 'Swift', 'Development']
    },
    // Conference Planning Tasks
    {
      title: 'Venue Selection',
      description: 'Research and select appropriate venue for the conference',
      status: 'done' as const,
      priority: 'medium' as const,
      estimatedHours: 16,
      tags: ['Venue', 'Planning']
    },
    {
      title: 'Speaker Outreach',
      description: 'Contact and confirm keynote speakers',
      status: 'in_progress' as const,
      priority: 'medium' as const,
      estimatedHours: 24,
      tags: ['Speakers', 'Outreach']
    }
  ];

  // ========== SEED SAMPLE DATA ==========
  const seedSampleData = async () => {
    setIsSeeding(true);
    setSeedStatus('Creating sample projects and tasks...');

    try {
      const templates = getProjectTemplates();
      const createdProjects: any[] = [];

      // Create projects
      for (const projectData of sampleProjects) {
        setSeedStatus(`Creating project: ${projectData.name}`);
        
        const template = templates.find(t => t.id === projectData.templateId);
        const project = await createFromTemplate(template!.id, {
          name: projectData.name,
          description: projectData.description,
          priority: projectData.priority,
          budget: projectData.budget,
          color: projectData.color,
          tags: projectData.tags,
          startDate: new Date(),
          owner: teamMembers[0],
          team: teamMembers,
          visibility: 'team' as const
        });

        createdProjects.push(project);
        
        // Wait a bit to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Create tasks for projects
      let taskIndex = 0;
      for (let i = 0; i < createdProjects.length; i++) {
        const project = createdProjects[i];
        const projectTaskCount = Math.floor(sampleTasks.length / createdProjects.length);
        
        for (let j = 0; j < projectTaskCount && taskIndex < sampleTasks.length; j++) {
          const taskData = sampleTasks[taskIndex];
          setSeedStatus(`Creating task: ${taskData.title}`);
          
          await createTask({
            ...taskData,
            projectId: project.id,
            assignedTo: [teamMembers[Math.floor(Math.random() * teamMembers.length)].id],
            dependencies: [],
            subtasks: [],
            attachments: [],
            comments: [],
            customFields: {},
            position: j,
            createdBy: teamMembers[0].id,
            dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within 30 days
          });
          
          taskIndex++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setSeedStatus('Sample data created successfully!');
      setTimeout(() => {
        setIsSeeding(false);
        setSeedStatus('');
      }, 2000);
      
    } catch (error) {
      console.error('Error seeding data:', error);
      setSeedStatus('Error creating sample data');
      setIsSeeding(false);
    }
  };

  // ========== CLEAR ALL DATA ==========
  const clearAllData = () => {
    setSeedStatus('Feature not implemented yet');
    setTimeout(() => setSeedStatus(''), 2000);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Project Management Demo Data
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Seed your project management system with sample data to explore all features
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ========== STATUS ========== */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{tasks.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{teamMembers.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Team Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {tasks.filter(t => t.status === 'done').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>

        {/* ========== SAMPLE DATA PREVIEW ========== */}
        <div>
          <h4 className="font-medium mb-3">Sample Data Includes:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-blue-600">📁 Projects</div>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Website Redesign</li>
                <li>• Q1 Marketing Campaign</li>
                <li>• Mobile App Development</li>
                <li>• Annual Conference</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-green-600">✓ Features</div>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Multiple project templates</li>
                <li>• Various task statuses</li>
                <li>• Different priority levels</li>
                <li>• Team assignments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========== STATUS MESSAGE ========== */}
        {seedStatus && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {isSeeding ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <span className="text-sm">{seedStatus}</span>
          </div>
        )}

        {/* ========== ACTIONS ========== */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={seedSampleData}
            disabled={isSeeding || projects.length > 0}
            className="flex-1"
          >
            {isSeeding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Sample Data...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Create Sample Data
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={clearAllData}
            disabled={isSeeding || projects.length === 0}
            className="flex-1"
          >
            Clear All Data
          </Button>
        </div>

        {projects.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Sample data already exists. Clear existing data first to create new samples.
          </div>
        )}
      </CardContent>
    </Card>
  );
}