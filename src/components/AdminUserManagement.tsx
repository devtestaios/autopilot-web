import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Autocomplete,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

interface InternalUser {
  id: string;
  email: string;
  full_name: string;
  account_type: string;
  role: string;
  permissions: string[];
  department?: string;
  manager_email?: string;
  is_active: boolean;
  bypass_billing: boolean;
  suite_access: string[];
  created_at: string;
  last_login_at?: string;
  notes?: string;
}

interface PermissionTemplate {
  role_templates: Record<string, string[]>;
  all_permissions: string[];
  account_types: string[];
  roles: string[];
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [templates, setTemplates] = useState<PermissionTemplate | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuickTestDialogOpen, setIsQuickTestDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    account_type: 'internal_employee',
    role: 'employee',
    department: '',
    manager_email: '',
    notes: '',
    permissions: [] as string[],
    suite_access: ['ml_suite', 'financial_suite', 'ai_suite', 'hr_suite']
  });

  const [quickTestUser, setQuickTestUser] = useState({
    email: '',
    full_name: '',
    test_duration_days: 30,
    suite_access: ['ml_suite', 'financial_suite', 'ai_suite', 'hr_suite']
  });

  const [filters, setFilters] = useState({
    account_type: '',
    role: '',
    department: '',
    is_active: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchPermissionTemplates();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/users/internal');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissionTemplates = async () => {
    try {
      const response = await fetch('/api/v1/admin/users/permissions/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch permission templates');
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/users/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'User created successfully' });
        setIsCreateDialogOpen(false);
        resetNewUserForm();
        fetchUsers();
      } else {
        const error = await response.json();
        setAlert({ type: 'error', message: error.detail || 'Failed to create user' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuickTestUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/users/test-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quickTestUser)
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Test user created successfully' });
        setIsQuickTestDialogOpen(false);
        resetQuickTestForm();
        fetchUsers();
      } else {
        const error = await response.json();
        setAlert({ type: 'error', message: error.detail || 'Failed to create test user' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create test user' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/admin/users/internal/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        setAlert({ 
          type: 'success', 
          message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully` 
        });
        fetchUsers();
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update user status' });
    }
  };

  const resetNewUserForm = () => {
    setNewUser({
      email: '',
      full_name: '',
      account_type: 'internal_employee',
      role: 'employee',
      department: '',
      manager_email: '',
      notes: '',
      permissions: [],
      suite_access: ['ml_suite', 'financial_suite', 'ai_suite', 'hr_suite']
    });
  };

  const resetQuickTestForm = () => {
    setQuickTestUser({
      email: '',
      full_name: '',
      test_duration_days: 30,
      suite_access: ['ml_suite', 'financial_suite', 'ai_suite', 'hr_suite']
    });
  };

  const getRolePermissions = (role: string) => {
    return templates?.role_templates[role] || [];
  };

  const formatAccountType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPermission = (permission: string) => {
    return permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Box sx={{ p: 3 }}>
      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <AdminIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          PulseBridge Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={() => setIsQuickTestDialogOpen(true)}
            color="secondary"
          >
            Quick Test User
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Add Internal User
          </Button>
        </Box>
      </Box>

      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<GroupIcon />} label="All Users" />
        <Tab icon={<BusinessIcon />} label="Employees" />
        <Tab icon={<PersonIcon />} label="Test Users" />
        <Tab icon={<SecurityIcon />} label="Permissions" />
        <Tab icon={<SettingsIcon />} label="Settings" />
      </Tabs>

      {selectedTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Internal User Management
            </Typography>
            
            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={filters.account_type}
                    onChange={(e) => setFilters({...filters, account_type: e.target.value})}
                  >
                    <MenuItem value="">All</MenuItem>
                    {templates?.account_types.map(type => (
                      <MenuItem key={type} value={type}>{formatAccountType(type)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filters.role}
                    onChange={(e) => setFilters({...filters, role: e.target.value})}
                  >
                    <MenuItem value="">All</MenuItem>
                    {templates?.roles.map(role => (
                      <MenuItem key={role} value={role}>{formatRole(role)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Department"
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.is_active}
                    onChange={(e) => setFilters({...filters, is_active: e.target.value})}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Account Type</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Suite Access</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{user.full_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={formatAccountType(user.account_type)} 
                          size="small"
                          color={user.account_type === 'internal_employee' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>{formatRole(user.role)}</TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {user.suite_access.map(suite => (
                            <Chip 
                              key={suite} 
                              label={suite.replace('_suite', '').toUpperCase()} 
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          color={user.is_active ? 'success' : 'error'}
                          variant="dot"
                        >
                          {user.is_active ? (
                            <ActiveIcon color="success" />
                          ) : (
                            <InactiveIcon color="error" />
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit User">
                            <IconButton 
                              size="small"
                              onClick={() => setEditingUser(user)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.is_active ? "Deactivate" : "Activate"}>
                            <IconButton 
                              size="small"
                              onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                            >
                              {user.is_active ? <InactiveIcon /> : <ActiveIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Create User Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Internal User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newUser.full_name}
                onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={newUser.account_type}
                  onChange={(e) => setNewUser({...newUser, account_type: e.target.value})}
                >
                  {templates?.account_types.map(type => (
                    <MenuItem key={type} value={type}>{formatAccountType(type)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    setNewUser({
                      ...newUser, 
                      role,
                      permissions: getRolePermissions(role)
                    });
                  }}
                >
                  {templates?.roles.map(role => (
                    <MenuItem key={role} value={role}>{formatRole(role)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manager Email"
                type="email"
                value={newUser.manager_email}
                onChange={(e) => setNewUser({...newUser, manager_email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={templates?.all_permissions || []}
                value={newUser.permissions}
                onChange={(_, newValue) => setNewUser({...newUser, permissions: newValue})}
                renderInput={(params) => (
                  <TextField {...params} label="Additional Permissions" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      label={formatPermission(option)} 
                      {...getTagProps({ index })} 
                      size="small"
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={['ml_suite', 'financial_suite', 'ai_suite', 'hr_suite']}
                value={newUser.suite_access}
                onChange={(_, newValue) => setNewUser({...newUser, suite_access: newValue})}
                renderInput={(params) => (
                  <TextField {...params} label="Suite Access" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      label={option.replace('_suite', '').toUpperCase()} 
                      {...getTagProps({ index })} 
                      size="small"
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newUser.notes}
                onChange={(e) => setNewUser({...newUser, notes: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!newUser.email || !newUser.full_name || loading}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Test User Dialog */}
      <Dialog 
        open={isQuickTestDialogOpen} 
        onClose={() => setIsQuickTestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Create Quick Test Account
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Quickly create a test account with full PulseBridge access and billing bypass.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={quickTestUser.email}
                onChange={(e) => setQuickTestUser({...quickTestUser, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={quickTestUser.full_name}
                onChange={(e) => setQuickTestUser({...quickTestUser, full_name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Duration (Days)"
                type="number"
                value={quickTestUser.test_duration_days}
                onChange={(e) => setQuickTestUser({...quickTestUser, test_duration_days: parseInt(e.target.value)})}
                inputProps={{ min: 1, max: 365 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={['ml_suite', 'financial_suite', 'ai_suite', 'hr_suite']}
                value={quickTestUser.suite_access}
                onChange={(_, newValue) => setQuickTestUser({...quickTestUser, suite_access: newValue})}
                renderInput={(params) => (
                  <TextField {...params} label="Suite Access" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      label={option.replace('_suite', '').toUpperCase()} 
                      {...getTagProps({ index })} 
                      size="small"
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsQuickTestDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateQuickTestUser} 
            variant="contained"
            disabled={!quickTestUser.email || !quickTestUser.full_name || loading}
          >
            Create Test User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserManagement;