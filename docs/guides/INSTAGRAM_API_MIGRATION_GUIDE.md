# Instagram API Migration Guide (Post-December 2024)

## Critical Update: Instagram Basic Display API Deprecated

**Effective Date**: December 4th, 2024  
**Status**: Instagram Basic Display API is no longer available  
**Solution**: Migrate to Instagram API with Facebook Login for business use cases

## Required Meta Developer Console Configuration

### 1. Remove Instagram Basic Display Product
- Go to https://developers.facebook.com/apps/1978667392867839
- If "Instagram Basic Display" is listed in products, remove it
- This API is no longer supported

### 2. Add Instagram API Product
- Click "Add Product" in the left sidebar
- Find "Instagram API" and click "Set Up"
- Accept terms and conditions

### 3. Configure Instagram API Settings
- **Valid OAuth Redirect URIs**: `https://pulsebridge.ai/auth/instagram/callback`
- **App Domains**: `pulsebridge.ai`
- **Privacy Policy URL**: Required for app review
- **Terms of Service URL**: Required for app review

### 4. Required Permissions for Business Use Cases
The following permissions are required and have been updated in our code:

- `pages_show_list` - Access to Facebook Pages (required for Instagram business accounts)
- `pages_read_engagement` - Read engagement data from Pages
- `instagram_basic` - Basic Instagram account access
- `instagram_content_publish` - Publish content to Instagram

### 5. Instagram Account Requirements
- **Business/Creator Accounts Only**: Consumer personal accounts are no longer supported
- **Facebook Page Connection**: Instagram business accounts must be connected to a Facebook Page
- **App Review Required**: For production use, these permissions require Meta's app review

## Updated Implementation

### Backend (main.py)
```python
# Updated scope for Instagram API with Facebook Login
scope = "pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish"
```

### Frontend (social-media/page.tsx)
```typescript
// Updated Facebook SDK permissions
scope: 'pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish'
```

## Testing Process

### Development Testing
1. Add test users in Meta Developer Console
2. Test users must have Instagram business/creator accounts
3. Instagram accounts must be connected to Facebook Pages

### Production Deployment
1. Submit app for review with required permissions
2. Provide detailed use case documentation
3. Meet Meta's platform policy requirements

## Key Changes from Basic Display API

| Old (Basic Display) | New (Instagram API) |
|-------------------|-------------------|
| Personal Instagram accounts | Business/Creator accounts only |
| `instagram_basic` only | Multiple business permissions |
| Direct Instagram access | Requires Facebook Page connection |
| Limited review process | Comprehensive app review required |

## Next Steps

1. **Configure Meta Console**: Update app settings as described above
2. **Test with Business Account**: Ensure you have an Instagram business account connected to a Facebook Page
3. **Submit for Review**: For production use, submit app for Meta's review process
4. **Update Documentation**: Document business use case for app review

## App Review Requirements

To use Instagram API in production, you'll need to:

1. **Business Verification**: Verify your business with Meta
2. **Use Case Documentation**: Clearly explain how you'll use Instagram data
3. **Privacy Policy**: Detailed privacy policy covering Instagram data usage
4. **Platform Compliance**: Meet all Meta platform policies
5. **Testing Evidence**: Provide screenshots/videos of your app functionality

## Support Resources

- [Instagram API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/overview)
- [App Review Process](https://developers.facebook.com/docs/app-review)
- [Instagram Platform Policy](https://developers.facebook.com/docs/instagram-api/overview#instagram-platform-policy)