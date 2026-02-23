const { connectToDatabase } = require('./db');
const Project = require('./models/Project');

/**
 * Projects API Serverless Function
 * Handles GET, POST, PUT, and DELETE requests for project data
 * Requirements: 2.2, 2.5, 2.6, 8.1, 8.2, 8.3, 8.4
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Connect to database
    await connectToDatabase();

    // Handle GET request - Retrieve all projects or single project by ID
    if (req.method === 'GET') {
      try {
        const { id } = req.query;

        // Get single project by ID
        if (id) {
          const project = await Project.findById(id);

          if (!project) {
            return res.status(404).json({
              success: false,
              error: 'Project not found'
            });
          }

          return res.status(200).json({
            success: true,
            data: project
          });
        }

        // Get all projects
        const projects = await Project.find().sort({ createdAt: -1 });

        return res.status(200).json({
          success: true,
          data: projects
        });
      } catch (error) {
        console.error('Database error retrieving projects:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });

        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve project data'
        });
      }
    }

    // Handle POST request - Create new project
    if (req.method === 'POST') {
      try {
        const projectData = req.body;

        // Validate required fields
        if (!projectData.title || !projectData.description) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: title and description are required'
          });
        }

        // Validate data types
        if (typeof projectData.title !== 'string' || typeof projectData.description !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data types: title and description must be strings'
          });
        }

        // Validate technologies is an array if provided
        if (projectData.technologies && !Array.isArray(projectData.technologies)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: technologies must be an array'
          });
        }

        // Validate boolean fields if provided
        if (projectData.featured !== undefined && typeof projectData.featured !== 'boolean') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: featured must be a boolean'
          });
        }

        // Create new project
        const project = new Project(projectData);
        await project.save();

        return res.status(201).json({
          success: true,
          data: project
        });
      } catch (error) {
        console.error('Database error creating project:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          data: req.body
        });

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: Object.values(error.errors).map(err => err.message)
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Failed to create project'
        });
      }
    }

    // Handle PUT request - Update existing project
    if (req.method === 'PUT') {
      try {
        const { id } = req.query;
        const projectData = req.body;

        // Validate ID is provided
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Project ID is required for update'
          });
        }

        // Validate required fields if provided
        if (projectData.title !== undefined && typeof projectData.title !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: title must be a string'
          });
        }

        if (projectData.description !== undefined && typeof projectData.description !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: description must be a string'
          });
        }

        // Validate technologies is an array if provided
        if (projectData.technologies && !Array.isArray(projectData.technologies)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: technologies must be an array'
          });
        }

        // Validate boolean fields if provided
        if (projectData.featured !== undefined && typeof projectData.featured !== 'boolean') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: featured must be a boolean'
          });
        }

        // Update project
        const project = await Project.findByIdAndUpdate(
          id,
          projectData,
          {
            new: true, // Return updated document
            runValidators: true // Run schema validators
          }
        );

        if (!project) {
          return res.status(404).json({
            success: false,
            error: 'Project not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: project
        });
      } catch (error) {
        console.error('Database error updating project:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          data: req.body
        });

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: Object.values(error.errors).map(err => err.message)
          });
        }

        // Handle invalid ObjectId errors
        if (error.name === 'CastError') {
          return res.status(400).json({
            success: false,
            error: 'Invalid project ID format'
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Failed to update project'
        });
      }
    }

    // Handle DELETE request - Remove project
    if (req.method === 'DELETE') {
      try {
        const { id } = req.query;

        // Validate ID is provided
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Project ID is required for deletion'
          });
        }

        // Delete project
        const project = await Project.findByIdAndDelete(id);

        if (!project) {
          return res.status(404).json({
            success: false,
            error: 'Project not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: project,
          message: 'Project deleted successfully'
        });
      } catch (error) {
        console.error('Database error deleting project:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          query: req.query
        });

        // Handle invalid ObjectId errors
        if (error.name === 'CastError') {
          return res.status(400).json({
            success: false,
            error: 'Invalid project ID format'
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Failed to delete project'
        });
      }
    }

    // Handle unsupported methods
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`
    });

  } catch (error) {
    // Handle database connection errors
    console.error('Connection error in projects API:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return res.status(503).json({
      success: false,
      error: 'Database connection failed. Please try again later.'
    });
  }
};
