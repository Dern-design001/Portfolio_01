# Portfolio Application with MongoDB & Vercel

A modern, full-stack portfolio application built with React and MongoDB Atlas, deployed on Vercel.

## Features

- **Beautiful UI**: Modern design with indigo/purple theme, rounded cards, and smooth animations
- **MongoDB Integration**: All data stored in MongoDB Atlas with full CRUD operations
- **Serverless API**: Backend API endpoints deployed as Vercel serverless functions
- **Edit Mode**: Toggle edit mode to add, update, or delete content
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Four Main Sections**:
  - Home: Hero section with profile information
  - Projects: Technical projects showcase
  - Ventures: Creative ventures and side projects
  - About: Profile details and career milestones

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, MongoDB Atlas, Mongoose
- **Deployment**: Vercel (serverless functions + static hosting)

## Getting Started

### Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account
- Vercel account (for deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## API Endpoints

All endpoints are available at `/api/`:

- `GET /api/profile` - Get profile data
- `PUT /api/profile` - Update profile data
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects?id=<id>` - Update project
- `DELETE /api/projects?id=<id>` - Delete project
- `GET /api/ventures` - Get all ventures
- `POST /api/ventures` - Create new venture
- `PUT /api/ventures?id=<id>` - Update venture
- `DELETE /api/ventures?id=<id>` - Delete venture
- `GET /api/milestones` - Get all milestones
- `POST /api/milestones` - Create new milestone
- `PUT /api/milestones?id=<id>` - Update milestone
- `DELETE /api/milestones?id=<id>` - Delete milestone

## Deployment

Deploy to Vercel with one command:

```bash
vercel
```

Make sure to add your `MONGODB_URI` environment variable in the Vercel dashboard.

## Usage

1. **View Mode**: Browse your portfolio content
2. **Edit Mode**: Click "Edit" button to enable editing
   - Add new items using "Add New" buttons
   - Edit existing items with the edit icon
   - Delete items with the trash icon
3. **Navigation**: Use the top navigation to switch between pages

## License

ISC
