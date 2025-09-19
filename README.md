# Autopilot (PulseBridge.ai) - AI-Powered Marketing Platform

**Production URL:** https://pulsebridge.ai  
**Status:** Production-ready frontend with VS Code Copilot-style dashboard enhancements

## 📖 Master Context Document

**🚨 DEVELOPERS START HERE:** For complete project context, architecture patterns, and development guidelines:

👉 **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Master Context Document

This document contains:
- Complete project architecture and tech stack
- Component patterns and design system
- Development workflow and commands
- All completed milestones and features
- Next development priorities
- Critical gotchas and best practices

## 🚀 Quick Start

### Development Server
```bash
npm run dev --turbopack    # Uses Turbopack for faster builds
```

### Build & Deploy
```bash
npm run build             # Production build
npm run test             # Run Jest tests
npm run test:e2e         # Run Playwright E2E tests
```

**Live Development:** http://localhost:3000  
**Production:** Auto-deploys to Vercel from main branch

## 🏗️ Architecture Overview

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4  
**Backend:** FastAPI (Python) + Supabase PostgreSQL  
**Deployment:** Vercel (frontend) + Render (backend)

**Key Features:**
- VS Code Copilot-style dashboard with advanced sidebars
- AI assistant chat with marketing automation
- Advanced settings with 20+ campaign controls
- Responsive design with Pulse Bridge branding
- Interactive capability showcases

## 📂 Project Structure

```
src/app/                    # Next.js App Router pages
├── page.tsx               # Landing page (CustomLandingPage)
├── dashboard/enhanced.tsx # Main dashboard with sidebars
├── capabilities/          # Feature showcase pages
└── campaigns/             # Campaign management

src/components/            # React components
├── ui/                   # Base UI components (PremiumButton, PremiumCard)
├── AdvancedSettingsSidebar.tsx  # Left sidebar with automation
├── AIAssistantChat.tsx   # Right sidebar AI assistant
└── CustomLandingPage.tsx # Main landing page

.github/                  # GitHub configuration
└── copilot-instructions.md # 📖 MASTER CONTEXT DOCUMENT
```

## 🎨 Design System

**Pulse Bridge Branding:**
- **Colors:** `--pulse-blue: #00d4ff`, `--bridge-purple: #7c3aed`, `--energy-magenta: #ec4899`
- **Fonts:** Orbitron (headers), Exo_2 (body text)
- **Components:** Glass morphism, pulse animations, gradient effects

## 🔧 Development Guidelines

1. **Use Turbopack:** All dev commands use `--turbopack` flag
2. **Theme System:** Use semantic colors (`text-foreground`) not hardcoded (`text-gray-600`)
3. **WCAG Compliance:** Maintain 4.5:1 contrast ratio for accessibility
4. **Component Pattern:** Enhanced components for advanced features
5. **TypeScript:** Strict typing with proper const assertions

## 📚 Documentation Index

- **[Master Context Document](.github/copilot-instructions.md)** - Complete project guide
- **[User Guide](USER_GUIDE.md)** - End-user documentation
- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)** - Implementation details
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment steps

## 🤝 Contributing

This project uses strict TypeScript and follows enterprise-grade patterns. See the Master Context Document for detailed development guidelines and architecture patterns.

---

*For complete project context and development guidelines, see [.github/copilot-instructions.md](.github/copilot-instructions.md)*
