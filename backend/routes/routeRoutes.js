const express = require("express");
const router = express.Router();

const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");

const { protect, isManager } = require('../middleware/authMiddleware');

// Routes for the collection endpoint: /api/routes
router.get("/",  protect, isManager, getAllRoutes);
router.post("/", protect, isManager, createRoute);

// Routes for a single document endpoint: /api/routes/:id
router.get("/:id", protect, isManager, getRouteById);
router.put("/:id", protect, isManager, updateRoute);
router.delete("/:id", protect, isManager, deleteRoute);

module.exports = router;
