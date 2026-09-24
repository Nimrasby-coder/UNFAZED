const Package = require("../models/Package");

const createPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      sessions,
      price,
      validityDays
    } = req.body;

    const newPackage = await Package.create({
      therapist: req.therapistId,
      name,
      description,
      sessions,
      price,
      validityDays
    });

    res.status(201).json({
      message: "Package created successfully",
      package: newPackage
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create package",
      error: error.message
    });
  }
};

const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      therapist: req.therapistId
    });

    res.json({
      message: "Packages fetched successfully",
      packages
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch packages",
      error: error.message
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const packageData = await Package.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!packageData) {
      return res.status(404).json({
        message: "Package not found"
      });
    }

    res.json({
      message: "Package fetched successfully",
      package: packageData
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch package",
      error: error.message
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const packageData = await Package.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!packageData) {
      return res.status(404).json({
        message: "Package not found"
      });
    }

    const {
      name,
      description,
      sessions,
      price,
      validityDays
    } = req.body;

    packageData.name = name ?? packageData.name;
    packageData.description = description ?? packageData.description;
    packageData.sessions = sessions ?? packageData.sessions;
    packageData.price = price ?? packageData.price;
    packageData.validityDays = validityDays ?? packageData.validityDays;

    await packageData.save();

    res.json({
      message: "Package updated successfully",
      package: packageData
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update package",
      error: error.message
    });
  }
};

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage
};