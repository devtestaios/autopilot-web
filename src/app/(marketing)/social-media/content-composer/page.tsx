'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Video, 
  FileText, 
  Send, 
  Calendar, 
  Hash, 
  AtSign,
  Upload,
  Wand2,
  Eye,
  Clock
} from 'lucide-react';

export default function ContentComposerPage() {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [postType, setPostType] = useState<'now' | 'schedule' | 'draft'>('now');

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' }
  ];

  const contentTemplates = [
    {
      id: 1,
      title: 'Product Announcement',
      content: 'Exciting news! 🎉 We\'re thrilled to announce our latest feature that will revolutionize your workflow. #ProductLaunch #Innovation #TechNews'
    },
    {
      id: 2,
      title: 'Behind the Scenes',
      content: 'Take a peek behind the curtain! Here\'s how our team brings ideas to life. ✨ #BehindTheScenes #TeamWork #Process'
    },
    {
      id: 3,
      title: 'Customer Success Story',
      content: 'Amazing results from our client! 📈 See how they achieved 300% growth using our platform. #SuccessStory #Results #ClientSpotlight'
    },
    {
      id: 4,
      title: 'Educational Content',
      content: 'Pro tip: Did you know that optimizing your content for each platform can increase engagement by 45%? 💡 #Tips #Education #Marketing'
    }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
    }
  };

  const handleTemplateSelect = (template: typeof contentTemplates[0]) => {
    setPostContent(template.content);
  };

  const handleAIGenerate = () => {
    // Simulate AI content generation
    const aiContent = "🚀 Harness the power of AI to supercharge your marketing! Our latest automation features are designed to save you time while maximizing engagement. Ready to transform your strategy? #AI #Marketing #Automation";
    setPostContent(aiContent);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 data-testid="content-composer-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Composer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, schedule, and publish content across all your social media platforms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Composer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Platforms
              </h2>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? platform.color + ' scale-105 shadow-lg'
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Composer */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Compose Your Post
                </h2>
                <button
                  onClick={handleAIGenerate}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>AI Generate</span>
                </button>
              </div>

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind? Share your thoughts, insights, or updates..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{postContent.length}/280 characters</span>
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-1 hover:text-blue-500">
                    <Hash className="h-4 w-4" />
                    <span>Hashtags</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-500">
                    <AtSign className="h-4 w-4" />
                    <span>Mentions</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Media
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Support for images and videos up to 50MB
                  </p>
                </label>
              </div>

              {mediaFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Uploaded Files:
                  </h3>
                  <div className="space-y-2">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        {file.type.startsWith('image/') ? (
                          <Image className="h-4 w-4" />
                        ) : (
                          <Video className="h-4 w-4" />
                        )}
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Publishing Options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Publishing Options
              </h2>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setPostType('now')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      postType === 'now'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                    <span>Post Now</span>
                  </button>

                  <button
                    onClick={() => setPostType('schedule')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      postType === 'schedule'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </button>

                  <button
                    onClick={() => setPostType('draft')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      postType === 'draft'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Save as Draft</span>
                  </button>
                </div>

                {postType === 'schedule' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-6">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>

                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  {postType === 'now' && 'Publish Now'}
                  {postType === 'schedule' && 'Schedule Post'}
                  {postType === 'draft' && 'Save Draft'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Content Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content Templates
              </h2>
              <div className="space-y-3">
                {contentTemplates.map((template) => (
                  <motion.button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    whileHover={{ scale: 1.02 }}
                    className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {template.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {template.content}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Scheduled Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Scheduled Posts
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Product launch announcement</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Weekly team spotlight</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}