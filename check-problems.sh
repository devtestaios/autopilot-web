#!/bin/bash

echo "🔍 AUTOPILOT PROJECT PROBLEM ANALYZER"
echo "======================================"
echo ""

# Check TypeScript compilation errors
echo "📝 TypeScript Compilation Check:"
echo "--------------------------------"
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
echo ""

# Check ESLint issues
echo "⚠️  ESLint Issues:"
echo "-----------------"
npx eslint src --ext .tsx,.ts --max-warnings 0 2>&1 | head -10 || echo "ESLint completed with warnings/errors"
echo ""

# Check for missing dependencies
echo "📦 Dependency Check:"
echo "-------------------"
echo "Checking for missing imports..."
grep -r "Cannot find module" . --include="*.tsx" --include="*.ts" 2>/dev/null | head -5 || echo "No obvious missing module errors found"
echo ""

# Check build status
echo "🏗️  Build Status:"
echo "----------------"
echo "Running quick build check..."
npm run build --turbopack 2>&1 | tail -10
echo ""

# Check for common issues
echo "🚨 Common Issue Detection:"
echo "-------------------------"
echo "1. Checking for location errors:"
grep -r "location\." src --include="*.tsx" --include="*.ts" | grep -v "window\.location" | grep -v "allocation" | wc -l | xargs echo "Potential location issues found:"

echo "2. Checking for missing components:"
find src -name "*.tsx" -exec grep -l "import.*from '\./.*'" {} \; | wc -l | xargs echo "Files with relative imports:"

echo "3. Checking for type errors:"
grep -r "Type.*is not assignable" . 2>/dev/null | wc -l | xargs echo "Type assignment errors:"

echo ""
echo "✅ Analysis complete! Run this script anytime to check project health."