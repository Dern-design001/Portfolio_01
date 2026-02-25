# Quick Start Guide

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

## First Time Setup

When you first run the app, the database will be empty. Here's how to add content:

1. Click the **"Edit"** button in the top right corner
2. Navigate to the **Home** page and click **"Edit Profile"** to add your information
3. Go to **Projects** page and click **"Add New"** to create your first project
4. Visit **Ventures** page to add creative projects
5. Check the **About** page to add milestones

## Edit Mode Features

When Edit Mode is enabled:

- **Profile**: Edit button appears on the home page
- **Projects/Ventures**: "Add New" button appears, plus edit/delete icons on each card
- **Milestones**: "Add New" button appears, plus edit/delete icons on each milestone

## API Testing

You can test the API endpoints directly:

```bash
# Get profile
curl http://localhost:3000/api/profile

# Create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"A cool project","technologies":["React","Node.js"]}'
```

## Deployment to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add environment variable**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string

4. **Redeploy** to apply the environment variable

## Troubleshooting

### "Failed to load data"
- Check your MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify your database user has read/write permissions

### API endpoints not working
- Make sure the backend API files are in the `/api` directory
- Check that `vercel.json` is configured correctly
- Verify environment variables are set in Vercel dashboard

### Styling issues
- Run `npm install` to ensure Tailwind CSS is installed
- Check that `tailwind.config.js` and `postcss.config.js` exist
- Verify `@tailwind` directives are in `src/index.css`

## Data Models

### Profile
```javascript
{
  name: String (required),
  title: String (required),
  bio: String,
  email: String,
  location: String,
  skills: [String],
  github: String,
  linkedin: String
}
```

### Project
```javascript
{
  title: String (required),
  description: String (required),
  technologies: [String],
  link: String,
  github: String,
  featured: Boolean
}
```

### Venture
```javascript
{
  title: String (required),
  description: String (required),
  type: String (required),
  link: String,
  featured: Boolean
}
```

### Milestone
```javascript
{
  title: String (required),
  description: String,
  date: Date (required)
}
```
