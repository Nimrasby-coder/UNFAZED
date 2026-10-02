const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  updateClientIntake,
  updateClientConsent,
  getClientSessions,
} = require("../controllers/clientController");

const router = express.Router();

router.post("/", protect, createClient);

router.get("/", protect, getClients);

router.get("/:id", protect, getClientById);

router.patch("/:id", protect, updateClient);

router.patch("/:id/intake", protect, updateClientIntake);

router.patch("/:id/consent", protect, updateClientConsent);

router.get("/:id/sessions", protect, getClientSessions);

module.exports = router;