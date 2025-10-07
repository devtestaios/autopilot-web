#!/bin/bash

# Systematic Performance Analysis Script
# Following ADVANCED_CODING_AI_DISSERTATION.md methodologies

echo "🚀 Starting Systematic Performance Analysis..."
echo "Following Advanced Coding Dissertation protocols"

# Create results directory
mkdir -p performance-analysis
cd performance-analysis

echo "📊 Phase 1.1: Bundle Size Analysis"
# Analyze current bundle with detailed breakdown
ANALYZE=true npm run build --turbopack > build-analysis.log 2>&1

echo "📈 Phase 1.2: Component Usage Analysis" 
# Find all component imports
echo "=== COMPONENT USAGE ANALYSIS ===" > component-usage.txt
echo "Total components in ui folder:" >> component-usage.txt
find ../src/components/ui -name "*.tsx" -o -name "*.ts" | wc -l >> component-usage.txt
echo "" >> component-usage.txt

echo "Component files:" >> component-usage.txt
ls -la ../src/components/ui/ >> component-usage.txt
echo "" >> component-usage.txt

echo "Component import analysis:" >> component-usage.txt
grep -r "from.*components/ui" ../src --include="*.tsx" --include="*.ts" | sort | uniq -c | sort -nr >> component-usage.txt

echo "🔍 Phase 1.3: Context Provider Analysis"
echo "=== CONTEXT PROVIDER ANALYSIS ===" > provider-analysis.txt
echo "Total context files:" >> provider-analysis.txt
find ../src/contexts -name "*.tsx" | wc -l >> provider-analysis.txt
echo "" >> provider-analysis.txt

echo "Context file sizes:" >> provider-analysis.txt
wc -l ../src/contexts/*.tsx >> provider-analysis.txt
echo "" >> provider-analysis.txt

echo "Provider import analysis:" >> provider-analysis.txt
grep -r "useContext\|createContext" ../src --include="*.tsx" --include="*.ts" | wc -l >> provider-analysis.txt

echo "📱 Phase 1.4: Route Analysis"
echo "=== ROUTE ANALYSIS ===" > route-analysis.txt
echo "Total pages:" >> route-analysis.txt
find ../src/app -name "page.tsx" | wc -l >> route-analysis.txt
echo "" >> route-analysis.txt

echo "All page routes:" >> route-analysis.txt
find ../src/app -name "page.tsx" | sed 's|../src/app||g' | sed 's|/page.tsx||g' | sort >> route-analysis.txt

echo "🧪 Phase 1.5: Dependency Analysis"
echo "=== DEPENDENCY ANALYSIS ===" > dependency-analysis.txt
echo "Package.json dependencies:" >> dependency-analysis.txt
jq '.dependencies | length' ../package.json >> dependency-analysis.txt
echo "Package.json devDependencies:" >> dependency-analysis.txt  
jq '.devDependencies | length' ../package.json >> dependency-analysis.txt
echo "" >> dependency-analysis.txt

echo "Largest dependencies:" >> dependency-analysis.txt
npm list --depth=0 --json 2>/dev/null | jq -r '.dependencies | to_entries[] | "\(.key): \(.value.version)"' | head -20 >> dependency-analysis.txt

echo "✅ Analysis Complete!"
echo "Results saved in performance-analysis/ directory"
echo ""
echo "📋 Summary:"
echo "- Bundle analysis: build-analysis.log" 
echo "- Component usage: component-usage.txt"
echo "- Provider analysis: provider-analysis.txt"
echo "- Route analysis: route-analysis.txt"
echo "- Dependency analysis: dependency-analysis.txt"
echo ""
echo "Next steps: Review analysis files and identify optimization opportunities"