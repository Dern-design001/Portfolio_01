const { connectToDatabase } = require('./db');
const Venture = require('./models/Venture');

/**
 * Ventures API Serverless Function
 * Handles GET, POST, PUT, and DELETE requests for venture data
 * Requirements: 2.3, 2.5, 2.6, 8.1, 8.2, 8.3, 8.4
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

    // Handle GET request - Retrieve all ventures or single venture by ID
    if (req.method === 'GET') {
      try {
        const { id } = req.query;

        // Get single venture by ID
        if (id) {
          const venture = await Venture.findById(id);

          if (!venture) {
            return res.status(404).json({
              success: false,
              error: 'Venture not found'
            });
          }

          return res.status(200).json({
            success: true,
            data: venture
          });
        }

        // Get all ventures
        const ventures = await Venture.find().sort({ createdAt: -1 });

        return res.status(200).json({
          success: true,
          data: ventures
        });
      } catch (error) {
        console.error('Database error retrieving ventures:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });

        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve venture data'
        });
      }
    }

    // Handle POST request - Create new venture
    if (req.method === 'POST') {
      try {
        const ventureData = req.body;

        // Validate required fields
        if (!ventureData.title || !ventureData.description || !ventureData.type) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: title, description, and type are required'
          });
        }

        // Validate data types
        if (typeof ventureData.title !== 'string' || 
            typeof ventureData.description !== 'string' || 
            typeof ventureData.type !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data types: title, description, and type must be strings'
          });
        }

        // Validate boolean fields if provided
        if (ventureData.featured !== undefined && typeof ventureData.featured !== 'boolean') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: featured must be a boolean'
          });
        }

        // Create new venture
        const venture = new Venture(ventureData);
        await venture.save();

        return res.status(201).json({
          success: true,
          data: venture
        });
      } catch (error) {
        console.error('Database error creating venture:', {
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
          error: 'Failed to create venture'
        });
      }
    }

    // Handle PUT request - Update existing venture
    if (req.method === 'PUT') {
      try {
        const { id } = req.query;
        const ventureData = req.body;

        // Validate ID is provided
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Venture ID is required for update'
          });
        }

        // Validate required fields if provided
        if (ventureData.title !== undefined && typeof ventureData.title !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: title must be a string'
          });
        }

        if (ventureData.description !== undefined && typeof ventureData.description !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: description must be a string'
          });
        }

        if (ventureData.type !== undefined && typeof ventureData.type !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: type must be a string'
          });
        }

        // Validate boolean fields if provided
        if (ventureData.featured !== undefined && typeof ventureData.featured !== 'boolean') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: featured must be a boolean'
          });
        }

        // Update venture
        const venture = await Venture.findByIdAndUpdate(
          id,
          ventureData,
          {
            new: true, // Return updated document
            runValidators: true // Run schema validators
          }
        );

        if (!venture) {
          return res.status(404).json({
            success: false,
            error: 'Venture not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: venture
        });
      } catch (error) {
        console.error('Database error updating venture:', {
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
            error: 'Invalid venture ID format'
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Failed to update venture'
        });
      }
    }

    // Handle DELETE request - Remove venture
    if (req.method === 'DELETE') {
      try {
        const { id } = req.query;

        // Validate ID is provided
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Venture ID is required for deletion'
          });
        }

        // Delete venture
        const venture = await Venture.findByIdAndDelete(id);

        if (!venture) {
          return res.status(404).json({
            success: false,
            error: 'Venture not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: venture,
          message: 'Venture deleted successfully'
        });
      } catch (error) {
        console.error('Database error deleting venture:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          query: req.query
        });

        // Handle invalid ObjectId errors
        if (error.name === 'CastError') {
          return res.status(400).json({
            success: false,
            error: 'Invalid venture ID format'
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Failed to delete venture'
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
    console.error('Connection error in ventures API:', {
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
