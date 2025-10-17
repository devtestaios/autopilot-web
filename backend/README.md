# PulseBridge.ai Backend API

FastAPI backend service for the PulseBridge.ai marketing automation platform.

## 🚀 Quick Start

```bash
# Run automated setup
../setup-backend.sh

# Or manual setup:
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 📦 Dependencies Fixed (October 16, 2025)

✅ **psycopg2-binary** - PostgreSQL driver (was missing, now included)
✅ All critical dependencies verified and working

## 🔧 Configuration

Create `.env` file in this directory:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-your-key
OPENAI_API_KEY=sk-your-key
```

## 📡 API Endpoints

- Health: `http://localhost:8000/health`
- Docs: `http://localhost:8000/docs`
- OpenAPI: `http://localhost:8000/openapi.json`

## 🧪 Testing

```bash
# Import validation
python3 test_imports.py

# AI integration test
python3 test_ai_integration.py

# Google Ads integration
python3 simple_google_ads_test.py
```

## 📚 Documentation

See `../SETUP_COMPLETE.md` for comprehensive setup guide.
