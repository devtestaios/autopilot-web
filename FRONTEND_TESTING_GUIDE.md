# Google Ads Integration Testing Guide

## Frontend Testing Scenarios

### Test Case 1: Connection Status
**Expected API Response** (from `/google-ads/status`):
```json
{
  "status": "connected",
  "connected": true,
  "customer_id": "1234567890",
  "message": "Successfully connected to Google Ads API",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Frontend Behavior**:
- ✅ Shows green checkmark icon
- ✅ Displays "Connected to Google Ads"
- ✅ Enables "Sync Campaigns" button
- ✅ Hides setup instructions

---

### Test Case 2: Campaign Sync
**Expected API Response** (from `/google-ads/sync-campaigns`):
```json
{
  "synced": 5,
  "total": 5,
  "message": "Successfully synced 5 campaigns",
  "timestamp": "2024-01-20T10:35:00Z"
}
```

**Frontend Behavior**:
- ✅ Shows spinning icon during sync
- ✅ Displays success message: "Successfully synced 5 campaigns"
- ✅ Updates "Last sync" timestamp
- ✅ Calls onSync() to refresh campaign list
- ✅ Automatically clears message after 3 seconds

---

### Test Case 3: Real Campaign Data Structure
**Expected from Google Ads API**:
```json
{
  "campaigns": [
    {
      "id": "12345678901",
      "name": "Search Campaign - Brand Terms",
      "status": "enabled",
      "platform": "google_ads",
      "budget": 1000.0,
      "spend": 847.32,
      "client_name": "Google Ads Account",
      "metrics": {
        "impressions": 15420,
        "clicks": 892,
        "conversions": 23,
        "ctr": 0.0578,
        "cpc": 0.95,
        "channel_type": "SEARCH"
      },
      "start_date": "2024-01-01",
      "end_date": null,
      "created_at": "2024-01-20T10:30:00Z",
      "updated_at": "2024-01-20T10:30:00Z"
    }
  ],
  "count": 1,
  "source": "google_ads_api",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Frontend Compatibility**:
- ✅ Campaign cards display correctly
- ✅ Metrics show real performance data
- ✅ Budget vs spend calculations work
- ✅ Status badges render properly
- ✅ Platform-specific styling applied

---

## Manual Testing Steps

### 1. Test Connection Status
```bash
# Test the API endpoint directly
curl https://autopilot-api-1.onrender.com/google-ads/status

# Expected: Should return connection status
# Frontend: Check GoogleAdsIntegration component updates
```

### 2. Test Campaign Fetching
```bash
# Test campaign data endpoint
curl https://autopilot-api-1.onrender.com/google-ads/campaigns

# Expected: Should return real Google Ads campaigns
# Frontend: Check dashboard shows new campaigns
```

### 3. Test Campaign Sync
```bash
# Test sync endpoint
curl -X POST https://autopilot-api-1.onrender.com/google-ads/sync-campaigns

# Expected: Should sync campaigns to database
# Frontend: Check sync button shows success message
```

### 4. End-to-End Test
1. Open https://autopilot-web-rho.vercel.app
2. Check "Google Ads Integration" section
3. Should show "Connected to Google Ads" (green checkmark)
4. Click "Sync Campaigns" button
5. Should see success message
6. New campaigns should appear in dashboard
7. Campaign cards should show real metrics

---

## Troubleshooting Frontend Issues

### Issue: "Checking Connection..." never resolves
**Cause**: API endpoint not responding
**Fix**: Check backend deployment and environment variables

### Issue: Sync button stays disabled
**Cause**: Connection status not "connected"
**Fix**: Verify Google Ads API credentials are correct

### Issue: No campaigns appear after sync
**Cause**: API returns empty campaign list
**Fix**: Check Google Ads account has active campaigns

### Issue: Campaign data looks wrong
**Cause**: Data structure mismatch
**Fix**: Verify API returns data in expected format

---

## Performance Considerations

### Caching Strategy
- Connection status: Check on mount, cache for 5 minutes
- Campaign data: Refresh only on manual sync or page reload
- Performance metrics: Update daily automatically

### Error Handling
- Network timeouts: Show retry option
- API errors: Display user-friendly messages
- Rate limiting: Implement exponential backoff

### User Experience
- Loading states: Show spinners during API calls
- Success feedback: Clear confirmation messages
- Error recovery: One-click retry actions

---

## Frontend Enhancements (Future)

### Real-time Updates
- WebSocket connection for live performance data
- Auto-refresh campaigns every hour
- Push notifications for significant changes

### Advanced Features
- Campaign performance charts
- Optimization recommendations
- Batch campaign operations
- Custom performance alerts

### Mobile Optimization
- Responsive campaign cards
- Touch-friendly sync controls
- Optimized loading for mobile networks

---

## Success Criteria

✅ **Connection Test**: Status check works reliably
✅ **Data Sync**: Campaigns sync from Google Ads to dashboard  
✅ **Real Metrics**: Performance data displays accurately
✅ **Error Handling**: Clear messages for any issues
✅ **User Experience**: Intuitive sync controls and feedback

Once these tests pass, you'll have **live Google Ads data** flowing into your Autopilot platform! 🚀