const Client = require("../models/Client");

const createClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const existingClient = await Client.findOne({
      email,
      therapist: req.therapistId
    });

    if (existingClient) {
      return res.status(400).json({
        message: "Client already exists"
      });
    }

    const client = await Client.create({
      name,
      email,
      phone,
      therapist: req.therapistId
    });

    res.status(201).json({
      message: "Client created successfully",
      client
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create client",
      error: error.message
    });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.find({
      therapist: req.therapistId
    });

    res.json({
      message: "Clients fetched successfully",
      clients
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clients",
      error: error.message
    });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found"
      });
    }

    res.json({
      message: "Client profile fetched successfully",
      client
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client profile",
      error: error.message
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found"
      });
    }

    if (name !== undefined) client.name = name;
    if (email !== undefined) client.email = email;
    if (phone !== undefined) client.phone = phone;

    await client.save();

    res.json({
      message: "Client updated successfully",
      client
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update client",
      error: error.message
    });
  }
};

const updateClientIntake = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found"
      });
    }

    client.intake = req.body;

    await client.save();

    res.json({
      message: "Client intake updated successfully",
      intake: client.intake
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update client intake",
      error: error.message
    });
  }
};

const updateClientConsent = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found"
      });
    }

    client.consent.given = req.body.given;

    if (req.body.given === true) {
      client.consent.givenAt = new Date();
    } else {
      client.consent.givenAt = undefined;
    }

    await client.save();

    res.json({
      message: "Client consent updated successfully",
      consent: client.consent
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update client consent",
      error: error.message
    });
  }
};
const getClientSessions = async (req, res) => {
  try {
    const Session = require("../models/Session");

    const sessions = await Session.find({
      client: req.params.id,
      therapist: req.therapistId
    })
      .populate("client", "name email phone")
      .sort({ startTime: -1 });

    res.json({
      message: "Client sessions fetched successfully",
      sessions
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client sessions",
      error: error.message
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  updateClientIntake,
  updateClientConsent,
  getClientSessions
};