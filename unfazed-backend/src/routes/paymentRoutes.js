const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createPayment,
  getPayments
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", protect, createPayment);

router.get("/", protect, getPayments);

module.exports = router;