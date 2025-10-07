'use client';

import React from 'react';
import { themeClasses, marketingThemeClasses, cn } from '@/lib/theme-utils';
import { useTheme } from '@/contexts/ThemeContext';
import NavigationTabs from '@/components/NavigationTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Moon, 
  Palette, 
  Eye, 
  Settings, 
  Heart,
  Star,
  Zap,
  Check,
  X,
  Info,
  AlertTriangle
} from 'lucide-react';

export default function UnifiedThemeDemo() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cn(themeClasses.appBackground)}>
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className={cn(themeClasses.textPrimary, "text-3xl font-bold")}>
              🎨 Unified Theme System Demo
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                Current: {theme === 'dark' ? 'Dark' : 'Light'} Mode
              </Badge>
              <Button 
                onClick={toggleTheme}
                className={cn(themeClasses.buttonSecondary)}
                size="sm"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </div>
          </div>
          <p className={cn(themeClasses.textSecondary, "text-lg")}>
            Testing the unified theme system across all component types
          </p>
        </div>

        {/* Theme Variables Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className={cn(themeClasses.card)}>
            <CardHeader>
              <CardTitle className={cn(themeClasses.textPrimary, "flex items-center gap-2")}>
                <Palette className="w-5 h-5" />
                Color Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={cn(themeClasses.textSecondary, "text-sm mb-2")}>Background Colors</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-theme-app border-2 border-theme-primary"></div>
                      <span className={cn(themeClasses.textMuted, "text-xs")}>App Background</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-theme-card border-2 border-theme-primary"></div>
                      <span className={cn(themeClasses.textMuted, "text-xs")}>Card Background</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-theme-surface border-2 border-theme-primary"></div>
                      <span className={cn(themeClasses.textMuted, "text-xs")}>Surface</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className={cn(themeClasses.textSecondary, "text-sm mb-2")}>Text Colors</p>
                  <div className="space-y-2">
                    <div className={cn(themeClasses.textPrimary, "text-sm")}>Primary Text</div>
                    <div className={cn(themeClasses.textSecondary, "text-sm")}>Secondary Text</div>
                    <div className={cn(themeClasses.textMuted, "text-sm")}>Muted Text</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(themeClasses.card)}>
            <CardHeader>
              <CardTitle className={cn(themeClasses.textPrimary, "flex items-center gap-2")}>
                <Eye className="w-5 h-5" />
                Visual Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={cn(themeClasses.surface, "p-4 rounded-lg")}>
                  <p className={cn(themeClasses.textPrimary, "font-medium mb-2")}>Surface Element</p>
                  <p className={cn(themeClasses.textSecondary, "text-sm")}>
                    This should be clearly readable on the surface background
                  </p>
                </div>
                <div className={cn(themeClasses.surfaceElevated, "p-4 rounded-lg")}>
                  <p className={cn(themeClasses.textPrimary, "font-medium mb-2")}>Elevated Surface</p>
                  <p className={cn(themeClasses.textSecondary, "text-sm")}>
                    This should have more contrast and appear elevated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Button Variations */}
        <Card className={cn(themeClasses.card, "mb-8")}>
          <CardHeader>
            <CardTitle className={cn(themeClasses.textPrimary, "flex items-center gap-2")}>
              <Settings className="w-5 h-5" />
              Button Variations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className={cn(themeClasses.buttonPrimary)}>
                <Heart className="w-4 h-4 mr-2" />
                Primary Button
              </Button>
              <Button className={cn(themeClasses.buttonSecondary)}>
                <Star className="w-4 h-4 mr-2" />
                Secondary Button
              </Button>
              <Button className={cn(themeClasses.buttonGhost)}>
                <Zap className="w-4 h-4 mr-2" />
                Ghost Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Platform Cards Test */}
        <Card className={cn(themeClasses.card, "mb-8")}>
          <CardHeader>
            <CardTitle className={cn(themeClasses.textPrimary)}>
              Marketing Platform Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Social Media', icon: Heart, status: 'Active' },
                { title: 'Email Marketing', icon: Star, status: 'Beta' },
                { title: 'Analytics', icon: Zap, status: 'Coming Soon' }
              ].map((platform, index) => {
                const IconComponent = platform.icon;
                return (
                  <div key={index} className={cn(marketingThemeClasses.platformCardHover)}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className={cn(themeClasses.textPrimary, "font-medium")}>
                          {platform.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {platform.status}
                        </Badge>
                      </div>
                    </div>
                    <p className={cn(themeClasses.textSecondary, "text-sm")}>
                      This platform card should be clearly readable in both themes
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Creator Exception */}
        <Card className={cn(themeClasses.card)}>
          <CardHeader>
            <CardTitle className={cn(themeClasses.textPrimary)}>
              Content Creator Exception
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn(themeClasses.textSecondary, "mb-4")}>
              The content creator area should always have a white background, regardless of theme:
            </p>
            <div className="content-creator-area p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Content Creation Canvas</h3>
              <p className="text-sm text-gray-600 mb-4">
                This area always uses a white background for content creation, ensuring designers can see true colors.
              </p>
              <div className="content-creator-area theme-card p-4">
                <p className="text-sm">
                  Even nested elements maintain the white background and dark text for content creation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}