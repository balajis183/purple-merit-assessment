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
router.post("/", createDriver);

// Routes for a single document endpoint: /api/drivers/:id
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

module.exports = router;
