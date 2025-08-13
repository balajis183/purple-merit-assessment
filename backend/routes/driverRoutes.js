const express = require("express");
const router = express.Router();

const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");

const { protect, isManager } = require('../middleware/authMiddleware');

// Routes for the collection endpoint: /api/drivers
router.get("/", protect, isManager, getAllDrivers);
router.post("/",protect, isManager, createDriver);

// Routes for a single document endpoint: /api/drivers/:id
router.get("/:id",protect, isManager, getDriverById);
router.put("/:id",protect, isManager, updateDriver);
router.delete("/:id",protect, isManager, deleteDriver);

module.exports = router;
