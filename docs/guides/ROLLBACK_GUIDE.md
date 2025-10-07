# 🏷️ GitHub Deployment Tags & Rollback Guide

## Created Tags

### `v1.0-stable-pre-onboarding` (Recommended Rollback Point)
- **Commit**: `457d179` 
- **Status**: ✅ **FULLY WORKING ENTERPRISE ECOSYSTEM**
- **Features**: 
  - Complete Instagram OAuth integration
  - Master Terminal with 105 routes building successfully
  - Project Management Suite (TaskMaster vs ProjectSuite)
  - Tiered business architecture
  - All database APIs ready (60+ endpoints)
  - Zero TypeScript errors
  - Production deployable

### `v1.1-minimal-dashboard` (Current State)  
- **Commit**: `1201f34` (HEAD)
- **Status**: 🚧 **MINIMAL BUILD-SAFE VERSION**
- **Features**:
  - Builds successfully 
  - Minimal dashboard to prevent JSX errors
  - Basic functionality only
  - Safe for production deployment

## Rollback Instructions

### Option 1: Quick Rollback to Stable Version
```bash
# Switch to the stable pre-onboarding version
git checkout v1.0-stable-pre-onboarding

# Create a new branch from the stable point
git checkout -b rollback-to-stable

# Push the rollback branch
git push origin rollback-to-stable

# If you want to make this the main branch:
git checkout main
git reset --hard v1.0-stable-pre-onboarding
git push --force-with-lease origin main
```

### Option 2: Cherry-pick Approach (Safer)
```bash
# Create a recovery branch
git checkout -b recovery-from-stable v1.0-stable-pre-onboarding

# If you want to keep some recent changes, cherry-pick them:
git cherry-pick <specific-commit-hash>

# Push the recovery branch
git push origin recovery-from-stable
```

### Option 3: View Differences
```bash
# See what changed between stable and current
git diff v1.0-stable-pre-onboarding..HEAD

# See specific file changes
git diff v1.0-stable-pre-onboarding..HEAD -- src/app/dashboard/page.tsx
```

## Deployment Strategy

### Immediate Production Deployment
- **Current state** (`v1.1-minimal-dashboard`) is **safe to deploy**
- Builds successfully with no errors
- Basic functionality maintained

### Full Feature Restoration
1. **Deploy current minimal version** to unblock production
2. **Plan incremental restoration** of onboarding features
3. **Test each addition** before deploying

## Files That Caused Issues

The onboarding implementation (`093b042`) introduced JSX parsing errors in:
- `src/app/dashboard/page.tsx` - Complex nested JSX with template literals
- `src/contexts/DashboardCustomizationContext.tsx` - Large context file
- `src/components/CustomizableDashboard.tsx` - Heavy drag-and-drop component

## Recommended Next Steps

1. **Deploy minimal version now** to get production working
2. **Use `v1.0-stable-pre-onboarding` as reference** for full features
3. **Incrementally add back features** with testing at each step
4. **Consider breaking large components** into smaller pieces to avoid JSX parsing issues

## Verification Commands

```bash
# Check current tags
git tag -l

# View tag details
git show v1.0-stable-pre-onboarding
git show v1.1-minimal-dashboard

# Test build at any tag
git checkout v1.0-stable-pre-onboarding
npm run build --turbopack
```

## Emergency Contacts

If deployment fails:
1. Immediately rollback to `v1.0-stable-pre-onboarding`
2. Deploy from that stable tag
3. Debug issues in a separate branch

---

**Status**: Production deployment preserved and rollback options available 🛡️