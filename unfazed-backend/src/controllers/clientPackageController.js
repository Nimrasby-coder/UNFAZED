const ClientPackage = require("../models/ClientPackage");
const Client = require("../models/Client");
const Package = require("../models/Package");

const assignPackageToClient = async (req, res) => {
  try {
    const { clientId, packageId } = req.body;

    const client = await Client.findOne({
      _id: clientId,
      therapist: req.therapistId
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found"
      });
    }

    const packageData = await Package.findOne({
      _id: packageId,
      therapist: req.therapistId,
      isActive: true
    });

    if (!packageData) {
      return res.status(404).json({
        message: "Package not found"
      });
    }

    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + packageData.validityDays
    );

    const clientPackage = await ClientPackage.create({
      client: clientId,
      package: packageId,
      therapist: req.therapistId,
      sessionsTotal: packageData.sessions,
      sessionsUsed: 0,
      expiresAt
    });

    res.status(201).json({
      message: "Package assigned to client successfully",
      clientPackage
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to assign package",
      error: error.message
    });
  }
};

const getClientPackages = async (req, res) => {
  try {
    const clientPackages = await ClientPackage.find({
      client: req.params.clientId,
      therapist: req.therapistId
    })
      .populate("client", "name email phone")
      .populate("package", "name sessions price validityDays")
      .sort({ createdAt: -1 });

    res.json({
      message: "Client packages fetched successfully",
      clientPackages
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client packages",
      error: error.message
    });
  }
};

module.exports = {
  assignPackageToClient,
  getClientPackages
};