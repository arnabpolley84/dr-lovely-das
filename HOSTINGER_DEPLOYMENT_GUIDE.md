# How to Deploy to Hostinger Using GitHub

This guide explains how to deploy this React + Vite website to **Hostinger** automatically whenever you push code to GitHub.

---

## 🎯 Recommended Method: Automated CI/CD via GitHub Actions (Best & Easiest)

We have already configured `/.github/workflows/deploy.yml` and `/public/.htaccess` in this project.
Every time you push to the `main` branch, GitHub Actions will:
1. Automatically install dependencies
2. Build the production bundle (`npm run build`)
3. Upload the resulting `dist/` files directly into your Hostinger `public_html/` directory via secure FTPS.

---

### Step 1: Push This Code to Your GitHub Repository

If you haven't already pushed your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit for Hostinger deployment"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

### Step 2: Get Your FTP Credentials from Hostinger

1. Log into your **[Hostinger hPanel](https://hpanel.hostinger.com/)**.
2. Go to **Websites** and click **Manage** on your domain.
3. In the left sidebar or search bar, search for **FTP Accounts** (under *Files*).
4. You will see:
   - **FTP IP / Hostname** (e.g., `ftp.yourdomain.com` or `185.xxx.xxx.xxx`)
   - **FTP Username** (e.g., `u123456789`)
   - **Port**: `21`
   - **FTP Password**: Click *Change password* if you don't remember it.

---

### Step 3: Add GitHub Repository Secrets

1. Open your repository on **GitHub**.
2. Click **Settings** (top navigation).
3. In the left menu, go to **Secrets and variables** ➔ **Actions**.
4. Click the green button: **New repository secret**.
5. Add the following 3 secrets:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `FTP_SERVER` | e.g. `ftp.yourdomain.com` or your Hostinger FTP IP | Found in Hostinger FTP Accounts |
| `FTP_USERNAME` | e.g. `u123456789` | Found in Hostinger FTP Accounts |
| `FTP_PASSWORD` | Your Hostinger FTP Password | The password for that FTP account |

> **Note**: If your domain is in a subfolder or subdomain instead of main `public_html`, you can edit `server-dir: ./public_html/your-subfolder/` in `.github/workflows/deploy.yml`.

---

### Step 4: Test Your First Deployment

1. Make a small commit or go to the **Actions** tab on your GitHub repository.
2. Select **Deploy to Hostinger** from the left list.
3. Click **Run workflow** ➔ **Run workflow**.
4. GitHub Actions will run the build and upload your site in ~1 to 2 minutes.
5. Visit your domain (e.g., `https://yourdomain.com`) to see your live website!

---

## 🛠️ Alternative Method: Hostinger hPanel Git (Without GitHub Actions)

If you prefer using Hostinger's built-in Git deployment tool:

1. In **hPanel**, go to **Advanced** ➔ **Git**.
2. Under **Deploy a repository**:
   - **Repository URL**: Paste your GitHub HTTPS URL (`https://github.com/user/repo.git`)
   - **Branch**: `main`
   - **Install directory**: Leave as `/` or specify target.
3. Note: Since Hostinger shared hosting does not run `npm run build` by default on pull, you would need to either:
   - Use the GitHub Actions method above (strongly recommended), OR
   - Build locally and push `dist` to a separate branch (`gh-pages` or `deploy`), OR
   - If using a **Hostinger VPS / Cloud VPS**, you can run Node.js/PM2/Nginx directly with a webhook.

---

## ⚡ Important Built-in Optimizations

1. **SPA Routing Support (`.htaccess`)**:
   - We created `/public/.htaccess`, which is automatically bundled into `dist/`.
   - This ensures routes like `/admin` and `/admin/login` work properly when refreshed on Hostinger's Apache/LiteSpeed web server without showing 404 errors.
2. **Speed & Caching**:
   - Gzip compression and long-term asset caching are pre-configured in `.htaccess`.
3. **Image Assets Resolution**:
   - All clinic images are imported via ES module imports (`import img from '../assets/images/...'`). When `npm run build` runs, Vite processes and outputs them to `dist/assets/*.jpg` with cache-busting fingerprints.
   - Copies are also placed in `/public/images/`, so they are accessible as static files at `https://marketline.sbs/images/*.jpg`.
   - Never use raw `/src/assets/...` path strings in production code, as the `/src/` folder is only used during local Vite dev and does not exist in the production `dist/` or `public_html/`.
