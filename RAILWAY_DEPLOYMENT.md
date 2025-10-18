# 🚀 Railway Deployment Guide - Party Zala

## Required Environment Variables

### Backend (Server) - 10 variables needed:

1. **MONGODB_URI** - Your existing MongoDB connection string
2. **JWT_SECRET** - At least 32 characters random string
3. **JWT_EXPIRES** - Token expiration (e.g., "7d")
4. **COOKIE_NAME** - Cookie name (e.g., "party_zala_token")
5. **COOKIE_SECURE** - Set to "true" in production
6. **ADMIN_EMAIL** - Admin user email
7. **ADMIN_PASSWORD** - Admin user password (min 8 chars)
8. **ADMIN_NAME** - Admin display name
9. **CLIENT_ORIGIN** - Frontend URL (Railway will provide this)
10. **NODE_ENV** - Set to "production"
11. **PORT** - Railway will set this automatically

### Frontend (Client) - 1 variable needed:

1. **VITE_API_URL** - Backend URL (Railway will provide this)

---

## Step-by-Step Railway Deployment

### PART 1: Setup Railway Account (2 minutes)

1. Go to: https://railway.app
2. Click **"Login"** (top right)
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub
5. You'll get **$5 free credit per month**

---

### PART 2: Deploy Backend First (5 minutes)

#### Step 1: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select **"Party-Zala"** repository
4. Railway will detect it's a monorepo

#### Step 2: Configure Backend Service
1. Railway will ask what to deploy
2. Click **"Add variables"** or go to **Variables** tab
3. Add these variables one by one (click "+ New Variable"):

**Copy these EXACTLY (replace values with yours):**

```
MONGODB_URI=mongodb+srv://luchezarddimitrov:YOUR_PASSWORD@cluster0.etep2gv.mongodb.net/party-zala?retryWrites=true&w=majority&appName=Cluster0
```
*(Replace YOUR_PASSWORD with your actual MongoDB password)*

```
JWT_SECRET=this_is_a_super_secret_jwt_key_change_me_to_something_very_secure_at_least_32_chars
```
*(Change this to your own random string - at least 32 characters)*

```
JWT_EXPIRES=7d
```

```
COOKIE_NAME=party_zala_token
```

```
COOKIE_SECURE=true
```

```
ADMIN_EMAIL=admin@party-zala.com
```
*(Change to your preferred admin email)*

```
ADMIN_PASSWORD=YourSecurePassword123!
```
*(Change to your preferred admin password - min 8 characters)*

```
ADMIN_NAME=Party Zala Admin
```

```
NODE_ENV=production
```

```
CLIENT_ORIGIN=https://your-frontend-url.railway.app
```
*(We'll update this after deploying frontend - for now use a placeholder)*

#### Step 3: Configure Build Settings
1. Go to **Settings** tab
2. Set **Root Directory**: `server`
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm run start`
5. Click **"Deploy"**

#### Step 4: Get Backend URL
1. Wait for deployment (1-2 minutes)
2. Go to **Settings** → **Networking**
3. Click **"Generate Domain"**
4. Copy the URL (looks like: `https://party-zala-backend-production.up.railway.app`)
5. **SAVE THIS URL** - you need it for frontend!

---

### PART 3: Deploy Frontend (5 minutes)

#### Step 1: Add Frontend Service
1. In the same project, click **"+ New"**
2. Select **"GitHub Repo"** (same Party-Zala repo)
3. This creates a second service

#### Step 2: Configure Frontend Service
1. Go to **Variables** tab
2. Add this variable:

```
VITE_API_URL=https://your-backend-url-from-step4.up.railway.app
```
*(Replace with the backend URL you copied in Part 2, Step 4)*

#### Step 3: Configure Build Settings
1. Go to **Settings** tab
2. Set **Root Directory**: `client`
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: Leave empty (Railway will auto-detect)
5. Set **Install Command**: `npm install`

#### Step 4: Generate Frontend Domain
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (looks like: `https://party-zala-frontend.up.railway.app`)
4. **THIS IS YOUR APP URL!** 🎉

---

### PART 4: Update Backend CORS (2 minutes)

#### Step 1: Update CLIENT_ORIGIN
1. Go back to **Backend service**
2. Go to **Variables** tab
3. Find **CLIENT_ORIGIN** variable
4. Click **Edit**
5. Replace with your frontend URL from Part 3, Step 4
6. Click **Save**
7. Backend will auto-redeploy

---

### PART 5: Test Your Deployment (2 minutes)

1. Open your frontend URL in browser
2. You should see the Party Zala login page
3. Login with:
   - Email: The ADMIN_EMAIL you set
   - Password: The ADMIN_PASSWORD you set
4. You should now see the calendar! 🎉

---

## 🔧 Troubleshooting

### If you see "Cannot connect to server":
- Check that VITE_API_URL in frontend matches backend URL
- Check that CLIENT_ORIGIN in backend matches frontend URL
- Make sure both services are deployed and running

### If you see "MongoDB connection failed":
- Verify MONGODB_URI is correct
- Check MongoDB password has no special characters
- Make sure MongoDB allows connections from anywhere (0.0.0.0/0)

### If login doesn't work:
- Check ADMIN_EMAIL and ADMIN_PASSWORD are set correctly
- Check JWT_SECRET is at least 32 characters
- Look at backend logs in Railway (Settings → Deployments → View logs)

---

## 📝 Quick Reference - All Variables

### Backend (.env for Railway):
```
MONGODB_URI=mongodb+srv://luchezarddimitrov:PASSWORD@cluster0.etep2gv.mongodb.net/party-zala
JWT_SECRET=your-32-char-secret-here
JWT_EXPIRES=7d
COOKIE_NAME=party_zala_token
COOKIE_SECURE=true
ADMIN_EMAIL=admin@party-zala.com
ADMIN_PASSWORD=YourPassword123!
ADMIN_NAME=Party Zala Admin
NODE_ENV=production
CLIENT_ORIGIN=https://your-frontend.railway.app
```

### Frontend (.env for Railway):
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 💰 Cost Estimate
- Railway free tier: $5/month credit
- Your app usage: ~$2-3/month
- **Result: FREE for small usage!**

---

Good luck! 🚀
