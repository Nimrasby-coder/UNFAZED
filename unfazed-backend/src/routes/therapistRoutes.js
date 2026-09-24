const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  registerTherapist,
  loginTherapist,
  getProfile
} = require("../controllers/therapistController");

const router = express.Router();

router.post("/register", registerTherapist);

router.post("/login", loginTherapist);

router.get("/profile", protect, getProfile);

module.exports = router;