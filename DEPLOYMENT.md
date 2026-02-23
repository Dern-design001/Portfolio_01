# Portfolio Application Deployment Guide

This guide provides step-by-step instructions for deploying your React portfolio application with MongoDB Atlas backend to Vercel.

## Section 1: Prerequisites

Before you begin, ensure you have the following:

### Required Accounts and Tools

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **GitHub Account** - [Sign up here](https://github.com/)
- **Vercel Account** - [Sign up here](https://vercel.com/) (can use GitHub to sign in)
- **MongoDB Atlas Cluster** - [Sign up here](https://www.mongodb.com/cloud/atlas)

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier M0 is sufficient for development)
3. Create a database user with read/write permissions:
   - Go to Database Access → Add New Database User
   - Choose Password authentication
   - Save the username and password (you'll need these later)
4. Whitelist your IP address and Vercel's IP ranges:
   - Go to Network Access → Add IP Address
   - For development: Add your current IP or use `0.0.0.0/0` (allow from anywhere)
   - Note: `0.0.0.0/0` allows access from any IP (less secure but necessary for Vercel)
5. Get your connection string:
   - Go to Database → Connect → Connect your application
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`)
   - Replace `<username>` and `<password>` with your database user credentials
   - Add your database name after `.net/` (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/portfolio`)

## Section 2: Local Setup

### Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

### Create Environment File

Create a `.env` file in the root of your project:

```bash
# On macOS/Linux
touch .env

# On Windows (PowerShell)
New-Item .env -ItemType File

# On Windows (Command Prompt)
type nul > .env
```

Add your MongoDB connection string to the `.env` file:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/portfolio?retryWrites=true&w=majority
NODE_ENV=development
```

**Important**: Replace the connection string with your actual MongoDB Atlas connection string from Section 1.

### Verify Local Setup

Test that your application works locally:

```bash
# Start the development server
npm start
```

The application should open in your browser at `http://localhost:3000`. If you see any errors, check that:
- Your MongoDB connection string is correct
- Your MongoDB Atlas cluster is running
- Your IP address is whitelisted in MongoDB Atlas

## Section 3: Git Repository Setup

### Initialize Git Repository

If you haven't already initialized a Git repository:

```bash
# Initialize Git in your project directory
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: Portfolio application with MongoDB integration"
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name your repository (e.g., `portfolio-app`)
4. Choose "Public" or "Private"
5. **Do NOT** initialize with README, .gitignore, or license (your local repo already has these)
6. Click "Create repository"

### Connect Local Repository to GitHub

After creating the GitHub repository, connect your local repository:

```bash
# Add GitHub as remote origin (replace with your repository URL)
git remote add origin https://github.com/your-username/portfolio-app.git

# Verify the remote was added
git remote -v

# Push your code to GitHub (main branch)
git branch -M main
git push -u origin main
```

**Note**: Replace `your-username` and `portfolio-app` with your actual GitHub username and repository name.

### Verify GitHub Push

Visit your GitHub repository URL in a browser to confirm all files were pushed successfully. You should see your project files, but **not** the `.env` file (it's excluded by `.gitignore` for security).

## Section 4: Vercel Deployment

### Import Project from GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. If this is your first time, click "Import Git Repository"
4. Find your GitHub repository in the list and click "Import"
   - If you don't see your repository, click "Adjust GitHub App Permissions" to grant Vercel access

### Configure Project Settings

On the project configuration screen:

1. **Project Name**: Keep the default or customize it
2. **Framework Preset**: Should auto-detect "Create React App" (if not, select it manually)
3. **Root Directory**: Leave as `./` (root)
4. **Build Command**: Should be `npm run build` (auto-detected)
5. **Output Directory**: Should be `build` (auto-detected)

### Configure Environment Variables

This is the most critical step:

1. Scroll down to "Environment Variables" section
2. Add the following variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string (same as in your local `.env` file)
   - **Environment**: Select all (Production, Preview, Development)
3. Click "Add" to save the variable

**Important**: 
- Double-check that your connection string is correct
- Ensure there are no extra spaces or quotes
- The connection string should include your database name

### Deploy

1. Click "Deploy" button
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your React application
   - Deploy serverless functions from the `api/` directory
   - Deploy static files to CDN

The deployment typically takes 1-3 minutes. You'll see a build log showing progress.

### Get Your Deployment URL

Once deployment completes:
- You'll see a success screen with your deployment URL (e.g., `https://your-app.vercel.app`)
- Click "Visit" to open your deployed application

## Section 5: Verification Steps

### Test Frontend

1. Visit your Vercel deployment URL
2. Verify the React application loads correctly
3. Check that all pages and components render properly
4. Open browser DevTools (F12) and check Console for any errors

### Test API Endpoints

Test each API endpoint to ensure backend functionality works:

#### Test Profile Endpoint

```bash
# Replace YOUR_VERCEL_URL with your actual deployment URL
curl https://YOUR_VERCEL_URL.vercel.app/api/profile
```

Expected response: Profile data or empty object if no profile exists yet.

#### Test Projects Endpoint

```bash
curl https://YOUR_VERCEL_URL.vercel.app/api/projects
```

Expected response: Array of projects (may be empty initially).

#### Test Ventures Endpoint

```bash
curl https://YOUR_VERCEL_URL.vercel.app/api/ventures
```

Expected response: Array of ventures (may be empty initially).

#### Test Milestones Endpoint

```bash
curl https://YOUR_VERCEL_URL.vercel.app/api/milestones
```

Expected response: Array of milestones (may be empty initially).

### Verify Database Connection

1. Go to MongoDB Atlas Dashboard
2. Navigate to your cluster → Collections
3. You should see your database (e.g., `portfolio`) listed
4. Collections will be created automatically when you first add data through the API

### Test Create Operations

Use a tool like [Postman](https://www.postman.com/) or curl to test creating data:

```bash
# Create a test project
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "This is a test project",
    "technologies": ["React", "Node.js"],
    "featured": true
  }'
```

Then verify it appears in MongoDB Atlas and when you GET `/api/projects`.

## Section 6: Troubleshooting Common Issues

### Issue: "MongoServerError: bad auth"

**Cause**: Incorrect MongoDB credentials or connection string.

**Solution**:
1. Verify your MongoDB Atlas username and password
2. Check that special characters in password are URL-encoded
3. Ensure the database user has read/write permissions
4. Update the `MONGODB_URI` environment variable in Vercel:
   - Go to Project Settings → Environment Variables
   - Edit the `MONGODB_URI` value
   - Redeploy: Deployments → Click "..." → Redeploy

### Issue: "MongoServerError: IP not in whitelist"

**Cause**: Vercel's IP addresses are not whitelisted in MongoDB Atlas.

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add `0.0.0.0/0` to allow access from anywhere
4. Wait 1-2 minutes for changes to propagate
5. Redeploy your Vercel application

**Note**: `0.0.0.0/0` allows access from any IP. For production, consider using MongoDB Atlas's Vercel integration or specific IP ranges.

### Issue: API endpoints return 404

**Cause**: Vercel routing configuration issue or API files not deployed.

**Solution**:
1. Verify `vercel.json` exists in your project root
2. Check that `api/` directory and all `.js` files are committed to Git
3. Ensure `.gitignore` doesn't exclude the `api/` directory
4. Redeploy from GitHub (push a new commit)

### Issue: Build fails with "Module not found"

**Cause**: Missing dependencies in `package.json`.

**Solution**:
1. Check the build log for the specific missing module
2. Install the missing dependency locally:
   ```bash
   npm install <missing-package>
   ```
3. Commit and push the updated `package.json`:
   ```bash
   git add package.json package-lock.json
   git commit -m "Add missing dependency"
   git push
   ```
4. Vercel will automatically redeploy

### Issue: Environment variables not working

**Cause**: Environment variables not properly configured or not redeployed after changes.

**Solution**:
1. Go to Vercel Project Settings → Environment Variables
2. Verify `MONGODB_URI` is set correctly
3. Check that it's enabled for all environments (Production, Preview, Development)
4. After changing environment variables, you must redeploy:
   - Go to Deployments tab
   - Click "..." on the latest deployment → "Redeploy"
   - Or push a new commit to trigger automatic deployment

### Issue: CORS errors in browser console

**Cause**: Frontend trying to access API from different origin.

**Solution**:
- If your frontend and API are on the same Vercel deployment, CORS shouldn't be an issue
- If you need CORS, add CORS headers to your API responses:
  ```javascript
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  ```

### Issue: Serverless function timeout

**Cause**: Database operation taking too long or connection not being reused.

**Solution**:
1. Verify connection pooling is working (check `api/db.js`)
2. Ensure MongoDB Atlas cluster is in a nearby region
3. Check MongoDB Atlas performance metrics for slow queries
4. Optimize database queries with indexes if needed

### Issue: Data not persisting

**Cause**: Database operations failing silently or wrong database being used.

**Solution**:
1. Check Vercel function logs:
   - Go to your project → Deployments → Click on deployment → Functions tab
   - Click on a function to see its logs
2. Verify the database name in your connection string
3. Check MongoDB Atlas for the correct database and collections
4. Add console.log statements to your API functions to debug

### Getting Help

If you encounter issues not covered here:

1. **Check Vercel Logs**: Project → Deployments → Click deployment → View Function Logs
2. **Check MongoDB Atlas Logs**: Cluster → Metrics tab
3. **Vercel Documentation**: https://vercel.com/docs
4. **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/
5. **GitHub Issues**: Check if others have reported similar issues

## Next Steps

After successful deployment:

1. **Set up custom domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain and follow DNS configuration instructions

2. **Enable automatic deployments**:
   - Already enabled by default
   - Every push to `main` branch triggers a new deployment

3. **Set up preview deployments**:
   - Create a new branch, push changes
   - Vercel automatically creates a preview deployment
   - Perfect for testing before merging to main

4. **Monitor your application**:
   - Use Vercel Analytics to track performance
   - Monitor MongoDB Atlas metrics for database performance
   - Set up alerts for errors or performance issues

5. **Add data to your portfolio**:
   - Use the API endpoints to add your projects, ventures, and milestones
   - Or create an admin interface for easier data management

Congratulations! Your portfolio application is now live on Vercel with MongoDB Atlas backend. 🎉
