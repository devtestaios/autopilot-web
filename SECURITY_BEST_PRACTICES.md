# 🔐 Security Best Practices - PulseBridge.ai

## 🚨 **NEVER COMMIT SECRETS TO GIT**

### ❌ **What NOT to Do:**
- Hard-code API keys, tokens, passwords in source files
- Commit `.env` files with real credentials
- Store secrets in any file tracked by git
- Use "temporary" credentials in code

### ✅ **What TO Do:**

## 🛠️ **Proper Credential Management Workflow**

### **1. Environment Variables (Primary Method)**
```bash
# In production (Render, Vercel, etc.)
GOOGLE_ADS_CLIENT_ID=actual_value_here
GOOGLE_ADS_CLIENT_SECRET=actual_secret_here

# In local development (.env.local - ignored by git)
GOOGLE_ADS_CLIENT_ID=your_dev_credentials
```

### **2. Code Pattern (Always Use)**
```typescript
// ✅ CORRECT - Read from environment
const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

// ❌ WRONG - Hard-coded values
const clientId = "141284371364-6btbip4tlemkgtbm93htjnk5iq0vj8p9.apps.googleusercontent.com";
```

### **3. Template Files (Safe to Commit)**
```bash
# .env.example - Template file (commit this)
GOOGLE_ADS_CLIENT_ID=your_client_id_here
GOOGLE_ADS_CLIENT_SECRET=your_client_secret_here
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
```

## 🔄 **Development Workflow**

### **For New APIs/Services:**
1. **Create template**: Add placeholder values in `.env.example`
2. **Document requirements**: Update this file with required variables
3. **Set up environment**: Add real values to platform (Render/Vercel)
4. **Test locally**: Use `.env.local` for development (never commit)
5. **Backup safely**: Store in password manager

### **For Team Members:**
1. Copy `.env.example` to `.env.local`
2. Request credentials from team lead
3. Never commit `.env.local` to git
4. Store personal backup in password manager

## 🎯 **Current Project Status**
- ✅ Backend credentials: Stored in Render environment variables
- ✅ Frontend environment: Uses `process.env` pattern correctly
- ✅ Backup: Stored in password manager
- ✅ Git safety: `.env*` files ignored
- ✅ Templates: Placeholder values in committed files

## 🚨 **Emergency Response**
If credentials are accidentally committed:
1. **Immediately revoke** the compromised credentials
2. **Generate new credentials** from the service provider
3. **Update environment variables** in production
4. **Clean git history** or create new repository if needed
5. **Review and improve** security practices

## 🔍 **Pre-Commit Checklist**
Before every commit:
- [ ] No actual API keys in files being committed
- [ ] All credentials use `process.env.VARIABLE_NAME` pattern
- [ ] `.env.local` files are not staged
- [ ] Only template/placeholder values in committed files

Remember: **Security debt is technical debt** - fix it immediately, don't work around it!