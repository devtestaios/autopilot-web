# 🧹 Feature Cleanup Guide

> **How to execute the feature consolidation plan**

## 📋 Quick Reference

**Full Analysis**: See `docs/archive/FEATURE_AUDIT_REPORT.md`
**Automated Script**: `cleanup-phase1.sh`
**Impact**: 73 pages → 35 pages (52% reduction)

---

## 🚀 Quick Start (Recommended)

### **Option 1: Automated Cleanup** (5 minutes)

```bash
# 1. Navigate to project
cd ~/Desktop/Autopilot_Repos/autopilot-web

# 2. Review what will be removed
cat cleanup-phase1.sh

# 3. Run automated cleanup (creates backup automatically)
./cleanup-phase1.sh

# 4. Test the build
npm run build

# 5. Check for broken links
npm run dev
# Navigate through the app and test key flows
```

**What it does:**
- ✅ Creates timestamped backup
- ✅ Removes 13 stub pages
- ✅ Moves 12 demo/test pages to `dev-demos/`
- ✅ Removes 3 redirect-only pages
- ✅ Total: 28 pages removed/moved

---

### **Option 2: Manual Cleanup** (30 minutes)

If you prefer to do it manually or want more control:

#### **Step 1: Create Backup**
```bash
mkdir -p backups/manual-cleanup
cp -r src/app backups/manual-cleanup/
```

#### **Step 2: Remove Stub Pages** (13 pages)
```bash
cd src/app
rm -rf autopilot competitive enterprise whitelabel unified \
       unified-dashboard infrastructure sync alerts \
       marketing-command-center social cost-monitoring platforms
```

#### **Step 3: Move Demo/Test Pages** (12 pages)
```bash
mkdir -p ../../dev-demos
mv __tests__ accessibility-demo blur-demo button-demo \
   google-ads-test integration-test meta-test mobile-demo \
   oauth-test performance-integration-demo theme-test \
   unified-theme-demo ../../dev-demos/
```

#### **Step 4: Remove Redirect Pages** (3 pages)
```bash
rm -rf master-terminal adminlogin ai-center
```

#### **Step 5: Verify**
```bash
cd ../..
npm run build
```

---

## ✅ Post-Cleanup Checklist

### **1. Build Verification**
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No broken import statements

### **2. Navigation Testing**
```bash
npm run dev
```
- [ ] Main navigation works
- [ ] Dashboard loads correctly
- [ ] AI pages accessible
- [ ] Marketing pages functional
- [ ] Settings page works

### **3. Component Updates Needed**

Check these files for references to removed pages:

```bash
# Find references to removed pages
grep -r "marketing-command-center\|unified-dashboard\|ai-center" src/
grep -r "/autopilot\|/competitive\|/enterprise" src/
```

**Common places to check:**
- `src/components/NavigationTabs.tsx`
- `src/components/Navigation*.tsx`
- Any `Link` components with hardcoded paths

### **4. Update Links** (if needed)

| Old Link | New Link |
|----------|----------|
| `/marketing-command-center` | `/marketing` |
| `/social` | `/social-media` |
| `/ai-center` | `/ai` |
| `/master-terminal` | `/dashboard` |
| `/unified-dashboard` | `/dashboard` |

---

## 🔄 Phase 2: Consolidation (Future)

After Phase 1 is stable, consider these consolidations:

### **AI Pages** → Tabbed Interface
```bash
# Merge ai-automation and ai-optimization into /ai
# Create tabs: Overview | Automation | Optimization | Capabilities
```

### **Dashboard Variants** → Single Dashboard
```bash
# Remove unified-crm (if not already removed)
# Consolidate features into main /dashboard
```

---

## 📊 Expected Results

### **Before Cleanup**
```
73 page directories
├─ 23 production pages
├─ 19 functional pages
├─ 13 stub pages
├─ 12 demo/test pages
└─ 6 other pages
```

### **After Phase 1**
```
45 page directories (38% reduction)
├─ 23 production pages (kept)
├─ 19 functional pages (kept)
├─ 3 pages needing consolidation
└─ 0 stubs, demos, or redirect-only pages ✨
```

### **After Phase 2** (Future)
```
35 page directories (52% reduction)
├─ 30 core production pages
├─ 5 specialized features
└─ Clean, maintainable structure ✨
```

---

## 🆘 Troubleshooting

### **Problem: Build fails after cleanup**

**Solution:**
```bash
# Check for broken imports
npm run build 2>&1 | grep "Module not found"

# Restore from backup if needed
rm -rf src/app
cp -r backups/[your-backup]/app src/
```

### **Problem: Navigation broken**

**Solution:**
1. Check `src/components/NavigationTabs.tsx`
2. Search for hardcoded paths to removed pages
3. Update to new paths or remove navigation items

### **Problem: 404 errors for old routes**

**Solution:**
Add redirects in `next.config.ts`:
```typescript
async redirects() {
  return [
    {
      source: '/marketing-command-center',
      destination: '/marketing',
      permanent: true,
    },
    {
      source: '/social',
      destination: '/social-media',
      permanent: true,
    },
    // Add more as needed
  ];
}
```

---

## 🎯 Success Criteria

You'll know cleanup was successful when:

- ✅ `npm run build` completes without errors
- ✅ All main navigation links work
- ✅ No 404 errors on key pages
- ✅ TypeScript shows 0 errors
- ✅ ESLint shows no new warnings
- ✅ Page count reduced by ~38% (Phase 1)

---

## 📝 Documentation Updates

After cleanup, update these docs:

1. **README.md**
   - Update page count (73 → 45 or 35)
   - Update route listings

2. **DOCUMENTATION.md**
   - Reflect new structure

3. **Navigation Docs**
   - Update any architecture diagrams
   - Document final page structure

---

## 🔙 Rollback Plan

If something goes wrong:

```bash
# Stop the dev server
# Restore from backup
rm -rf src/app
cp -r backups/[timestamp]/app src/

# Rebuild
npm install
npm run build

# Restart
npm run dev
```

**Backups are located in:**
- Automated: `backups/feature-cleanup-[timestamp]/`
- Manual: `backups/manual-cleanup/`

---

## 📅 Timeline

### **Immediate** (Today)
- Review FEATURE_AUDIT_REPORT.md
- Run cleanup-phase1.sh
- Test and verify

### **This Week**
- Update navigation components
- Add redirects if needed
- Update documentation

### **Next Sprint** (Phase 2)
- Consolidate AI pages
- Merge dashboard variants
- Final structure optimization

---

**Ready to proceed?**

```bash
./cleanup-phase1.sh
```

Let's clean up this codebase! 🚀
