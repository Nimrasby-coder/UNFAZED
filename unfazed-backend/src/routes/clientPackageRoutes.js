const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  assignPackageToClient,
  getClientPackages
} = require("../controllers/clientPackageController");

const router = express.Router();

router.post("/", protect, assignPackageToClient);

router.get("/:clientId", protect, getClientPackages);

module.exports = router;