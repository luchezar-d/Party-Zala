# MVP: Authentication Disabled

## 🚨 IMPORTANT: This is a TEMPORARY configuration for MVP launch

**Date:** January 31, 2026  
**Status:** ACTIVE - Auth is currently DISABLED  
**For:** Internal use with 3-5 trusted users

---

## What Changed

### Server (Backend)
✅ **Disabled authentication middleware** on all party routes  
✅ **Removed user checks** in party controllers (create/update/delete)  
✅ **All API endpoints are now public** - no login required  

**Files modified:**
- `server/src/routes/partyRoutes.ts` - Commented out `router.use(authenticate)`
- `server/src/controllers/partyController.ts` - Commented out `req.user` checks

### Client (Frontend)
✅ **Bypassed AuthGate** - now renders children directly without auth checks  
✅ **Removed 401 error handling** - no auto-logout or session expired redirects  
✅ **Root path (/) goes directly to calendar** - skips login page  
✅ **Mock user for UI** - CalendarPage uses hardcoded user object  
✅ **Improved mobile responsiveness** on login form (for future use)  

**Files modified:**
- `client/src/components/AuthGate.tsx` - Auth logic commented out
- `client/src/lib/api.ts` - 401 interceptor commented out
- `client/src/App.tsx` - Root route changed to CalendarPage
- `client/src/pages/CalendarPage.tsx` - Uses mock user
- `client/src/components/LoginForm.tsx` - Improved responsive design

---

## Deployment

### Railway
✅ **No configuration changes needed**  
✅ **No environment variables to update**  
✅ **Just push to GitHub** - Railway auto-deploys  

The app will work immediately after Railway builds and deploys.

---

## User Experience

### Before (With Auth)
1. User lands on login page
2. Must enter email/password
3. If wrong credentials → error
4. If session expires → kicked to login
5. Cookie/CORS issues on iOS/Safari

### After (Auth Disabled)
1. User lands directly on calendar ✅
2. No login required ✅
3. No session management ✅
4. Works on all devices ✅
5. Simple and fast ✅

---

## Security Considerations

⚠️ **This configuration is ONLY safe for:**
- Internal use
- Trusted users (3-5 people)
- Private network or password-protected deployment
- MVP/testing phase

⚠️ **DO NOT use this for:**
- Public-facing applications
- External users
- Production with sensitive data
- Multi-tenant scenarios

---

## Re-enabling Authentication (For Future)

When you're ready to re-enable authentication, follow these steps:

### 1. Server-side
```typescript
// server/src/routes/partyRoutes.ts
// Uncomment this line:
router.use(authenticate);

// server/src/controllers/partyController.ts
// Uncomment req.user checks in:
// - createParty
// - updateParty
// - deleteParty
```

### 2. Client-side
```typescript
// client/src/components/AuthGate.tsx
// Remove the early return and uncomment the auth logic

// client/src/lib/api.ts
// Uncomment the 401 error handler block

// client/src/App.tsx
// Change root route back to <Home />

// client/src/pages/CalendarPage.tsx
// Uncomment useAuthStore and remove mock user
```

### 3. Test thoroughly
- Login flow
- Session management
- Cookie settings (sameSite, secure, domain)
- CORS configuration
- 401 error handling
- Auto-logout behavior

---

## Code Preservation

✅ **All authentication code is preserved** in comments  
✅ **Easy to re-enable** - just uncomment the blocks  
✅ **No code was deleted** - everything is reversible  

Look for these markers in the code:
```
// MVP: Auth disabled
// TODO: Re-enable for production
/* COMMENTED OUT FOR MVP - KEEP FOR FUTURE USE */
```

---

## Current State Summary

| Feature | Status |
|---------|--------|
| Login Page | Hidden (but responsive design improved) |
| Session Management | Disabled |
| Cookie Authentication | Disabled |
| 401 Error Handling | Disabled |
| Auto-logout | Disabled |
| Protected Routes | All public |
| User Validation | Bypassed |
| Calendar Access | Direct (no auth) |

---

## Questions?

If you need to:
- Re-enable auth before public launch
- Add new users
- Change security settings
- Debug auth issues

Contact the development team or refer to the commented code sections.

---

**Last Updated:** January 31, 2026  
**Commit:** 7cd45c5 "MVP: Disable authentication for internal use + responsive login"
