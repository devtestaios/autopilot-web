#!/bin/bash

# Script to remove NavigationTabs imports and usage from all pages
# since root layout now provides Navigation globally

echo "🔧 Fixing duplicate navbar issue..."
echo ""

# Find all files with NavigationTabs import (excluding backups and tests)
FILES=$(find /Users/grayadkins/Desktop/Autopilot_Repos/autopilot-web/src/app -name "*.tsx" -type f -exec grep -l "import NavigationTabs" {} \; | grep -v ".backup" | grep -v "test.tsx")

TOTAL=0
FIXED=0

for FILE in $FILES; do
  ((TOTAL++))
  echo "Processing: $FILE"

  # Check if file contains NavigationTabs import
  if grep -q "import NavigationTabs" "$FILE"; then
    # Create backup
    cp "$FILE" "${FILE}.bak-$(date +%Y%m%d)"

    # Remove the import line
    sed -i '' '/import NavigationTabs/d' "$FILE"

    # Replace <NavigationTabs /> with comment
    sed -i '' 's/<NavigationTabs \/>/<!-- Navigation provided by root layout -->/' "$FILE"

    # Alternative patterns
    sed -i '' 's/<NavigationTabs>/<!-- Navigation provided by root layout -->/' "$FILE"
    sed -i '' 's/<\/NavigationTabs>//' "$FILE"

    echo "  ✅ Fixed: $FILE"
    ((FIXED++))
  else
    echo "  ⏭️  Skipped (no import found)"
  fi
done

echo ""
echo "=================="
echo "Summary:"
echo "  Total files processed: $TOTAL"
echo "  Files fixed: $FIXED"
echo "=================="
echo ""
echo "✅ Navbar fix complete!"
echo "🚀 Next: Commit changes with: git add . && git commit -m 'fix: remove duplicate NavigationTabs from all pages'"
