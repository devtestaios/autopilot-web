'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useProjectManagement, ProjectTemplate } from '@/contexts/ProjectManagementContext';
import {
  Calendar,
  Users,
  Target,
  Clock,
  DollarSign,
  Tag,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Rocket,
  Palette,
  Settings,
  X
} from 'lucide-react';

// ============================================================================
// PROJECT CREATION WIZARD
// ============================================================================

interface ProjectCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectCreationWizard({ isOpen, onClose }: ProjectCreationWizardProps) {
  const { createProject, createFromTemplate, getProjectTemplates, teamMembers } = useProjectManagement();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: '',
    priority: 'medium' as const,
    visibility: 'team' as const,
    color: '#3B82F6',
    tags: [] as string[],
    teamMembers: [] as string[]
  });

  const templates = getProjectTemplates();
  const totalSteps = 4;

  // ========== TEMPLATE CATEGORIES ==========
  const templateCategories = [
    { id: 'Technology', name: 'Technology', icon: '💻', color: 'bg-blue-500' },
    { id: 'Marketing', name: 'Marketing', icon: '📊', color: 'bg-pink-500' },
    { id: 'Product', name: 'Product', icon: '🚀', color: 'bg-purple-500' },
    { id: 'Operations', name: 'Operations', icon: '⚙️', color: 'bg-green-500' },
    { id: 'General', name: 'General', icon: '📋', color: 'bg-gray-500' }
  ];

  // ========== PRIORITY OPTIONS ==========
  const priorityOptions = [
    { value: 'lowest', label: 'Lowest', color: 'bg-gray-100 text-gray-800' },
    { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'highest', label: 'Highest', color: 'bg-red-100 text-red-800' }
  ];

  // ========== COLOR OPTIONS ==========
  const colorOptions = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', 
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
  ];

  // ========== HANDLE PROJECT CREATION ==========
  const handleCreateProject = async () => {
    try {
      const projectPayload = {
        name: projectData.name,
        description: projectData.description,
        status: 'planning' as const,
        priority: projectData.priority,
        startDate: new Date(projectData.startDate),
        endDate: projectData.endDate ? new Date(projectData.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: 0,
        budget: projectData.budget ? parseFloat(projectData.budget) : undefined,
        owner: teamMembers[0] || {
          id: 'default',
          name: 'Default User',
          email: 'user@example.com',
          role: 'Project Manager',
          workload: 0,
          skills: [],
          isActive: true
        },
        team: teamMembers.filter(m => projectData.teamMembers.includes(m.id)),
        tags: projectData.tags,
        color: projectData.color,
        visibility: projectData.visibility,
        customFields: {}
      };

      if (selectedTemplate) {
        await createFromTemplate(selectedTemplate.id, projectPayload);
      } else {
        await createProject(projectPayload);
      }

      onClose();
      setCurrentStep(1);
      setSelectedTemplate(null);
      setProjectData({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        budget: '',
        priority: 'medium',
        visibility: 'team',
        color: '#3B82F6',
        tags: [],
        teamMembers: []
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // ========== STEP NAVIGATION ==========
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* ========== HEADER ========== */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Project
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* ========== PROGRESS INDICATOR ========== */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {i + 1 <= currentStep ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    i + 1 < currentStep 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Template</span>
            <span>Details</span>
            <span>Settings</span>
            <span>Review</span>
          </div>
        </div>

        {/* ========== STEP CONTENT ========== */}
        <div className="px-6 pb-6">
          {/* ========== STEP 1: TEMPLATE SELECTION ========== */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Choose a Project Template
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start with a proven template or create from scratch
                </p>
              </div>

              {/* ========== TEMPLATE CATEGORIES ========== */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {templateCategories.map((category) => (
                  <button
                    key={category.id}
                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white text-lg mb-2`}>
                      {category.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* ========== TEMPLATE GRID ========== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* ========== BLANK PROJECT OPTION ========== */}
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    !selectedTemplate 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                  onClick={() => setSelectedTemplate(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          Blank Project
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Start from scratch with complete customization
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Custom
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ========== TEMPLATE OPTIONS ========== */}
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTemplate?.id === template.id 
                        ? 'ring-2 ring-blue-500 border-blue-500' 
                        : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                template.complexity === 'simple' ? 'border-green-300 text-green-700' :
                                template.complexity === 'moderate' ? 'border-yellow-300 text-yellow-700' :
                                'border-red-300 text-red-700'
                              }`}
                            >
                              {template.complexity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========== STEP 2: PROJECT DETAILS ========== */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Project Details
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Define your project's basic information and timeline
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <Input
                      value={projectData.name}
                      onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                      placeholder="Enter project name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={projectData.description}
                      onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                      placeholder="Describe your project"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        value={projectData.budget}
                        onChange={(e) => setProjectData({ ...projectData, budget: e.target.value })}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={projectData.startDate}
                        onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date (Optional)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={projectData.endDate}
                        onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setProjectData({ ...projectData, priority: option.value as any })}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            projectData.priority === option.value
                              ? option.color
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== STEP 3: PROJECT SETTINGS ========== */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Project Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Customize appearance and team access
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Project Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setProjectData({ ...projectData, color })}
                          className={`w-8 h-8 rounded-full transition-all ${
                            projectData.color === color
                              ? 'ring-2 ring-offset-2 ring-blue-500'
                              : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Visibility
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'private', label: 'Private', desc: 'Only you can see this project' },
                        { value: 'team', label: 'Team', desc: 'Team members can see this project' },
                        { value: 'organization', label: 'Organization', desc: 'Everyone in organization can see this project' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setProjectData({ ...projectData, visibility: option.value as any })}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            projectData.visibility === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="h-4 w-4" />
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {option.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (Optional)
                    </label>
                    <Input
                      placeholder="Add tags (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newTag = e.currentTarget.value.trim();
                          if (!projectData.tags.includes(newTag)) {
                            setProjectData({
                              ...projectData,
                              tags: [...projectData.tags, newTag]
                            });
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    {projectData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {projectData.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                              onClick={() => setProjectData({
                                ...projectData,
                                tags: projectData.tags.filter((_, i) => i !== index)
                              })}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team Members (Optional)
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {teamMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => {
                            const isSelected = projectData.teamMembers.includes(member.id);
                            setProjectData({
                              ...projectData,
                              teamMembers: isSelected
                                ? projectData.teamMembers.filter(id => id !== member.id)
                                : [...projectData.teamMembers, member.id]
                            });
                          }}
                          className={`w-full text-left p-2 rounded-lg border transition-all ${
                            projectData.teamMembers.includes(member.id)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <div>
                              <span className="font-medium">{member.name}</span>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {member.role}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== STEP 4: REVIEW & CREATE ========== */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Review & Create
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Review your project details before creating
                </p>
              </div>

              <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Project Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {projectData.name || 'Untitled Project'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Template:</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedTemplate ? selectedTemplate.name : 'Blank Project'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                            <Badge className={priorityOptions.find(p => p.value === projectData.priority)?.color}>
                              {priorityOptions.find(p => p.value === projectData.priority)?.label}
                            </Badge>
                          </div>
                          {projectData.budget && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                              <span className="text-gray-900 dark:text-white">
                                ${parseFloat(projectData.budget).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {projectData.description && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {projectData.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Timeline & Settings
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                            <span className="text-gray-900 dark:text-white">
                              {new Date(projectData.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          {projectData.endDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                              <span className="text-gray-900 dark:text-white">
                                {new Date(projectData.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
                            <span className="text-gray-900 dark:text-white capitalize">
                              {projectData.visibility}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Color:</span>
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: projectData.color }}
                            />
                          </div>
                        </div>
                      </div>

                      {projectData.tags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Tags
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {projectData.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {projectData.teamMembers.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Team Members
                          </h4>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {projectData.teamMembers.length} member{projectData.teamMembers.length !== 1 ? 's' : ''} selected
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* ========== FOOTER ACTIONS ========== */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : prevStep}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={currentStep === 2 && !projectData.name.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateProject}
                disabled={!projectData.name.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}