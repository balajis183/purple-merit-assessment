const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { protect, isManager } = require('../middleware/authMiddleware');

// Routes for the collection endpoint: /api/orders
router.get("/",  protect, isManager, getAllOrders);
router.post("/", protect, isManager, createOrder);

// Routes for a single document endpoint: /api/orders/:id
router.get("/:id", protect, isManager, getOrderById);
router.put("/:id", protect, isManager, updateOrder);
router.delete("/:id", protect, isManager, deleteOrder);

module.exports = router;
