#!/bin/bash

###############################################################################
# PulseBridge.ai - Phase 1 Feature Cleanup Script
# Removes stub pages, test/demo pages, and redirect-only pages
#
# SAFETY: Creates backup before deletion
# Run from: autopilot-web/ directory
###############################################################################

set -e  # Exit on error

echo "============================================"
echo "PulseBridge.ai - Phase 1 Feature Cleanup"
echo "============================================"
echo ""

# Confirm we're in the right directory
if [ ! -d "src/app" ]; then
    echo "❌ ERROR: Must run from autopilot-web/ directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo "✅ Running from correct directory"
echo ""

# Create backup
BACKUP_DIR="backups/feature-cleanup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup in $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r src/app "$BACKUP_DIR/"
echo "✅ Backup created"
echo ""

# Track deletions
total_deleted=0

echo "============================================"
echo "PHASE 1A: Removing Stub Pages (< 50 lines)"
echo "============================================"
echo ""

stub_pages=(
    "autopilot"
    "competitive"
    "enterprise"
    "whitelabel"
    "unified"
    "unified-dashboard"
    "infrastructure"
    "sync"
    "alerts"
    "marketing-command-center"
    "social"
    "cost-monitoring"
    "platforms"
)

for page in "${stub_pages[@]}"; do
    if [ -d "src/app/$page" ]; then
        echo "🗑️  Removing src/app/$page"
        rm -rf "src/app/$page"
        ((total_deleted++))
    else
        echo "⚠️  src/app/$page not found (already deleted?)"
    fi
done

echo ""
echo "============================================"
echo "PHASE 1B: Moving Demo/Test Pages"
echo "============================================"
echo ""

# Create dev-demos directory
mkdir -p dev-demos

demo_pages=(
    "__tests__"
    "accessibility-demo"
    "blur-demo"
    "button-demo"
    "google-ads-test"
    "integration-test"
    "meta-test"
    "mobile-demo"
    "oauth-test"
    "performance-integration-demo"
    "theme-test"
    "unified-theme-demo"
)

for page in "${demo_pages[@]}"; do
    if [ -d "src/app/$page" ]; then
        echo "📦 Moving src/app/$page → dev-demos/$page"
        mv "src/app/$page" "dev-demos/"
        ((total_deleted++))
    else
        echo "⚠️  src/app/$page not found (already moved?)"
    fi
done

echo ""
echo "============================================"
echo "PHASE 1C: Removing Redirect-Only Pages"
echo "============================================"
echo ""

redirect_pages=(
    "master-terminal"
    "adminlogin"
    "ai-center"
)

for page in "${redirect_pages[@]}"; do
    if [ -d "src/app/$page" ]; then
        echo "🗑️  Removing src/app/$page"
        rm -rf "src/app/$page"
        ((total_deleted++))
    else
        echo "⚠️  src/app/$page not found (already deleted?)"
    fi
done

echo ""
echo "============================================"
echo "SUMMARY"
echo "============================================"
echo ""
echo "✅ Phase 1 cleanup complete!"
echo "📊 Pages removed/moved: $total_deleted"
echo "📦 Backup location: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Run: npm run build"
echo "2. Check for any broken imports or links"
echo "3. Test navigation flows"
echo "4. Update NavigationTabs component if needed"
echo ""
echo "To restore backup if needed:"
echo "  rm -rf src/app"
echo "  cp -r $BACKUP_DIR/app src/"
echo ""

# Count remaining pages
remaining=$(find src/app -maxdepth 1 -type d ! -name "app" | wc -l | tr -d ' ')
echo "📁 Remaining page directories: $remaining"
echo ""
echo "✨ Done!"
