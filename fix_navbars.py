#!/usr/bin/env python3
"""
Fix duplicate navbar issue by removing NavigationTabs from all pages
"""

import os
import re
from pathlib import Path

def fix_file(filepath):
    """Remove NavigationTabs import and usage from a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove NavigationTabs import line
        content = re.sub(
            r"import NavigationTabs from ['\"]@/components/NavigationTabs['\"];\s*\n?",
            "// NavigationTabs removed - using root layout Navigation instead\n",
            content
        )

        # Replace NavigationTabs JSX with comment
        content = re.sub(
            r"<NavigationTabs\s*/?>",
            "{/* Navigation provided by root layout */}",
            content
        )

        # Only write if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_path = Path("/Users/grayadkins/Desktop/Autopilot_Repos/autopilot-web/src/app")

    # Find all .tsx files that import NavigationTabs (excluding backups and tests)
    files_to_fix = []
    for tsx_file in base_path.rglob("*.tsx"):
        # Skip backups and tests
        if ".backup" in str(tsx_file) or "test.tsx" in str(tsx_file):
            continue

        try:
            with open(tsx_file, 'r', encoding='utf-8') as f:
                if "import NavigationTabs" in f.read():
                    files_to_fix.append(tsx_file)
        except:
            continue

    print(f"Found {len(files_to_fix)} files to fix\n")

    fixed_count = 0
    for filepath in files_to_fix:
        relative_path = filepath.relative_to(base_path.parent.parent)
        if fix_file(filepath):
            print(f"✅ Fixed: {relative_path}")
            fixed_count += 1
        else:
            print(f"⏭️  Skipped (no changes): {relative_path}")

    print(f"\n{'='*50}")
    print(f"Fixed {fixed_count} out of {len(files_to_fix)} files")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    main()
