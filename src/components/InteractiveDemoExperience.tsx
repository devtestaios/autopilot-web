import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Grid,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as AIIcon,
  TrendingUp as MLIcon,
  AccountBalance as FinanceIcon,
  People as HRIcon,
  Integration as IntegrationIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon
} from '@mui/icons-material';

interface DemoExperience {
  session_id: string;
  demo_type: string;
  authorized_user: boolean;
  demo_privileges: {
    full_feature_access: boolean;
    live_data_access: boolean;
    advanced_analytics: boolean;
    white_glove_support: boolean;
    custom_configurations: boolean;
    priority_demos: boolean;
  };
  available_suites: string[];
  interactive_modules: Array<{
    suite_name: string;
    interactive_features: Array<{
      name: string;
      description: string;
      demo_data: string;
      interaction_type: string;
    }>;
  }>;
  completion_pathway: {
    current_step: number;
    total_steps: number;
    steps: string[];
  };
  premium_support?: {
    dedicated_success_manager: boolean;
    technical_implementation_support: boolean;
    custom_integration_consultation: boolean;
    priority_feature_requests: boolean;
    direct_development_team_access: boolean;
  };
}

interface DemoMode {
  demo_mode: boolean;
  demo_user_type: string;
  full_access: boolean;
  message: string;
  special_features: string[];
}

const InteractiveDemoExperience: React.FC = () => {
  const [demoExperience, setDemoExperience] = useState<DemoExperience | null>(null);
  const [demoMode, setDemoMode] = useState<DemoMode | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedFeatures, setCompletedFeatures] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock user data - in production this would come from authentication
  const userEmail = "demo@pulsebridge.ai"; // This would be from auth context
  const sessionId = "demo_session_123"; // This would be from onboarding flow

  useEffect(() => {
    initializeDemoExperience();
  }, []);

  const initializeDemoExperience = async () => {
    setLoading(true);
    try {
      // First check if user has demo mode privileges
      const demoModeResponse = await fetch('/api/v1/onboarding/company-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: "Demo Company",
          industry: "Technology",
          company_size: "startup",
          user_email: userEmail
        })
      });

      const demoModeData = await demoModeResponse.json();
      setDemoMode(demoModeData.demo_mode_info);

      // Then create interactive demo experience
      const demoResponse = await fetch('/api/v1/onboarding/interactive-demo-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          selected_suites: ["ml_suite", "financial_suite", "ai_suite", "hr_suite"],
          user_email: userEmail
        })
      });

      const demoData = await demoResponse.json();
      setDemoExperience(demoData.demo_experience);
    } catch (error) {
      console.error('Failed to initialize demo experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureComplete = (featureName: string) => {
    setCompletedFeatures(prev => new Set([...prev, featureName]));
    
    // Auto-advance step if all features in current module are completed
    if (demoExperience && activeStep < demoExperience.interactive_modules.length - 1) {
      const currentModule = demoExperience.interactive_modules[activeStep];
      const moduleFeatures = currentModule.interactive_features.map(f => f.name);
      const completedInModule = moduleFeatures.filter(f => completedFeatures.has(f) || f === featureName);
      
      if (completedInModule.length === moduleFeatures.length) {
        setTimeout(() => setActiveStep(prev => prev + 1), 1000);
      }
    }
  };

  const handleCompleteDemo = async () => {
    setIsCompleting(true);
    try {
      const response = await fetch('/api/v1/onboarding/complete-demo-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_email: userEmail,
          selected_configuration: {
            selected_suites: demoExperience?.available_suites || [],
            custom_settings: {},
            integrations: {}
          }
        })
      });

      const completionData = await response.json();
      
      if (completionData.success) {
        setCompletionDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to complete demo:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getSuiteIcon = (suiteName: string) => {
    if (suiteName.includes('ML')) return <MLIcon />;
    if (suiteName.includes('Financial')) return <FinanceIcon />;
    if (suiteName.includes('AI')) return <AIIcon />;
    if (suiteName.includes('HR')) return <HRIcon />;
    return <DashboardIcon />;
  };

  const getInteractionComponent = (feature: any) => {
    if (feature.interaction_type === 'live_dashboard') {
      return (
        <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            🚀 Live Interactive Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {feature.demo_data}
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<PlayIcon />}
            onClick={() => handleFeatureComplete(feature.name)}
          >
            Launch Interactive Demo
          </Button>
        </Box>
      );
    }

    if (feature.interaction_type === 'configurable_model') {
      return (
        <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            ⚙️ Configure Live Model
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {feature.demo_data}
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<AnalyticsIcon />}
            onClick={() => handleFeatureComplete(feature.name)}
          >
            Build Your Model
          </Button>
        </Box>
      );
    }

    // Default interaction for standard demos
    return (
      <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          📺 Demo Preview
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {feature.demo_data}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<PlayIcon />}
          onClick={() => handleFeatureComplete(feature.name)}
        >
          View Demo
        </Button>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Loading your personalized demo experience...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (!demoExperience) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load demo experience. Please try again.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Demo Mode Alert */}
      {demoMode?.demo_mode && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          icon={<StarIcon />}
        >
          <Typography variant="h6">{demoMode.message}</Typography>
          <Box sx={{ mt: 1 }}>
            {demoMode.special_features.map((feature, index) => (
              <Chip 
                key={index} 
                label={feature} 
                size="small" 
                color="success" 
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🎯 Your Personalized PulseBridge Experience
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {demoExperience.authorized_user 
            ? "Full Interactive Access Activated" 
            : "Standard Demo Experience"
          }
        </Typography>
        
        {/* Progress Indicator */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Progress: {completedFeatures.size} features explored
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(completedFeatures.size / (demoExperience.interactive_modules.length * 3)) * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Box>

      {/* Premium Support Badge */}
      {demoExperience.premium_support && (
        <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SupportIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Premium Support Activated</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Dedicated Success Manager" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Technical Implementation Support" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Custom Integration Consultation" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Direct Development Team Access" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Interactive Modules Stepper */}
      <Stepper activeStep={activeStep} orientation="vertical">
        {demoExperience.interactive_modules.map((module, index) => (
          <Step key={index}>
            <StepLabel 
              icon={getSuiteIcon(module.suite_name)}
              StepIconProps={{
                sx: { fontSize: '2rem' }
              }}
            >
              <Typography variant="h5">{module.suite_name}</Typography>
            </StepLabel>
            <StepContent>
              <Grid container spacing={2}>
                {module.interactive_features.map((feature, featureIndex) => (
                  <Grid item xs={12} md={6} lg={4} key={featureIndex}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        border: completedFeatures.has(feature.name) ? '2px solid green' : '1px solid grey',
                        position: 'relative'
                      }}
                    >
                      {completedFeatures.has(feature.name) && (
                        <Chip 
                          label="Completed" 
                          color="success" 
                          size="small" 
                          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {feature.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {feature.description}
                        </Typography>
                        
                        {getInteractionComponent(feature)}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(prev => prev + 1)}
                  sx={{ mr: 1 }}
                  disabled={index === demoExperience.interactive_modules.length - 1}
                >
                  {index === demoExperience.interactive_modules.length - 1 ? 'Complete Demo' : 'Next Suite'}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Completion Button */}
      {completedFeatures.size > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleCompleteDemo}
            disabled={isCompleting}
            startIcon={<CheckIcon />}
            sx={{ 
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' },
              px: 4,
              py: 1.5
            }}
          >
            {isCompleting ? 'Completing...' : 'Complete Demo Experience & Access Platform'}
          </Button>
        </Box>
      )}

      {/* Completion Dialog */}
      <Dialog 
        open={completionDialogOpen} 
        onClose={() => setCompletionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          🎉 Congratulations! Demo Experience Complete
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your personalized PulseBridge platform is ready!
          </Alert>
          
          <Typography variant="h6" gutterBottom>
            Next Steps:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Access Your Dashboard" 
                secondary="Your customized dashboard is ready with all explored features"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><IntegrationIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Connect Your Data Sources" 
                secondary="Start with your most important business data"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><SupportIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Meet Your Success Manager" 
                secondary="Schedule your first implementation call"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletionDialogOpen(false)}>
            Continue Exploring
          </Button>
          <Button 
            variant="contained" 
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractiveDemoExperience;