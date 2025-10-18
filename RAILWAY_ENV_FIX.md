# 🚨 CRITICAL: Railway Environment Variable Fix

## Problem Identified

Your API is returning **HTML instead of JSON** because `VITE_API_URL` is pointing to the **CLIENT URL** instead of the **SERVER URL**.

```
❌ WRONG: VITE_API_URL=https://party-zala.up.railway.app (client)
✅ RIGHT: VITE_API_URL=https://party-zala-server.up.railway.app (server)
```

---

## How to Fix in Railway Dashboard

### Step 1: Find Your Server URL

1. Go to Railway dashboard: https://railway.app
2. Click on your **SERVER** service (the one running Node.js/Express)
3. Look for the deployment URL - it will be something like:
   - `https://party-zala-server.up.railway.app`
   - `https://server-production-XXXX.up.railway.app`
   - Or a custom domain you set up
4. **Copy this URL** - this is your API URL

### Step 2: Update Client Environment Variable

1. In Railway dashboard, click on your **CLIENT** service (the one running Vite/React)
2. Click on the "Variables" tab
3. Find or add `VITE_API_URL`
4. Set it to your **SERVER URL** (from Step 1)
5. **Do NOT include `/api` at the end** - the code adds that automatically
6. Click "Save"

Example:
```bash
VITE_API_URL=https://party-zala-server.up.railway.app
```

### Step 3: Update Server Environment Variable

1. Click on your **SERVER** service
2. Click on "Variables" tab
3. Find or add `CLIENT_ORIGIN`
4. Set it to your **CLIENT URL** (the one users visit)
5. Click "Save"

Example:
```bash
CLIENT_ORIGIN=https://party-zala.up.railway.app
```

### Step 4: Trigger Redeployment

1. Go back to your **CLIENT** service
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Wait for deployment to complete (2-3 minutes)

**Important:** You MUST redeploy the client because Vite bakes environment variables into the build at compile time!

---

## How to Verify URLs Are Correct

### Check Your Service Names in Railway

You should have **TWO** services:

1. **Client Service** (React/Vite)
   - Runs: `npm run build` → `npm run preview`
   - Serves the website users visit
   - Has variable: `VITE_API_URL` → points to SERVER

2. **Server Service** (Node/Express)
   - Runs: `npm start`
   - API backend with MongoDB
   - Has variable: `CLIENT_ORIGIN` → points to CLIENT

### Railway URL Patterns

Railway generates URLs like:
- `https://[service-name]-production-[hash].up.railway.app`
- Or custom domains you set up

**To find your service URLs:**
1. Click on each service
2. Look at the "Deployments" tab
3. You'll see the deployment URL at the top

---

## Complete Environment Variable Checklist

### Client Service Variables
```bash
# Required - points to your SERVER
VITE_API_URL=https://[YOUR-SERVER-URL].up.railway.app
```

### Server Service Variables
```bash
# Required - points to your CLIENT
CLIENT_ORIGIN=https://[YOUR-CLIENT-URL].up.railway.app

# Other required vars
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_min_32_chars
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=your_password
ADMIN_NAME=Your Name
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_NAME=party_zala_token
JWT_EXPIRES=7d
PORT=4000
```

---

## Debug Output After Fix

After redeploying the client with the correct `VITE_API_URL`, you should see:

```javascript
🔧 API Configuration: {
  VITE_API_URL: "https://party-zala-server.up.railway.app",
  API_URL: "https://party-zala-server.up.railway.app",
  baseURL: "https://party-zala-server.up.railway.app/api",
  mode: "production",
  isDev: false,
  isProd: true
}

🌐 API Request: {
  method: "GET",
  url: "/auth/me",
  baseURL: "https://party-zala-server.up.railway.app/api",
  fullURL: "https://party-zala-server.up.railway.app/api/auth/me",
  withCredentials: true
}

✅ API Response: {
  status: 200,
  contentType: "application/json",
  isJSON: true,
  isHTML: false,
  dataType: "object"
}
```

If you still see `isHTML: true`, the URL is still wrong!

---

## Common Mistakes to Avoid

❌ **Don't** use the client URL for `VITE_API_URL`
❌ **Don't** include `/api` at the end of `VITE_API_URL`
❌ **Don't** include trailing slashes in URLs
❌ **Don't** forget to redeploy client after changing `VITE_API_URL`
❌ **Don't** use `http://` - must be `https://` in production

✅ **Do** use the server URL for `VITE_API_URL`
✅ **Do** use the client URL for `CLIENT_ORIGIN`
✅ **Do** redeploy client after changing environment variables
✅ **Do** wait for deployment to complete before testing
✅ **Do** check browser console for the debug output

---

## Quick Reference

| Variable | Set On | Points To | Example |
|----------|--------|-----------|---------|
| `VITE_API_URL` | Client | Server | `https://party-zala-server.up.railway.app` |
| `CLIENT_ORIGIN` | Server | Client | `https://party-zala.up.railway.app` |

**Remember:** 
- Client needs to know where the API is → `VITE_API_URL`
- Server needs to know where requests come from → `CLIENT_ORIGIN`

---

## After Fixing

1. ✅ Redeploy client with correct `VITE_API_URL`
2. ✅ Wait for deployment to complete
3. ✅ Open client URL in browser
4. ✅ Open browser console (F12)
5. ✅ Look for "🔧 API Configuration" - verify it shows your server URL
6. ✅ Try logging in
7. ✅ Should see JSON responses instead of HTML
8. ✅ Should see cookies being set
9. ✅ Should stay logged in after refresh

If you're still having issues after this fix, check:
- Server logs in Railway (might have startup errors)
- Network tab in DevTools (check actual URLs being called)
- Console for any CORS errors

---

## Need Help?

After making these changes, if you still see HTML responses:

1. Share a screenshot of your Railway dashboard showing both services
2. Share the full console output from browser DevTools
3. Share the URLs you're using for both services

The debug logging we added will make it very clear what's happening!
