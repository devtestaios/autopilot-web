---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
# GitHub Copilot Instructions - Autopilot Marketing Platform

## Project Overview
You are now the main developer for "Autopilot" - an AI-powered marketing optimization platform that autonomously manages ad campaigns across multiple platforms (Google Ads, Meta, etc.), analyzes performance, optimizes spend, and provides strategic recommendations with minimal human intervention.

## Client Context
- **Client**: Full-service marketing and advertising agency
- **Current Process**: Team manually manages online ads, split testing, analytics optimization
- **Goal**: Automate entire process with AI
- **Developer Level**: First-time developer, needs detailed step-by-step instructions
- **Communication Style Required**: Assume no prior coding knowledge, explain every step clearly, provide exact commands

## Current Tech Stack
- **Frontend**: Next.js 15 (App Router) deployed on Vercel
- **Backend**: FastAPI (Python) deployed on Render
- **Database**: Supabase (PostgreSQL)
- **Version Control**: GitHub
- **Development Environment**: VS Code

## Architecture Flow
```
Vercel (Next.js UI) → Render (FastAPI) → Supabase (PostgreSQL)
```

## Current Working System Status
### ✅ BACKEND (main.py) - FULLY FUNCTIONAL
- FastAPI server with CORS configured for Vercel
- Supabase integration working properly
- Lead management system (GET/POST /leads)
- KPI endpoints (/kpi/summary, /kpi/daily) 
- Health checks and environment validation
- Proper error handling

### ✅ FRONTEND - FUNCTIONAL
- Next.js 15 deployed on Vercel
- Basic lead management interface working
- API integration confirmed working
- Status/health pages functional
- Theme toggle system implemented (dark mode working best)

#### 🔶 THEME SYSTEM STATUS (Partially Complete)
**Completed Work:**
- ✅ Removed misplaced "PULSE BRIDGE" text from landing page
- ✅ Updated toolbar backgrounds: black in dark mode, white in light mode
- ✅ Fixed navbar text contrast for better readability
- ✅ Theme toggle with localStorage persistence

**Remaining Issues (Bookmarked):**
- Light mode still has some toolbar text visibility issues
- Browser cache occasionally shows outdated styles
- Navigation components need comprehensive light mode audit

**Current Recommendation:** Dark mode functions best across all components

### ✅ DATABASE - FUNCTIONAL
- Supabase project configured
- `leads` table with RLS policies working
- Basic CRUD operations confirmed

## IMMEDIATE DEVELOPMENT PHASE (What to Build Next)

### 1. DATABASE SCHEMA EXPANSION
**PRIORITY: Execute these SQL commands in Supabase first**

```sql
-- Create campaigns table
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'google_ads', 'meta', 'linkedin', etc.
  client_name TEXT NOT NULL,
  budget DECIMAL(10,2),
  spend DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'ended'
  metrics JSONB, -- Store platform-specific metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance snapshots table
CREATE TABLE performance_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,4), -- Click-through rate
  cpc DECIMAL(10,2), -- Cost per click
  cpa DECIMAL(10,2), -- Cost per acquisition
  roas DECIMAL(10,2), -- Return on ad spend
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- Add RLS policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (adjust based on auth requirements)
CREATE POLICY "Allow all on campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all on performance_snapshots" ON performance_snapshots FOR ALL USING (true);
```

### 2. BACKEND EXPANSION (Add to main.py)
**Add these new Pydantic models and endpoints:**

```python
# New Models to add after existing models
class CampaignIn(BaseModel):
    name: str
    platform: str
    client_name: str
    budget: Optional[float] = None
    status: Optional[str] = "active"
    metrics: Optional[dict] = {}

class CampaignOut(BaseModel):
    id: str
    name: str
    platform: str
    client_name: str
    budget: Optional[float]
    spend: float
    status: str
    metrics: dict
    created_at: datetime
    updated_at: datetime

class PerformanceSnapshotIn(BaseModel):
    campaign_id: str
    date: str  # YYYY-MM-DD format
    impressions: Optional[int] = 0
    clicks: Optional[int] = 0
    conversions: Optional[int] = 0
    spend: Optional[float] = 0
    ctr: Optional[float] = None
    cpc: Optional[float] = None
    cpa: Optional[float] = None
    roas: Optional[float] = None

# New endpoints to add
@app.get("/campaigns")
def get_campaigns(limit: int = 100) -> List[Dict]:
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    res = supabase.table("campaigns").select("*").order("created_at", desc=True).limit(limit).execute()
    return res.data or []

@app.post("/campaigns")
def create_campaign(campaign: CampaignIn):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    payload = campaign.dict()
    res = supabase.table("campaigns").insert(payload).execute()
    return res.data[0] if res.data else {}

@app.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    res = supabase.table("campaigns").select("*").eq("id", campaign_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return res.data[0]

@app.put("/campaigns/{campaign_id}")
def update_campaign(campaign_id: str, campaign: CampaignIn):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    payload = campaign.dict()
    payload["updated_at"] = _iso(datetime.now(timezone.utc))
    res = supabase.table("campaigns").update(payload).eq("id", campaign_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return res.data[0]

@app.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    res = supabase.table("campaigns").delete().eq("id", campaign_id).execute()
    return {"success": True}

@app.get("/campaigns/{campaign_id}/performance")
def get_campaign_performance(campaign_id: str, days: int = 30):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    start_date = (_today_utc() - timedelta(days=days)).date().isoformat()
    res = supabase.table("performance_snapshots").select("*").eq("campaign_id", campaign_id).gte("date", start_date).order("date", desc=False).execute()
    return res.data or []

@app.post("/campaigns/{campaign_id}/performance")
def add_performance_snapshot(campaign_id: str, performance: PerformanceSnapshotIn):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    payload = performance.dict()
    payload["campaign_id"] = campaign_id
    
    # Calculate derived metrics if not provided
    if payload.get("clicks") and payload.get("impressions"):
        payload["ctr"] = payload["clicks"] / payload["impressions"]
    if payload.get("spend") and payload.get("clicks"):
        payload["cpc"] = payload["spend"] / payload["clicks"]
    
    res = supabase.table("performance_snapshots").upsert(payload).execute()
    return res.data[0] if res.data else {}

@app.get("/dashboard/overview")
def dashboard_overview():
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase env vars missing")
    
    # Get campaign counts by status
    campaigns = supabase.table("campaigns").select("status", count="exact").execute()
    
    # Get total spend across all campaigns
    spend_res = supabase.table("campaigns").select("spend").execute()
    total_spend = sum(float(c.get("spend", 0)) for c in spend_res.data or [])
    
    # Get recent performance (last 7 days)
    recent_date = (_today_utc() - timedelta(days=7)).date().isoformat()
    recent_perf = supabase.table("performance_snapshots").select("spend, conversions").gte("date", recent_date).execute()
    
    recent_spend = sum(float(p.get("spend", 0)) for p in recent_perf.data or [])
    recent_conversions = sum(int(p.get("conversions", 0)) for p in recent_perf.data or [])
    
    return {
        "total_campaigns": len(campaigns.data or []),
        "total_spend": total_spend,
        "recent_spend_7d": recent_spend,
        "recent_conversions_7d": recent_conversions,
        "campaigns_by_status": {}  # Add grouping logic as needed
    }
```

### 3. FRONTEND TRANSFORMATION PRIORITY
**Replace the current leads interface with campaign dashboard**

**File Structure to Create/Modify:**
```
src/app/
├── page.tsx (main dashboard)
├── campaigns/
│   ├── page.tsx (campaigns list)
│   ├── [id]/
│   │   └── page.tsx (campaign details)
│   └── new/
│       └── page.tsx (create campaign)
├── components/
│   ├── CampaignCard.tsx
│   ├── PerformanceChart.tsx
│   ├── DashboardStats.tsx
│   └── CampaignForm.tsx
└── lib/
    └── api.ts (API helper functions)
```

**API Helper Functions (lib/api.ts):**
```typescript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app.onrender.com' 
  : 'http://localhost:8000';

export async function fetchCampaigns() {
  const response = await fetch(`${API_BASE}/campaigns`);
  if (!response.ok) throw new Error('Failed to fetch campaigns');
  return response.json();
}

export async function createCampaign(campaign: any) {
  const response = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign)
  });
  if (!response.ok) throw new Error('Failed to create campaign');
  return response.json();
}

export async function fetchDashboardOverview() {
  const response = await fetch(`${API_BASE}/dashboard/overview`);
  if (!response.ok) throw new Error('Failed to fetch dashboard overview');
  return response.json();
}

export async function fetchCampaignPerformance(campaignId: string, days = 30) {
  const response = await fetch(`${API_BASE}/campaigns/${campaignId}/performance?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch campaign performance');
  return response.json();
}
```

## DEVELOPMENT WORKFLOW
1. **Always test locally first**: Use `npm run dev` for frontend, `python main.py` for backend
2. **Use feature branches**: Create branches for major changes
3. **Deploy incrementally**: Deploy small working changes, don't wait for perfection
4. **Cost optimization**: Keep costs low during prototyping
5. **Build with mock data first**: Create UI with sample data, then connect real APIs

## TESTING COMMANDS
```bash
# Frontend development
npm run dev  # Starts on localhost:3000

# Backend development  
uvicorn main:app --reload  # Starts on localhost:8000

# Production builds
npm run build  # Frontend build check
```

## ENVIRONMENT VARIABLES REQUIRED
```bash
# Backend (.env on Render)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## FUTURE PHASES TO IMPLEMENT
### Phase 1: Google Ads Integration + Basic Dashboard (Current Focus)
- Complete campaign management interface
- Real Google Ads API integration
- Performance visualization with charts

### Phase 2: AI Optimization Engine
- Automated performance analysis
- Budget optimization recommendations  
- Alert system for underperforming campaigns

### Phase 3: Multi-Platform Support
- Meta Ads integration
- LinkedIn Ads integration
- Unified reporting across platforms

### Phase 4: Full Autopilot Mode
- Automated bid adjustments
- Auto-pause underperforming ads
- Autonomous budget reallocation
- Safety guardrails and approval workflows

## GOOGLE ADS API INTEGRATION (Next Priority After UI)
```python
# Dependencies to add to requirements.txt
google-ads==23.1.0
google-auth==2.23.3

# Environment variables to add
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id
```

## COMMUNICATION GUIDELINES
- **Explain every step clearly**: User is learning to code
- **Provide exact commands**: Don't assume knowledge of CLI or tools
- **Show file locations**: Always specify exactly where code goes
- **Test instructions**: Provide step-by-step testing procedures
- **Error handling**: Explain common errors and how to fix them
- **Incremental approach**: Build one feature at a time, test, then move on

## SUCCESS METRICS
- ✅ Campaign dashboard showing real Google Ads data
- ✅ Automated performance analysis working
- ✅ Budget optimization recommendations functioning
- ✅ Multi-client campaign management operational
- ✅ Eventually achieve full automation with minimal human oversight

## CURRENT DEVELOPMENT PRIORITY
1. **Execute database schema updates in Supabase**
2. **Add campaign endpoints to main.py** 
3. **Test all new backend endpoints work**
4. **Build campaign dashboard UI to replace leads interface**
5. **Connect real Google Ads API data**

Remember: Focus on working prototypes first, optimize later. The client values functionality over perfect code during this learning phase.