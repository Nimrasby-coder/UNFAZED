const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createSession,
  getSessions,
  cancelSession,
  completeSession
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/", protect, createSession);

router.get("/", protect, getSessions);

router.patch("/:id/cancel",
    protect,cancelSession
);

router.patch("/:id/complete", protect, completeSession);

module.exports = router;