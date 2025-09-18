# Autopilot Technical Documentation

## System Architecture Overview

Autopilot is built on a modern, scalable architecture designed for AI-powered marketing automation:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │    │  FastAPI Backend │    │   Supabase DB   │
│   (Frontend)    │◄──►│   (Python)      │◄──►│  (PostgreSQL)   │
│   Vercel        │    │   Render        │    │   Cloud         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Google Ads API  │    │  AI/ML Engine   │    │ Performance     │
│ Meta Ads API    │    │ (Future Phase)  │    │ Analytics       │
│ Platform APIs   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🏗️ Current Implementation Status

### ✅ **Completed Components**

#### **Frontend (Next.js 15)**
- **Dashboard Interface**: Complete campaign management UI
- **API Integration**: Full CRUD operations with backend
- **Component Library**: Reusable components for campaign management
- **Responsive Design**: Mobile-first, responsive layouts
- **Error Handling**: Comprehensive error states and user feedback

#### **Backend (FastAPI)**
- **RESTful API**: Complete campaign and performance endpoints
- **Database Integration**: Supabase PostgreSQL with proper schemas
- **CORS Configuration**: Vercel deployment ready
- **Data Validation**: Pydantic models for type safety
- **Health Monitoring**: System health and environment checks

#### **Database (Supabase)**
- **Campaign Management**: campaigns table with full metadata
- **Performance Tracking**: performance_snapshots for historical data
- **Lead Management**: leads table for prospect tracking
- **Row Level Security**: Proper access controls and policies

### 🔄 **In Development**
- Google Ads API integration
- Automated performance sync
- AI optimization engine

---

## 📊 Database Schema

### **campaigns** table
```sql
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
```

### **performance_snapshots** table
```sql
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
```

### **leads** table
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### **Campaign Management**

#### `GET /campaigns`
```json
{
  "limit": 100
}
```
Returns array of campaign objects with full metadata.

#### `POST /campaigns`
```json
{
  "name": "Summer Sale Campaign",
  "platform": "google_ads",
  "client_name": "ACME Corp",
  "budget": 5000.00,
  "spend": 0.00,
  "metrics": {}
}
```

#### `GET /campaigns/{campaign_id}`
Returns single campaign with detailed information.

#### `PUT /campaigns/{campaign_id}`
Updates campaign with new data, preserves existing fields.

#### `DELETE /campaigns/{campaign_id}`
Removes campaign and all associated performance data.

### **Performance Tracking**

#### `GET /campaigns/{campaign_id}/performance`
```json
{
  "limit": 100
}
```
Returns performance snapshots for specific campaign.

#### `POST /campaigns/{campaign_id}/performance`
```json
{
  "snapshot_date": "2025-09-17",
  "metrics": {
    "impressions": 1000,
    "clicks": 50,
    "conversions": 5,
    "spend": 125.00
  }
}
```

### **System Health**

#### `GET /health`
Returns API health status.

#### `GET /version`
Returns current API version.

#### `GET /env-check`
Returns environment configuration status.

---

## 🎨 Frontend Architecture

### **Component Structure**
```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── campaigns/          # Campaign management
│   │   ├── page.tsx        # Campaign list
│   │   ├── new/page.tsx    # Create campaign
│   │   └── [id]/           # Dynamic campaign routes
│   └── status/page.tsx     # System status
├── components/             # Reusable components
│   ├── CampaignCard.tsx    # Campaign display card
│   ├── CampaignForm.tsx    # Campaign create/edit form
│   └── DashboardStats.tsx  # Dashboard statistics
└── lib/
    └── api.ts              # API helper functions
```

### **Key Components**

#### **CampaignCard**
```tsx
interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaignId: string) => void;
}
```
- Displays campaign overview with budget progress
- Shows key metrics and platform badges
- Provides edit/delete actions
- Responsive grid layout

#### **CampaignForm**
```tsx
interface CampaignFormProps {
  campaign?: CampaignInput;
  onSubmit: (campaign: CampaignInput) => void;
  onCancel: () => void;
  loading?: boolean;
}
```
- Handles both create and edit scenarios
- Platform selection with predefined options
- Budget and spend input with validation
- Loading states and error handling

#### **DashboardStats**
```tsx
interface DashboardStatsProps {
  campaigns: Campaign[];
  loading?: boolean;
}
```
- Calculates and displays key metrics
- System health monitoring
- Platform breakdown visualization
- Responsive grid layout for stats

### **API Integration**

#### **Type Definitions**
```typescript
export type Campaign = {
  id: string;
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend?: number;
  metrics?: Record<string, any>;
  created_at?: string;
};

export type CampaignInput = {
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend?: number;
  metrics?: Record<string, any>;
};
```

#### **API Helper Functions**
- `fetchCampaigns()`: Get all campaigns
- `fetchCampaign(id)`: Get single campaign
- `createCampaign(data)`: Create new campaign
- `updateCampaign(id, data)`: Update existing campaign
- `deleteCampaign(id)`: Remove campaign
- `fetchCampaignPerformance(id)`: Get performance data
- `checkApiHealth()`: Monitor system health

---

## 🤖 AI Integration Architecture (Future Implementation)

### **Machine Learning Pipeline**
```
Data Ingestion → Feature Engineering → Model Training → Prediction → Action
      ↓                ↓                 ↓             ↓          ↓
Campaign Data → Performance Metrics → ML Models → Decisions → API Calls
```

### **Planned AI Components**

#### **Performance Prediction Engine**
```python
class PerformancePrediction:
    def __init__(self):
        self.model = load_trained_model()
    
    def predict_campaign_performance(self, campaign_data):
        features = self.extract_features(campaign_data)
        prediction = self.model.predict(features)
        return {
            'predicted_cpa': prediction.cpa,
            'predicted_roas': prediction.roas,
            'confidence_score': prediction.confidence
        }
```

#### **Budget Optimization Engine**
```python
class BudgetOptimizer:
    def optimize_allocation(self, campaigns, total_budget):
        # Multi-objective optimization
        # Maximize ROAS while minimizing CPA
        return optimized_budgets
```

#### **Anomaly Detection System**
```python
class AnomalyDetector:
    def detect_performance_anomalies(self, campaign_metrics):
        # Statistical analysis and ML-based detection
        return anomalies
```

### **AI Decision Framework**
1. **Data Collection**: Real-time campaign metrics
2. **Feature Engineering**: Transform raw data into ML features
3. **Model Inference**: Apply trained models for predictions
4. **Decision Engine**: Determine optimal actions based on predictions
5. **Action Execution**: Implement changes via platform APIs
6. **Feedback Loop**: Monitor results and retrain models

---

## 🔗 Google Ads Integration (Next Phase)

### **Authentication Setup**
```python
# Required environment variables
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id
```

### **Google Ads Client Implementation**
```python
from google.ads.googleads.client import GoogleAdsClient

class GoogleAdsSync:
    def __init__(self):
        self.client = GoogleAdsClient.load_from_env()
    
    def sync_campaign_performance(self, campaign_id):
        # Fetch performance data from Google Ads
        # Transform and store in database
        pass
    
    def update_campaign_budget(self, campaign_id, new_budget):
        # Update budget via Google Ads API
        pass
```

### **Automated Sync Pipeline**
```python
@app.post("/sync/google-ads/{campaign_id}")
async def sync_google_ads_performance(campaign_id: str):
    """Sync performance data from Google Ads"""
    ads_client = GoogleAdsSync()
    performance_data = ads_client.sync_campaign_performance(campaign_id)
    
    # Store in database
    snapshot = PerformanceSnapshotIn(
        snapshot_date=today(),
        metrics=performance_data
    )
    
    return add_performance_snapshot(campaign_id, snapshot)
```

---

## 🚀 Deployment Architecture

### **Production Environment**
- **Frontend**: Vercel (Next.js deployment)
- **Backend**: Render (FastAPI containerized deployment)
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in health checks and status monitoring

### **Environment Variables**

#### **Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **Backend (.env)**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
GOOGLE_ADS_DEVELOPER_TOKEN=your_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
```

### **CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod
  
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: render deploy
```

---

## 🛠️ Development Workflow

### **Local Development Setup**

#### **Frontend**
```bash
cd autopilot-web
npm install
npm run dev  # Starts on localhost:3000
```

#### **Backend**
```bash
cd autopilot-api
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload  # Starts on localhost:8000
```

### **Testing Strategy**

#### **Frontend Testing**
```bash
npm run test        # Jest unit tests
npm run test:e2e    # Playwright end-to-end tests
npm run lint        # ESLint code quality
npm run build       # Production build test
```

#### **Backend Testing**
```bash
pytest              # Python unit tests
pytest --cov        # Coverage report
black .             # Code formatting
mypy .              # Type checking
```

### **Code Quality Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Black**: Python code formatting
- **MyPy**: Python type checking

---

## 📈 Performance Monitoring

### **Application Metrics**
- **Response Time**: API endpoint performance
- **Error Rate**: Application error tracking
- **Throughput**: Requests per second
- **Database Performance**: Query execution times

### **Business Metrics**
- **Campaign Performance**: CPA, ROAS, CTR tracking
- **Budget Utilization**: Spend vs. budget analysis
- **Platform Performance**: Cross-platform comparison
- **User Engagement**: Dashboard usage analytics

### **Monitoring Tools**
- **Health Checks**: Built-in endpoint monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Analytics**: Real-time performance metrics
- **Alerting**: Automated alerts for critical issues

---

## 🔒 Security Implementation

### **Authentication & Authorization**
- **JWT Tokens**: Secure API authentication (future implementation)
- **Role-Based Access**: Different permission levels for users
- **API Rate Limiting**: Prevent abuse and ensure fair usage
- **CORS Policy**: Restricted cross-origin requests

### **Data Protection**
- **Encryption**: All data encrypted in transit and at rest
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Content Security Policy headers

### **Compliance**
- **GDPR Compliance**: Data privacy and user rights
- **CCPA Compliance**: California privacy regulations
- **SOC 2**: Security, availability, and confidentiality controls
- **Data Retention**: Automated data lifecycle management

---

## 🎯 Next Development Phases

### **Phase 1: Google Ads Integration** (Current Priority)
```python
# Add to requirements.txt
google-ads==23.1.0
google-auth==2.23.3

# Implementation tasks
- [ ] Google Ads API client setup
- [ ] Authentication flow implementation
- [ ] Campaign sync functionality
- [ ] Performance data sync
- [ ] Automated budget updates
```

### **Phase 2: AI Optimization Engine**
```python
# AI/ML dependencies
scikit-learn==1.3.0
tensorflow==2.13.0
pandas==2.0.3
numpy==1.24.3

# Implementation tasks
- [ ] Performance prediction models
- [ ] Budget optimization algorithms
- [ ] Anomaly detection system
- [ ] Automated decision engine
- [ ] A/B testing framework
```

### **Phase 3: Multi-Platform Expansion**
```python
# Additional platform integrations
facebook-business==17.0.0
linkedin-api==2.0.0
twitter-api-v2==1.4.0

# Implementation tasks
- [ ] Meta Ads integration
- [ ] LinkedIn Ads integration
- [ ] Twitter/X Ads integration
- [ ] Unified performance tracking
- [ ] Cross-platform optimization
```

---

This technical documentation provides a comprehensive overview of the current implementation and future development roadmap for the Autopilot marketing platform.