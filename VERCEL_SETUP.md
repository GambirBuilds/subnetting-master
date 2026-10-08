# VERCEL DEPLOYMENT GUIDE — SUBNETTING MASTER

This repository is optimized for **zero-configuration deployment on Vercel**.

---

## 1. Quick Deploy Steps

1. **Push to GitHub**:
   Push the project repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete Subnetting Master platform"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"Add New"** > **"Project"**
   - Choose your GitHub repository (`subnetting-master`)

3. **Project Settings**:
   Vercel automatically detects Vite. Confirm the settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables (Optional)**:
   The client application runs hermetically with full client-side IPv4 math and local storage persistence. No mandatory secret keys are required to run the client.
   If using external endpoints:
   - `VITE_API_URL`: (Optional API endpoint)

5. **Deploy**:
   Click **"Deploy"**. The build completes in ~20 seconds with 0 warnings.

---

## 2. SPA Route Fallbacks

The included `vercel.json` automatically configures route rewrites so deep links and page refreshes work without `404 NOT_FOUND` errors:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Local Verification

You can verify the production build locally at any time:

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Preview production build
npm run preview
```
