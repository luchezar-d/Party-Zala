# Authentication Fix Checklist

## Changes Applied ✅

### Server Changes
1. **Trust Proxy**: Added `app.set('trust proxy', 1)` to handle secure cookies behind Railway's proxy
2. **CORS Configuration**: 
   - Strict origin checking (only allows requests from `CLIENT_ORIGIN`)
   - Enabled credentials support
   - Exposed `Set-Cookie` header
   - Added logging for blocked origins
3. **Cookie Settings**:
   - `sameSite: 'none'` in production (required for cross-origin)
   - `sameSite: 'lax'` in development
   - `httpOnly: true` (security)
   - `secure: true` in production (HTTPS only)
   - `path: '/'` (available everywhere)
   - `maxAge: 7 days`

### Client Configuration (Already Correct)
- `withCredentials: true` in axios configuration
- Correct API URL from environment variable

---

## Railway Environment Variables to Verify

### Client Service Variables
```bash
VITE_API_URL=https://your-server-url.railway.app
```
⚠️ **Important**: Replace with your actual Railway server URL (no trailing slash)

### Server Service Variables
```bash
# Required
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Admin Name
CLIENT_ORIGIN=https://your-client-url.railway.app
NODE_ENV=production

# Cookie settings (CRITICAL for authentication)
COOKIE_SECURE=true
COOKIE_NAME=party_zala_token

# Optional (have defaults)
JWT_EXPIRES=7d
PORT=4000
```

⚠️ **Critical Variables**:
1. `CLIENT_ORIGIN` must be your **client's Railway URL** (exact match, no trailing slash)
2. `COOKIE_SECURE=true` must be set for HTTPS
3. `NODE_ENV=production` triggers the correct `sameSite` setting

---

## Deployment Steps

### 1. Check Railway Environment Variables
```bash
# In Railway dashboard for SERVER service:
1. Go to Variables tab
2. Verify CLIENT_ORIGIN matches your client URL exactly
3. Verify COOKIE_SECURE=true
4. Verify NODE_ENV=production
5. Save if any changes made
```

### 2. Trigger Redeployment
Both services will automatically redeploy from the pushed commits. To manually trigger:
```bash
# In Railway dashboard:
1. Go to each service (client and server)
2. Click "Deployments" tab
3. Click "Deploy" on the latest commit
```

### 3. Wait for Deployment
- Server should deploy and start successfully
- Client should build and serve
- Check deployment logs for any errors

---

## Testing Authentication

### 1. Open Browser DevTools
```
1. Open your client URL in browser
2. Press F12 to open DevTools
3. Go to Network tab
4. Check "Preserve log"
```

### 2. Test Login Flow
```
1. Go to login page
2. Enter credentials:
   - Email: Your ADMIN_EMAIL
   - Password: Your ADMIN_PASSWORD
3. Submit login form
```

### 3. Check Network Tab
Look for the POST request to `/api/auth/login`:

**Request Headers should include:**
```
Origin: https://your-client-url.railway.app
```

**Response Headers should include:**
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://your-client-url.railway.app
Set-Cookie: party_zala_token=...; Path=/; HttpOnly; Secure; SameSite=None
```

### 4. Check Cookies
```
1. Go to Application tab (Chrome) or Storage tab (Firefox)
2. Look under Cookies
3. You should see: party_zala_token
4. Cookie attributes should show:
   - HttpOnly: ✓
   - Secure: ✓
   - SameSite: None
   - Path: /
```

### 5. Verify Session
```
1. If login successful, you should be redirected to calendar
2. Refresh the page - you should stay logged in
3. Check Network tab for /api/auth/me request
4. Cookie should be automatically sent with request
```

---

## Troubleshooting

### Issue: "CORS policy blocked"
**Check:**
- `CLIENT_ORIGIN` in server matches your client URL exactly
- No trailing slashes in URLs
- Client is using HTTPS (required for SameSite=None)

### Issue: Cookie not being set
**Check:**
- `COOKIE_SECURE=true` is set in server
- Both client and server are using HTTPS
- Response headers include `Set-Cookie`
- Browser DevTools > Application > Cookies

### Issue: Cookie not being sent with requests
**Check:**
- Cookie has `SameSite=None` attribute
- Cookie has `Secure` attribute
- Client axios has `withCredentials: true`
- Request is to the same domain as cookie

### Issue: Login works but session lost on refresh
**Check:**
- Cookie `maxAge` is set (7 days)
- Cookie `path` is `/`
- `/api/auth/me` endpoint is working
- Cookie is not being cleared accidentally

---

## Expected Behavior After Fix

✅ Login form submits successfully  
✅ User sees calendar page after login  
✅ Cookie is set in browser  
✅ Cookie persists after page refresh  
✅ User stays logged in across sessions  
✅ Cookie is sent with all API requests  
✅ No CORS errors in console  

---

## Debugging Commands

### Check Server Logs in Railway
```bash
# In Railway dashboard:
1. Click on server service
2. Go to "Deployments" tab
3. Click on latest deployment
4. View logs in real-time
```

### Look for these log messages:
```
✅ Connected to MongoDB
✅ Admin user ensured
🚀 Server running on port XXXX
🌍 Environment: production
🔗 Client origin: https://your-client-url.railway.app
```

### If you see CORS warnings:
```
⚠️ Blocked request from unauthorized origin: https://some-url
```
This means `CLIENT_ORIGIN` doesn't match the requesting origin.

---

## Common Mistakes to Avoid

❌ **Don't** include trailing slashes in URLs:
```bash
# Wrong:
CLIENT_ORIGIN=https://your-app.railway.app/

# Correct:
CLIENT_ORIGIN=https://your-app.railway.app
```

❌ **Don't** forget to set `COOKIE_SECURE=true` in production

❌ **Don't** use `http://` URLs in production (must be `https://`)

❌ **Don't** use `localhost` URLs when testing Railway deployment

❌ **Don't** forget to redeploy after changing environment variables

---

## Success Criteria

When everything is working correctly:

1. ✅ Can login without CORS errors
2. ✅ Can see calendar page after login
3. ✅ Session persists after page refresh
4. ✅ Cookie visible in DevTools
5. ✅ Cookie sent with all API requests
6. ✅ Can logout successfully
7. ✅ No console errors related to auth

---

## Next Steps After Authentication Works

1. Test all calendar features (create, edit, delete parties)
2. Test responsive design on mobile
3. Set up custom domain (optional)
4. Monitor logs for any errors
5. Set up monitoring/alerts (optional)

---

## Support

If you're still having issues after following this checklist:

1. Check Railway deployment logs for errors
2. Check browser console for JavaScript errors
3. Use Network tab to inspect request/response headers
4. Verify all environment variables are set correctly
5. Try clearing browser cookies and cache
6. Test in incognito/private browsing mode

**The changes pushed should fix the authentication. Deploy and test!** 🚀
