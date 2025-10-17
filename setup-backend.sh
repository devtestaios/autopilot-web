#!/bin/bash
# PulseBridge.ai Backend Setup & Startup Script
# Ensures all dependencies are installed and backend starts successfully

set -e  # Exit on error

echo "🚀 PulseBridge.ai Backend Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"

echo "📂 Backend directory: $BACKEND_DIR"
cd "$BACKEND_DIR"

# Check Python version
echo ""
echo "🐍 Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓${NC} Python $PYTHON_VERSION detected"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo ""
    echo "${YELLOW}⚠${NC}  Virtual environment not found. Creating..."
    python3 -m venv .venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "🔧 Activating virtual environment..."
source .venv/bin/activate
echo -e "${GREEN}✓${NC} Virtual environment activated"

# Upgrade pip
echo ""
echo "📦 Upgrading pip..."
pip install --upgrade pip --quiet
echo -e "${GREEN}✓${NC} pip upgraded"

# Install requirements
echo ""
echo "📥 Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --quiet
    echo -e "${GREEN}✓${NC} Dependencies installed from requirements.txt"
else
    echo -e "${RED}✗${NC} requirements.txt not found!"
    exit 1
fi

# Verify critical imports
echo ""
echo "🧪 Verifying critical imports..."
python3 -c "import fastapi" && echo -e "${GREEN}✓${NC} fastapi" || echo -e "${RED}✗${NC} fastapi"
python3 -c "import uvicorn" && echo -e "${GREEN}✓${NC} uvicorn" || echo -e "${RED}✗${NC} uvicorn"
python3 -c "import psycopg2" && echo -e "${GREEN}✓${NC} psycopg2" || echo -e "${RED}✗${NC} psycopg2"
python3 -c "import supabase" && echo -e "${GREEN}✓${NC} supabase" || echo -e "${RED}✗${NC} supabase"
python3 -c "import anthropic" && echo -e "${GREEN}✓${NC} anthropic (Claude)" || echo -e "${RED}✗${NC} anthropic"
python3 -c "import sqlalchemy" && echo -e "${GREEN}✓${NC} sqlalchemy" || echo -e "${RED}✗${NC} sqlalchemy"

# Check for .env file
echo ""
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC}  .env file not found in backend directory"
    echo "   Create .env with required environment variables:"
    echo "   - DATABASE_URL"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_KEY"
    echo "   - ANTHROPIC_API_KEY"
    echo ""
    read -p "Continue without .env? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} .env file found"
fi

# Check if main.py exists
if [ ! -f "main.py" ]; then
    echo -e "${RED}✗${NC} main.py not found!"
    exit 1
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""
echo "To start the backend server:"
echo "  cd $BACKEND_DIR"
echo "  source .venv/bin/activate"
echo "  uvicorn main:app --reload --port 8000"
echo ""
echo "Or run this script with 'start' argument:"
echo "  ./setup-backend.sh start"
echo ""

# Auto-start if argument provided
if [ "$1" == "start" ] || [ "$1" == "--start" ] || [ "$1" == "-s" ]; then
    echo "🚀 Starting backend server..."
    echo "   URL: http://localhost:8000"
    echo "   Docs: http://localhost:8000/docs"
    echo "   Health: http://localhost:8000/health"
    echo ""
    uvicorn main:app --reload --port 8000
fi
