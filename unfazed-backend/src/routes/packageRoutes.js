const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage
} = require("../controllers/packageController");

const router = express.Router();

router.post("/", protect, createPackage);

router.get("/", protect, getPackages);

router.get("/:id", protect, getPackageById);

router.patch("/:id", protect, updatePackage);

module.exports = router;