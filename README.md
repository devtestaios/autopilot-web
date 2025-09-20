# 🚀 Autopilot - AI-Powered Marketing Automation Platform

> **Autonomous marketing campaign management with minimal human intervention**

Autopilot is an intelligent marketing platform that manages ad campaigns across multiple platforms (Google Ads, Meta), analyzes performance, optimizes spend, and provides strategic recommendations through AI automation.

## 🏗️ Architecture

**Full-Stack Structure:**
```
Vercel (Next.js UI) → Render (FastAPI) → Supabase (PostgreSQL)
```

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python) with async operations
- **Database**: Supabase PostgreSQL with real-time features
- **Deployment**: Vercel (frontend), Render (backend)

## ✨ Current Features

### ✅ Completed
- **Responsive Dashboard**: Advanced sidebar navigation with collapsible functionality
- **Campaign Management**: Full CRUD operations for marketing campaigns
- **Performance Tracking**: Historical performance data and analytics
- **Lead Management**: Customer lead tracking and management
- **Theme System**: Dark/light mode with persistent preferences
- **API Integration**: Complete backend connectivity with error handling
- **Mobile Responsive**: Adaptive design for all screen sizes

### 🚧 In Development
- **AI Chat Integration**: Claude AI assistant for campaign optimization
- **Google Ads API**: Real-time campaign synchronization
- **Automated Optimization**: AI-powered bid and budget adjustments
- **Multi-Platform Support**: Meta Ads, LinkedIn integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/autopilot-web.git
cd autopilot-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Features Overview

### **Advanced Navigation System**
- **Collapsible Sidebar**: 220px expanded, 56px collapsed with smooth animations
- **Responsive Navbar**: Dynamically adjusts width based on sidebar state
- **Mobile Optimized**: Overlay behavior with backdrop on smaller screens
- **State Communication**: Callback-based component coordination

### **Campaign Management**
- Create, edit, and manage marketing campaigns across platforms
- Real-time performance tracking and analytics
- Budget and spend monitoring
- Campaign status management (active, paused, ended)

### **Dashboard Analytics**
- Performance metrics visualization
- Historical data analysis
- Key performance indicator (KPI) tracking
- Lead conversion tracking

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Create production build
npm run start        # Start production server
npm run test         # Run Jest unit tests
npm run test:e2e     # Run Playwright end-to-end tests
npm run lint         # Run ESLint
```

### **Project Structure**
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main dashboard
│   ├── campaigns/         # Campaign management
│   ├── leads/            # Lead management
│   └── dashboard/        # Enhanced dashboard
├── components/           # Reusable React components
│   ├── UnifiedSidebar.tsx    # Collapsible navigation
│   ├── AdvancedNavigation.tsx # Responsive top navbar
│   ├── CampaignCard.tsx      # Campaign display
│   └── DashboardStats.tsx    # Analytics widgets
├── contexts/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API clients
└── types/              # TypeScript type definitions
```

### **Key Technologies**
- **Next.js 15**: App Router with TypeScript
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization and analytics charts

## 🎯 Responsive Design System

### **Sidebar Navigation**
```typescript
// State management pattern
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

// Component communication
<UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
<AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
```

### **Responsive Classes**
```css
/* Navbar width adjustment */
.navbar-container {
  @apply max-w-7xl lg:ml-0; /* Sidebar expanded */
  @apply max-w-none lg:ml-14; /* Sidebar collapsed */
}
```

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
# Automatic deployment via GitHub integration
git push origin main
```

### **Backend (Render)**
- FastAPI application deployed on Render
- Environment variables configured in Render dashboard
- Automatic deployments from GitHub

## 📊 API Integration

### **Campaign Endpoints**
- `GET /campaigns` - List all campaigns
- `POST /campaigns` - Create new campaign
- `GET /campaigns/{id}` - Get campaign details
- `PUT /campaigns/{id}` - Update campaign
- `DELETE /campaigns/{id}` - Delete campaign

### **Performance Endpoints**
- `GET /campaigns/{id}/performance` - Get performance data
- `POST /campaigns/{id}/performance` - Add performance snapshot

## 🔧 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] **AI Chat Integration** - Claude AI assistant for campaign optimization
- [ ] **Google Ads API** - Real-time campaign synchronization
- [ ] **Meta Ads Integration** - Facebook and Instagram campaign management
- [ ] **Automated Optimization** - AI-powered performance improvements
- [ ] **Advanced Analytics** - Machine learning insights and predictions
- [ ] **White-label Solution** - Multi-tenant architecture for agencies

---

**Built with ❤️ for autonomous marketing automation**
