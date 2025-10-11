import React, { createContext, useContext, useReducer, useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTestUser, createTestCampaign, createTestMetrics } from './test-mocks';

// Mock Context Providers
interface AuthState {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: any) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
  });

  const login = (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    setTimeout(() => {
      const user = createTestUser({ email, role: 'admin' });
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }, 100);
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: any) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Campaign Context
interface CampaignState {
  campaigns: any[];
  selectedCampaign: any;
  loading: boolean;
  error: string | null;
}

const CampaignContext = createContext<any>(undefined);

const campaignReducer = (state: CampaignState, action: any) => {
  switch (action.type) {
    case 'FETCH_CAMPAIGNS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_CAMPAIGNS_SUCCESS':
      return { ...state, campaigns: action.payload, loading: false };
    case 'FETCH_CAMPAIGNS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'SELECT_CAMPAIGN':
      return { ...state, selectedCampaign: action.payload };
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [...state.campaigns, action.payload] };
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter(c => c.id !== action.payload),
      };
    default:
      return state;
  }
};

const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, {
    campaigns: [],
    selectedCampaign: null,
    loading: false,
    error: null,
  });

  const fetchCampaigns = async () => {
    dispatch({ type: 'FETCH_CAMPAIGNS_START' });
    try {
      const campaigns = [
        createTestCampaign({ name: 'Campaign 1' }),
        createTestCampaign({ name: 'Campaign 2' }),
      ];
      dispatch({ type: 'FETCH_CAMPAIGNS_SUCCESS', payload: campaigns });
    } catch (error) {
      dispatch({ type: 'FETCH_CAMPAIGNS_FAILURE', payload: 'Failed to fetch campaigns' });
    }
  };

  const selectCampaign = (campaign: any) => {
    dispatch({ type: 'SELECT_CAMPAIGN', payload: campaign });
  };

  const addCampaign = (campaign: any) => {
    dispatch({ type: 'ADD_CAMPAIGN', payload: campaign });
  };

  return (
    <CampaignContext.Provider value={{ state, fetchCampaigns, selectCampaign, addCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};

// Settings Context
interface SettingsState {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoOptimization: boolean;
  language: string;
  timezone: string;
}

const SettingsContext = createContext<any>(undefined);

const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'light',
    notifications: true,
    autoOptimization: false,
    language: 'en',
    timezone: 'UTC',
  });

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      notifications: true,
      autoOptimization: false,
      language: 'en',
      timezone: 'UTC',
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Test Components
const AuthTestComponent = () => {
  const { state, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {state.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-email">{state.user?.email || 'No User'}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
      {state.loading && <div data-testid="loading">Loading...</div>}
    </div>
  );
};

const CampaignTestComponent = () => {
  const { state, fetchCampaigns, selectCampaign } = useContext(CampaignContext);

  return (
    <div>
      <div data-testid="campaign-count">{state.campaigns.length}</div>
      <div data-testid="selected-campaign">{state.selectedCampaign?.name || 'None'}</div>
      <button onClick={fetchCampaigns}>Fetch Campaigns</button>
      {state.campaigns.map((campaign: any) => (
        <button
          key={campaign.id}
          onClick={() => selectCampaign(campaign)}
          data-testid={`campaign-${campaign.id}`}
        >
          {campaign.name}
        </button>
      ))}
      {state.loading && <div data-testid="loading">Loading...</div>}
      {state.error && <div data-testid="error">{state.error}</div>}
    </div>
  );
};

const SettingsTestComponent = () => {
  const { settings, updateSetting, resetSettings } = useContext(SettingsContext);

  return (
    <div>
      <div data-testid="theme">{settings.theme}</div>
      <div data-testid="notifications">{settings.notifications.toString()}</div>
      <button onClick={() => updateSetting('theme', 'dark')}>Set Dark Theme</button>
      <button onClick={() => updateSetting('notifications', false)}>Disable Notifications</button>
      <button onClick={resetSettings}>Reset Settings</button>
    </div>
  );
};

describe('Context Tests', () => {
  describe('AuthContext', () => {
    it('should initialize with unauthenticated state', () => {
      render(
        <AuthProvider>
          <AuthTestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    });

    it('should login user successfully', async () => {
      render(
        <AuthProvider>
          <AuthTestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));

      // Should show loading state
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Wait for login to complete
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    it('should logout user', async () => {
      render(
        <AuthProvider>
          <AuthTestComponent />
        </AuthProvider>
      );

      // First login
      fireEvent.click(screen.getByText('Login'));
      await new Promise(resolve => setTimeout(resolve, 150));

      // Then logout
      fireEvent.click(screen.getByText('Logout'));

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<AuthTestComponent />);
      }).toThrow('useAuth must be used within AuthProvider');

      console.error = originalError;
    });
  });

  describe('CampaignContext', () => {
    it('should initialize with empty campaigns', () => {
      render(
        <CampaignProvider>
          <CampaignTestComponent />
        </CampaignProvider>
      );

      expect(screen.getByTestId('campaign-count')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-campaign')).toHaveTextContent('None');
    });

    it('should fetch campaigns successfully', async () => {
      render(
        <CampaignProvider>
          <CampaignTestComponent />
        </CampaignProvider>
      );

      fireEvent.click(screen.getByText('Fetch Campaigns'));

      // Wait for campaigns to load
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(screen.getByTestId('campaign-count')).toHaveTextContent('2');
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });

    it('should select campaign', async () => {
      render(
        <CampaignProvider>
          <CampaignTestComponent />
        </CampaignProvider>
      );

      // First fetch campaigns
      fireEvent.click(screen.getByText('Fetch Campaigns'));
      await new Promise(resolve => setTimeout(resolve, 100));

      // Then select first campaign
      fireEvent.click(screen.getByText('Campaign 1'));

      expect(screen.getByTestId('selected-campaign')).toHaveTextContent('Campaign 1');
    });
  });

  describe('SettingsContext', () => {
    it('should initialize with default settings', () => {
      render(
        <SettingsProvider>
          <SettingsTestComponent />
        </SettingsProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('notifications')).toHaveTextContent('true');
    });

    it('should update theme setting', () => {
      render(
        <SettingsProvider>
          <SettingsTestComponent />
        </SettingsProvider>
      );

      fireEvent.click(screen.getByText('Set Dark Theme'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should update notifications setting', () => {
      render(
        <SettingsProvider>
          <SettingsTestComponent />
        </SettingsProvider>
      );

      fireEvent.click(screen.getByText('Disable Notifications'));

      expect(screen.getByTestId('notifications')).toHaveTextContent('false');
    });

    it('should reset all settings', () => {
      render(
        <SettingsProvider>
          <SettingsTestComponent />
        </SettingsProvider>
      );

      // Change some settings
      fireEvent.click(screen.getByText('Set Dark Theme'));
      fireEvent.click(screen.getByText('Disable Notifications'));

      // Reset settings
      fireEvent.click(screen.getByText('Reset Settings'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('notifications')).toHaveTextContent('true');
    });
  });

  describe('Multiple Context Providers', () => {
    const MultiContextComponent = () => {
      const { state: authState } = useAuth();
      const { settings } = useContext(SettingsContext);

      return (
        <div>
          <div data-testid="auth-user">{authState.user?.email || 'No User'}</div>
          <div data-testid="theme">{settings.theme}</div>
        </div>
      );
    };

    it('should work with multiple context providers', () => {
      render(
        <AuthProvider>
          <SettingsProvider>
            <MultiContextComponent />
          </SettingsProvider>
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-user')).toHaveTextContent('No User');
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  describe('Context Performance', () => {
    it('should not re-render when context value is the same', () => {
      let renderCount = 0;

      const TestComponent = () => {
        renderCount++;
        const { settings } = useContext(SettingsContext);
        return <div>{settings.theme}</div>;
      };

      const { rerender } = render(
        <SettingsProvider>
          <TestComponent />
        </SettingsProvider>
      );

      const initialRenderCount = renderCount;

      // Re-render with same provider
      rerender(
        <SettingsProvider>
          <TestComponent />
        </SettingsProvider>
      );

      // Component should only render once initially
      expect(renderCount).toBe(initialRenderCount);
    });
  });

  describe('Context Error Handling', () => {
    it('should handle context provider errors gracefully', () => {
      const ErrorTestComponent = () => {
        try {
          const { state } = useAuth();
          return <div>{state.user?.email}</div>;
        } catch (error) {
          return <div data-testid="error">Error occurred</div>;
        }
      };

      render(<ErrorTestComponent />);

      expect(screen.getByTestId('error')).toHaveTextContent('Error occurred');
    });
  });
});