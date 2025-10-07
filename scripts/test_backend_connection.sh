#!/bin/bash

echo "🧪 Testing Backend Database Connection..."
echo ""

echo "1️⃣ Testing Debug Endpoint..."
curl -s https://autopilot-api-1.onrender.com/debug/supabase | jq '.'
echo ""

echo "2️⃣ Testing Email Campaigns API..."
curl -s https://autopilot-api-1.onrender.com/api/email-marketing/campaigns | jq '.'
echo ""

echo "3️⃣ Testing Health Check..."
curl -s https://autopilot-api-1.onrender.com/health | jq '.'
echo ""

echo "✅ Tests complete! All endpoints should return valid JSON data."