#!/bin/bash

# 🚀 Quick Social Media API Setup Script
# This script helps you quickly set up environment variables for social media APIs

echo "🚀 PulseBridge Social Media API Setup"
echo "====================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Creating backup..."
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created: .env.local.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Copy example file
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
else
    echo "❌ .env.example not found. Please run this script from the project root."
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 📝 Edit .env.local with your API credentials:"
echo "   code .env.local"
echo ""
echo "2. 🔗 Follow the setup guide for each platform:"
echo "   - Facebook/Instagram: https://developers.facebook.com/"
echo "   - Twitter: https://developer.twitter.com/"
echo "   - LinkedIn: https://developer.linkedin.com/"
echo "   - TikTok: https://developers.tiktok.com/"
echo ""
echo "3. 📖 Read the complete setup guide:"
echo "   code SOCIAL_MEDIA_API_SETUP_GUIDE.md"
echo ""
echo "4. 🚀 Start development server:"
echo "   npm run dev --turbopack"
echo ""
echo "5. 🧪 Test your setup:"
echo "   http://localhost:3000/social-media"
echo ""
echo "💡 Need help? Check SOCIAL_MEDIA_API_SETUP_GUIDE.md for detailed instructions!"
echo ""
echo "🎉 Setup script complete! Happy coding!"