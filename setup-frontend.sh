#!/bin/bash
# PulseBridge.ai Frontend Setup & Startup Script
# Ensures Node.js dependencies and starts Next.js dev server

set -e  # Exit on error

echo "🚀 PulseBridge.ai Frontend Setup"
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📂 Frontend directory: $SCRIPT_DIR"
cd "$SCRIPT_DIR"

# Check Node.js version
echo ""
echo "🟢 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js not found! Please install Node.js 20+"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION detected"

# Check npm version
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓${NC} npm $NPM_VERSION detected"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗${NC} package.json not found!"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "${YELLOW}⚠${NC}  node_modules not found. Installing dependencies..."
    npm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${GREEN}✓${NC} node_modules found"
fi

# Check for .env.local file
echo ""
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠${NC}  .env.local file not found"
    echo "   Create .env.local with required environment variables:"
    echo "   - NEXT_PUBLIC_API_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - NEXT_PUBLIC_ENABLE_CLAUDE_SONNET_45=true"
    echo "   - ANTHROPIC_API_KEY"
    echo ""
    if [ -f ".env.example" ]; then
        echo "   Tip: Copy .env.example to .env.local and fill in values"
        echo "   cp .env.example .env.local"
    fi
    echo ""
    read -p "Continue without .env.local? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} .env.local file found"
    
    # Check if Claude Sonnet 4.5 is enabled
    if grep -q "NEXT_PUBLIC_ENABLE_CLAUDE_SONNET_45=true" .env.local 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Claude Sonnet 4.5 enabled"
    else
        echo -e "${YELLOW}ℹ${NC}  Claude Sonnet 4.5 not enabled (add NEXT_PUBLIC_ENABLE_CLAUDE_SONNET_45=true to .env.local)"
    fi
fi

# Verify critical scripts in package.json
echo ""
echo "📋 Verifying npm scripts..."
if grep -q '"dev":' package.json; then
    echo -e "${GREEN}✓${NC} dev script found"
else
    echo -e "${RED}✗${NC} dev script missing!"
fi

if grep -q '"build":' package.json; then
    echo -e "${GREEN}✓${NC} build script found"
else
    echo -e "${RED}✗${NC} build script missing!"
fi

if grep -q '"test":' package.json; then
    echo -e "${GREEN}✓${NC} test script found"
else
    echo -e "${YELLOW}⚠${NC}  test script missing"
fi

echo ""
echo "================================="
echo -e "${GREEN}✅ Frontend setup complete!${NC}"
echo ""
echo "To start the development server:"
echo "  cd $SCRIPT_DIR"
echo "  npm run dev --turbopack"
echo ""
echo "Or run this script with 'start' argument:"
echo "  ./setup-frontend.sh start"
echo ""
echo "Other commands:"
echo "  npm run build --turbopack    # Build for production"
echo "  npm run test                 # Run Jest tests"
echo "  npm run test:e2e             # Run Playwright E2E tests"
echo ""

# Auto-start if argument provided
if [ "$1" == "start" ] || [ "$1" == "--start" ] || [ "$1" == "-s" ]; then
    echo "🚀 Starting Next.js development server with Turbopack..."
    echo "   URL: http://localhost:3000"
    echo ""
    npm run dev --turbopack
fi
