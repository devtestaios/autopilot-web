'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Eye,
  MoreHorizontal,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Mock calendar events
  const calendarEvents = [
    {
      id: 1,
      title: 'Product Launch Post',
      platform: 'instagram',
      date: new Date(2025, 9, 15, 14, 0), // October 15, 2:00 PM
      status: 'scheduled',
      content: 'Exciting announcement! Our new AI features are live! 🚀'
    },
    {
      id: 2,
      title: 'Team Spotlight',
      platform: 'linkedin',
      date: new Date(2025, 9, 16, 10, 30), // October 16, 10:30 AM
      status: 'draft',
      content: 'Meet our incredible development team who make the magic happen!'
    },
    {
      id: 3,
      title: 'Customer Success Story',
      platform: 'twitter',
      date: new Date(2025, 9, 18, 16, 0), // October 18, 4:00 PM
      status: 'scheduled',
      content: 'Amazing results! See how @customerX achieved 300% growth with our platform.'
    },
    {
      id: 4,
      title: 'Behind the Scenes',
      platform: 'tiktok',
      date: new Date(2025, 9, 20, 12, 0), // October 20, 12:00 PM
      status: 'idea',
      content: 'Quick tour of our office and development process'
    }
  ];

  const platforms = [
    { id: 'all', name: 'All Platforms', color: 'bg-gray-500' },
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' }
  ];

  const statusColors = {
    scheduled: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    published: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    idea: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear() &&
             (selectedPlatform === 'all' || event.platform === selectedPlatform);
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 data-testid="content-calendar-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plan and schedule your content across all social media platforms
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Calendar Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex space-x-2">
              {(['month', 'week', 'day'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedView === view
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>

            {/* Platform Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>

              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Week Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-750"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {generateCalendarDays().map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = day && 
                new Date().getDate() === day && 
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-b border-r border-gray-200 dark:border-gray-700 ${
                    !day ? 'bg-gray-50 dark:bg-gray-750' : ''
                  } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {day}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => {
                          const platform = platforms.find(p => p.id === event.platform);
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="group relative"
                            >
                              <div
                                className={`p-1 rounded text-xs cursor-pointer transition-transform group-hover:scale-105 ${
                                  platform?.color || 'bg-gray-500'
                                } text-white`}
                              >
                                <div className="font-medium truncate">
                                  {event.title}
                                </div>
                                <div className="text-xs opacity-90">
                                  {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>

                              {/* Event tooltip/preview */}
                              <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {event.title}
                                  </h4>
                                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[event.status as keyof typeof statusColors]}`}>
                                    {event.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {event.content}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {platform?.name}
                                  </span>
                                  <div className="flex space-x-1">
                                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                      <Edit3 className="h-3 w-3" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                      <Eye className="h-3 w-3" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          
          <div className="space-y-3">
            {calendarEvents
              .filter(event => event.date > new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((event) => {
                const platform = platforms.find(p => p.id === event.platform);
                return (
                  <div
                    key={event.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full ${platform?.color || 'bg-gray-500'}`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[event.status as keyof typeof statusColors]}`}>
                      {event.status}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}