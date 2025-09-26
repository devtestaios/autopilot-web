# 🔐 PulseBridge.ai - Credential Management Guide

## Current Credential Storage (Sept 2025)

### ✅ Production Credentials Location
- **Backend (Render)**: All OAuth credentials stored in Render environment variables
- **Status**: ✅ Secure and functional

### 🔐 Backup Credential Storage
- **Password Manager**: [Store in 1Password/Bitwarden/etc.]
- **Google Cloud Console**: Original source for regeneration if needed

### 🔑 Required Environment Variables (Production)
```bash
# Render Environment Variables (Backend)
GOOGLE_ADS_DEVELOPER_TOKEN=xxx
GOOGLE_ADS_CLIENT_ID=xxx  
GOOGLE_ADS_CLIENT_SECRET=xxx
GOOGLE_ADS_REFRESH_TOKEN=xxx
GOOGLE_ADS_CUSTOMER_ID=xxx
```

### 🚨 Security Rules
- ❌ NEVER store credentials in git repositories
- ❌ NEVER store in project files (even .gitignore won't save you)
- ✅ Use password managers for backup
- ✅ Store in platform environment variables (Render, Vercel, etc.)
- ✅ Can regenerate from Google Cloud Console if lost

### 🔄 Credential Regeneration Process
If credentials are lost:
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Create new OAuth 2.0 credentials
4. Update Render environment variables
5. Update password manager backup

### 📍 Additional Platform Credentials
- **Meta Business API**: [Document location when added]
- **LinkedIn Ads API**: [Document location when added]
- **Supabase**: [Document current storage method]