const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createAvailability,
  getAvailability,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus
} = require("../controllers/schedulingController");

const router = express.Router();

router.post("/availability", protect, createAvailability);
router.get("/availability", protect, getAvailability);

router.post("/appointments", protect, createAppointment);
router.get("/appointments", protect, getAppointments);
router.get("/appointments/:id", protect, getAppointmentById);
router.patch("/appointments/:id/status", protect, updateAppointmentStatus);

module.exports = router;