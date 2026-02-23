const mongoose = require('mongoose');
const { connectToDatabase } = require('./db');
const Profile = require('./models/Profile');

/**
 * Profile API Serverless Function
 * Handles GET and PUT requests for profile data
 * Requirements: 2.1, 2.5, 2.6, 8.1, 8.2, 8.3, 8.4
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Connect to database
    await connectToDatabase();

    // Handle GET request - Retrieve profile data
    if (req.method === 'GET') {
      try {
        // Find the first profile (assuming single profile for portfolio)
        const profile = await Profile.findOne();

        if (!profile) {
          return res.status(404).json({
            success: false,
            error: 'Profile not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: profile
        });
      } catch (error) {
        console.error('Database error retrieving profile:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });

        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve profile data'
        });
      }
    }

    // Handle PUT request - Update profile data
    if (req.method === 'PUT') {
      try {
        const profileData = req.body;

        // Validate required fields
        if (!profileData.name || !profileData.title) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: name and title are required'
          });
        }

        // Validate data types
        if (typeof profileData.name !== 'string' || typeof profileData.title !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Invalid data types: name and title must be strings'
          });
        }

        // Validate email format if provided
        if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid email format'
          });
        }

        // Validate skills is an array if provided
        if (profileData.skills && !Array.isArray(profileData.skills)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid data type: skills must be an array'
          });
        }

        // Find and update the profile, or create if doesn't exist
        const profile = await Profile.findOneAndUpdate(
          {}, // Find first profile
          profileData,
          {
            new: true, // Return updated document
            upsert: true, // Create if doesn't exist
            runValidators: true // Run schema validators
          }
        );

        return res.status(200).json({
          success: true,
          data: profile
        });
      } catch (error) {
        console.error('Database error updating profile:', {
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
          error: 'Failed to update profile data'
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
    console.error('Connection error in profile API:', {
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
