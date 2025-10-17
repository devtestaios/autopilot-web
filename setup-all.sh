#!/bin/bash
# PulseBridge.ai Complete System Setup & Startup
# One-command setup for frontend + backend

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║            🚀 PulseBridge.ai Complete Setup 🚀            ║"
echo "║                                                            ║"
echo "║   Enterprise AI Marketing Automation Platform             ║"
echo "║   Next.js 15.5.2 + FastAPI + Supabase + Claude AI        ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
SETUP_FRONTEND=true
SETUP_BACKEND=true
START_SERVICES=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --frontend-only)
            SETUP_BACKEND=false
            shift
            ;;
        --backend-only)
            SETUP_FRONTEND=false
            shift
            ;;
        --start|-s)
            START_SERVICES=true
            shift
            ;;
        --help|-h)
            echo "Usage: ./setup-all.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --frontend-only    Setup frontend only"
            echo "  --backend-only     Setup backend only"
            echo "  --start, -s        Start services after setup"
            echo "  --help, -h         Show this help"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Setup Frontend
if [ "$SETUP_FRONTEND" = true ]; then
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    FRONTEND SETUP (Next.js 15.5.2)${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    if [ -f "$SCRIPT_DIR/setup-frontend.sh" ]; then
        bash "$SCRIPT_DIR/setup-frontend.sh"
    else
        echo -e "${RED}✗${NC} setup-frontend.sh not found"
        exit 1
    fi
fi

# Setup Backend
if [ "$SETUP_BACKEND" = true ]; then
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    BACKEND SETUP (FastAPI + Python)${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    if [ -f "$SCRIPT_DIR/setup-backend.sh" ]; then
        bash "$SCRIPT_DIR/setup-backend.sh"
    else
        echo -e "${RED}✗${NC} setup-backend.sh not found"
        exit 1
    fi
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo -e "║              ${GREEN}✅ SETUP COMPLETE!${NC}                          ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Start services if requested
if [ "$START_SERVICES" = true ]; then
    echo -e "${YELLOW}🚀 Starting services...${NC}"
    echo ""
    
    # Start backend in background
    if [ "$SETUP_BACKEND" = true ]; then
        echo "Starting backend server (port 8000)..."
        cd "$SCRIPT_DIR/backend"
        source .venv/bin/activate
        uvicorn main:app --reload --port 8000 &
        BACKEND_PID=$!
        echo -e "${GREEN}✓${NC} Backend started (PID: $BACKEND_PID)"
        cd "$SCRIPT_DIR"
    fi
    
    # Wait a moment for backend to start
    sleep 2
    
    # Start frontend
    if [ "$SETUP_FRONTEND" = true ]; then
        echo "Starting frontend server (port 3000)..."
        npm run dev --turbopack
    fi
else
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo ""
    echo "1️⃣  Start the backend:"
    echo "     cd $SCRIPT_DIR/backend"
    echo "     source .venv/bin/activate"
    echo "     uvicorn main:app --reload --port 8000"
    echo ""
    echo "2️⃣  Start the frontend (in a new terminal):"
    echo "     cd $SCRIPT_DIR"
    echo "     npm run dev --turbopack"
    echo ""
    echo "3️⃣  Access the application:"
    echo "     Frontend:  http://localhost:3000"
    echo "     Backend:   http://localhost:8000"
    echo "     API Docs:  http://localhost:8000/docs"
    echo ""
    echo "Or run this script with --start to auto-start both:"
    echo "     ./setup-all.sh --start"
    echo ""
    echo -e "${GREEN}📚 Documentation:${NC} See SETUP_COMPLETE.md for details"
    echo ""
fi
