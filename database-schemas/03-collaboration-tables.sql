-- ========================================
-- COLLABORATION DATABASE SCHEMA
-- ========================================

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'viewer', 'owner')),
    department VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    permissions TEXT[] DEFAULT '{}',
    bio TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    projects_count INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Team Activities Table
CREATE TABLE IF NOT EXISTS team_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('project', 'task', 'campaign', 'post', 'comment', 'file', 'meeting')),
    resource_id UUID NOT NULL,
    resource_name VARCHAR(255),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_name VARCHAR(255),
    user_avatar VARCHAR(500)
);

-- Collaboration Projects Table
CREATE TABLE IF NOT EXISTS collaboration_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    team_members UUID[] DEFAULT '{}',
    owner_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    project_type VARCHAR(50) DEFAULT 'marketing' CHECK (project_type IN ('marketing', 'content', 'campaign', 'design', 'development', 'research')),
    settings JSONB DEFAULT '{}',
    budget DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    task_count INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0
);

-- Project Tasks Table
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES collaboration_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'blocked')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
    created_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2) DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    dependencies UUID[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Task Comments Table
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES project_tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES task_comments(id) ON DELETE CASCADE,
    attachments JSONB DEFAULT '[]',
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ,
    reactions JSONB DEFAULT '{}'
);

-- User Presence Table (for real-time collaboration)
CREATE TABLE IF NOT EXISTS user_presence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
    current_page VARCHAR(255),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(255),
    device_info JSONB DEFAULT '{}',
    location_data JSONB DEFAULT '{}',
    
    UNIQUE(user_id, session_id)
);

-- Live Cursors Table (for real-time collaboration)
CREATE TABLE IF NOT EXISTS live_cursors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    cursor_x INTEGER,
    cursor_y INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, session_id, page_url)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('mention', 'assignment', 'comment', 'deadline', 'update', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    is_push_sent BOOLEAN DEFAULT false,
    is_email_sent BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Team Meetings Table
CREATE TABLE IF NOT EXISTS team_meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    participants UUID[] DEFAULT '{}',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    meeting_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    agenda TEXT,
    notes TEXT,
    recording_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Collaboration Tables
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_activities_user ON team_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_resource ON team_activities(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_created ON team_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON collaboration_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON collaboration_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_due_date ON collaboration_projects(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON project_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_user ON user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON user_presence(status);
CREATE INDEX IF NOT EXISTS idx_cursors_page ON live_cursors(page_url);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_meetings_organizer ON team_meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON team_meetings(start_time);

-- Row Level Security (RLS) Policies
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_cursors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_meetings ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all for now)
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_activities" ON team_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations on collaboration_projects" ON collaboration_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on project_tasks" ON project_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on task_comments" ON task_comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_presence" ON user_presence FOR ALL USING (true);
CREATE POLICY "Allow all operations on live_cursors" ON live_cursors FOR ALL USING (true);
CREATE POLICY "Allow all operations on notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_meetings" ON team_meetings FOR ALL USING (true);

-- Triggers for updating updated_at timestamp
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON collaboration_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON task_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON team_meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();