const Route = require('../models/Route');
const mongoose = require('mongoose');

// @desc    Get all routes
// @route   GET /api/routes
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single route by ID
// @route   GET /api/routes/:id
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new route
// @route   POST /api/routes
const createRoute = async (req, res) => {
  try {
    const { routeID, distanceInKm, trafficLevel, baseTimeInMinutes } = req.body;

    if (!routeID || !distanceInKm || !trafficLevel || !baseTimeInMinutes) {
      return res.status(400).json({ message: 'Please provide all required fields for the route.' });
    }

    const newRoute = new Route({
      routeID,
      distanceInKm,
      trafficLevel,
      baseTimeInMinutes,
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A route with this routeID already exists.' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an existing route
// @route   PUT /api/routes/:id
const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json(route);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A route with this routeID already exists.' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a route
// @route   DELETE /api/routes/:id
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ message: 'Route removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
