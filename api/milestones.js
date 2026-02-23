const { connectToDatabase } = require('./db');
const Milestone = require('./models/Milestone');

/**
 * Milestones API Serverless Function
 * Handles GET, POST, PUT, and DELETE requests for milestone data
 * Requirements: 2.4, 2.5, 2.6, 8.1, 8.2, 8.3, 8.4
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

    // Handle GET request - Retrieve all milestones or single milestone by ID
    if (req.method === 'GET') {
      try {
        const { id } = req.query;

        // Get single milestone by ID
        if (id) {
          const milestone = await Milestone.findById(id);

          if (!milestone) {
            return res.status(404).json({
              success: false,
              error: 'Milestone not found'
            });
          }

          return res.status(200).json({
            success: true,
            data: milestone
          });
        }

        // Get all milestones
        const milestones = await Milestone.find().sort({ date: -1 });

        return res.status(200).json({
          success: true,
          data: milestones
        });
      } catch (error) {
        console.error('Database error retrieving milestones:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });

        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve milestone data'
        });
      }
    }

    // Handle POST request - Create new milestone
    if (req.method === 'POST') {
      try {
        const milestoneData = req.body;

        // Validate required fields
        if (!milestoneData.title || !milestoneData.date) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: title and date are required'
          });
        }

        // Validate data types
        if (typeof milestoneData.title !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: title must be a string'
          });
        }

        // Validate date field
        const dateValue = new Date(milestoneData.date);
        if (isNaN(dateValue.getTime())) {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: date must be a valid date'
          });
        }

        // Create new milestone
        const milestone = new Milestone(milestoneData);
        await milestone.save();

        return res.status(201).json({
          success: true,
          data: milestone
        });
      } catch (error) {
        console.error('Database error creating milestone:', {
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
          error: 'Failed to create milestone'
        });
      }
    }

    // Handle PUT request - Update existing milestone
    if (req.method === 'PUT') {
      try {
        const { id } = req.query;
        const milestoneData = req.body;

        // Validate ID is provided
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Milestone ID is required for update'
          });
        }

        // Validate required fields if provided
        if (milestoneData.title !== undefined && typeof milestoneData.title !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: title must be a string'
          });
        }

        // Validate date field if provided
        if (milestoneData.date !== undefined) {
          const dateValue = new Date(milestoneData.date);
          if (isNaN(dateValue.getTime())) {
            return res.status(400).json({
              success: false,
              error: 'Invalid data type: date must be a valid date'
            });
          }
        }

        // Update milestone
        const milestone = await Milestone.findByIdAndUpdate(
          id,
          milestoneData,
          {
            new: true, // Return updated document
            runValidators: true // Run schema validators
          }
        );

        if (!milestone) {
          return res.status(404).json({
            success: false,
            error: 'Milestone not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: milestone
        });
      } catch (error) {
        console.error('Database error updating milestone:', {
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
            error: 'Invalid milestone ID format'
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Failed to update milestone'
        });
      }
    }

    // Handle DELETE request - Remove milestone
    if (req.method === 'DELETE') {
      try {
        const { id } = req.query;

        // Validate ID is provided
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Milestone ID is required for deletion'
          });
        }

        // Delete milestone
        const milestone = await Milestone.findByIdAndDelete(id);

        if (!milestone) {
          return res.status(404).json({
            success: false,
            error: 'Milestone not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: milestone,
          message: 'Milestone deleted successfully'
        });
      } catch (error) {
        console.error('Database error deleting milestone:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          query: req.query
        });

        // Handle invalid ObjectId errors
        if (error.name === 'CastError') {
          return res.status(400).json({
            success: false,
            error: 'Invalid milestone ID format'
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Failed to delete milestone'
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
    console.error('Connection error in milestones API:', {
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
