# 🔍 Authentication Debugging Guide

## Overview
Comprehensive logging has been added to every step of the authentication flow. This guide will help you interpret the logs and diagnose issues.

---

## How to View Logs

### Railway Server Logs
1. Go to Railway dashboard
2. Click on your **server** service
3. Click on "Deployments" tab
4. Click on the latest deployment
5. View real-time logs

### Browser Console Logs (Client)
1. Open your deployed app: https://party-zala.up.railway.app
2. Press F12 to open DevTools
3. Go to "Console" tab
4. Try to log in
5. Watch the logs in real-time

---

## What to Look For

### 🎯 Successful Login Flow

#### **1. Client Console (Browser)**
```
🔐 Auth Store: Starting login... {email: "admin@example.com"}
📤 Auth Store: Sending login request...
API Request: POST /auth/login
✅ Auth Store: Login response: {user: {…}}
🍪 Auth Store: Response headers: {…}
✅ Auth Store: User set in state: {id: "...", name: "...", email: "..."}
```

#### **2. Server Logs (Railway)**
```
📥 Incoming Request: {method: "POST", path: "/api/auth/login", origin: "https://party-zala.up.railway.app", …}
🌐 CORS: Allowing origin: https://party-zala.up.railway.app
🔐 Login attempt: {email: "admin@example.com", origin: "https://party-zala.up.railway.app"}
🔑 Token generated: {userId: "...", tokenLength: 200, tokenPreview: "eyJhbGciOiJIUzI1NiIs..."}
🍪 Cookie set with options: {cookieName: "party_zala_token", httpOnly: true, secure: true, sameSite: "none", …}
✅ Login successful: {userId: "...", email: "admin@example.com"}
📤 Response: {statusCode: 200, headers: {set-cookie: "present", …}}
```

#### **3. /auth/me Request (Auto-triggered after login)**
```
📥 Incoming Request: {method: "GET", path: "/api/auth/me", …}
🍪 Parsed cookies: {cookieNames: ["party_zala_token"], hasPrtyZalaToken: true}
🔒 Auth middleware: {path: "/me", hasToken: true, …}
🔑 Token found: {tokenLength: 200, tokenPreview: "..."}
✅ Token verified: {userId: "..."}
✅ Auth successful: {userId: "...", email: "..."}
👤 /auth/me request: {hasUser: true, cookies: {party_zala_token: "..."}, …}
✅ /auth/me successful: {userId: "...", email: "..."}
```

---

## 🚨 Common Issues and Log Patterns

### Issue 1: CORS Blocked
**Symptom:** Login fails with CORS error in browser

**Server Logs:**
```
⚠️  CORS: Blocked unauthorized origin: https://some-other-url (expected: https://party-zala.up.railway.app)
```

**Fix:**
1. Check `CLIENT_ORIGIN` environment variable in Railway server settings
2. Must match your client URL **exactly** (no trailing slash)
3. Redeploy server after changing

---

### Issue 2: Cookie Not Being Set
**Symptom:** Login succeeds but session not persisted

**Server Logs (what you should see):**
```
🍪 Cookie set with options: {cookieName: "party_zala_token", httpOnly: true, secure: true, sameSite: "none", …}
📤 Response: {statusCode: 200, headers: {set-cookie: "present", …}}
```

**Server Logs (problem - missing set-cookie):**
```
📤 Response: {statusCode: 200, headers: {set-cookie: "none", …}}
```

**Browser DevTools Check:**
1. Go to Network tab
2. Click on POST /auth/login request
3. Go to "Headers" section
4. Look for "Response Headers"
5. Should see: `Set-Cookie: party_zala_token=...; Path=/; HttpOnly; Secure; SameSite=None`

**Fix:**
- Ensure `COOKIE_SECURE=true` in Railway server variables
- Ensure `NODE_ENV=production` in Railway server variables
- Check that `trust proxy` is enabled (already done in code)

---

### Issue 3: Cookie Not Being Sent with Requests
**Symptom:** Login works, but /auth/me fails with 401

**Server Logs:**
```
📥 Incoming Request: {method: "GET", path: "/api/auth/me", cookies: "none", …}
❌ Auth failed: No token in cookies
```

**Browser DevTools Check:**
1. Go to Application tab (Chrome) or Storage tab (Firefox)
2. Click on "Cookies" in left sidebar
3. Look for cookies under your **server domain** (not client domain!)
4. Should see: `party_zala_token`

**If cookie is there but not being sent:**
- Check cookie attributes: `SameSite=None` and `Secure` must be set
- Verify `withCredentials: true` in client (already done)

**If cookie is not there:**
- Cookie might be blocked by browser
- Check browser console for cookie warnings
- Verify Set-Cookie header was present in login response

**Fix:**
- Ensure all cookie flags are correct (already fixed in code)
- Clear browser cookies and try again
- Try in incognito/private browsing mode

---

### Issue 4: Token Invalid or Expired
**Symptom:** Login works once, fails on subsequent requests

**Server Logs:**
```
🔒 Auth middleware: {hasToken: true, …}
🔑 Token found: {tokenLength: 200, …}
❌ Auth failed: Invalid JWT {error: "invalid signature"}
```

**Fix:**
- Check that `JWT_SECRET` is the same across all deployments
- Token may have been signed with different secret
- Clear cookies and login again

---

### Issue 5: User Not Found in Database
**Symptom:** Token is valid but user lookup fails

**Server Logs:**
```
✅ Token verified: {userId: "123456"}
❌ Auth failed: User not found in DB {userId: "123456"}
```

**Fix:**
- Database connection issue
- Check MongoDB connection string
- Ensure admin user was created (check startup logs for "✅ Admin user ensured")

---

## 🔍 Step-by-Step Debugging Process

### Step 1: Check Environment Variables
```bash
# In Railway server Variables tab, verify:
CLIENT_ORIGIN=https://party-zala.up.railway.app  # Your client URL
COOKIE_SECURE=true
NODE_ENV=production
MONGODB_URI=mongodb+srv://...  # Your MongoDB connection
JWT_SECRET=...  # At least 32 characters
```

### Step 2: Check Server Startup Logs
Look for these messages when server starts:
```
✅ Connected to MongoDB
✅ Admin user ensured
🚀 Server running on port 4000
🌍 Environment: production
🔗 Client origin: https://party-zala.up.railway.app
```

### Step 3: Try Login and Watch Both Consoles

**Open two windows side-by-side:**
1. Left: Railway server logs (live tail)
2. Right: Browser with DevTools console open

**Perform login and watch logs flow through:**
1. Client sends request → logs in browser
2. Server receives request → logs in Railway
3. Server processes login → logs in Railway
4. Server sends response with cookie → logs in Railway
5. Client receives response → logs in browser
6. Client makes /auth/me request → logs in browser
7. Server validates cookie → logs in Railway
8. Success! → logs in both

### Step 4: Inspect Network Request/Response

**In Browser DevTools → Network tab:**

1. **POST /auth/login**
   - Request Headers should have: `Origin: https://party-zala.up.railway.app`
   - Response Headers should have:
     - `Access-Control-Allow-Credentials: true`
     - `Access-Control-Allow-Origin: https://party-zala.up.railway.app`
     - `Set-Cookie: party_zala_token=...; Path=/; HttpOnly; Secure; SameSite=None`

2. **GET /auth/me**
   - Request Headers should have: `Cookie: party_zala_token=...`
   - Response should be: `{user: {...}}`

### Step 5: Verify Cookie Storage

**In Browser DevTools → Application → Cookies:**

Look under your **server domain** (e.g., `https://your-server.railway.app`):
- Name: `party_zala_token`
- Value: (long JWT string)
- Domain: `your-server.railway.app`
- Path: `/`
- Expires: (7 days from now)
- HttpOnly: ✓
- Secure: ✓
- SameSite: `None`

---

## 📊 Log Emoji Legend

| Emoji | Meaning |
|-------|---------|
| 📥 | Incoming request |
| 📤 | Outgoing response |
| 🔐 | Login attempt |
| 🔒 | Auth middleware check |
| 🔑 | Token operation |
| 🍪 | Cookie operation |
| 🌐 | CORS check |
| ✅ | Success |
| ❌ | Error |
| ⚠️  | Warning |
| 👤 | User operation |
| 💧 | Hydration (session restore) |
| ℹ️  | Information |

---

## 🎯 Expected Timeline

When you deploy and test:

1. **Deploy** → 2-3 minutes (Railway builds and starts services)
2. **Visit site** → Instant (static files)
3. **Login attempt** → 1-2 seconds (network + auth)
4. **Redirect to calendar** → Instant
5. **Refresh page** → Session persists (instant)

---

## 🆘 Still Having Issues?

If you follow this guide and still can't identify the issue:

1. **Copy the exact log sequence** from both client and server
2. **Take screenshots** of:
   - Railway environment variables (blur sensitive values)
   - Browser Network tab (login request/response headers)
   - Browser Application tab (cookies)
3. **Share the logs** - the detailed logging will show exactly where the flow breaks

The logs are designed to be self-explanatory. Every step is logged with clear emoji and descriptions. Just follow the flow and look for where it stops matching the "successful" pattern.

---

## 🎉 Success Checklist

When everything works, you'll see:

- ✅ Client logs show successful login
- ✅ Server logs show cookie being set
- ✅ Server logs show CORS allowing your origin
- ✅ Browser DevTools shows cookie in Application tab
- ✅ Subsequent requests include cookie automatically
- ✅ /auth/me returns user data
- ✅ Page refresh keeps you logged in
- ✅ No CORS errors in console
- ✅ No auth errors in Railway logs

**You're now running with full observability!** 🚀
