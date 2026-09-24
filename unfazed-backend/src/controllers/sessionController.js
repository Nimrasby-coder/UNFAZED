const Session = require("../models/Session");

const createSession = async (req, res) => {
  try {
    const {
      client,
      startTime,
      endTime,
      sessionType,
      notes
    } = req.body;

    // Check for overlapping sessions
    const existingSession = await Session.findOne({
      therapist: req.therapistId,
      status: "booked",
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });

    if (existingSession) {
      return res.status(400).json({
        message: "This time slot is already booked"
      });
    }

    const session = await Session.create({
      therapist: req.therapistId,
      client,
      startTime,
      endTime,
      sessionType,
      notes
    });

    res.status(201).json({
      message: "Session booked successfully",
      session
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to book session",
      error: error.message
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      therapist: req.therapistId
    })
      .populate("client", "name email phone")
      .sort({ startTime: 1 });

    res.json({
      message: "Sessions fetched successfully",
      sessions
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message
    });
  }
};

const cancelSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({
        message: "Session is already cancelled"
      });
    }

    session.status = "cancelled";
    await session.save();

    res.json({
      message: "Session cancelled successfully",
      session
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel session",
      error: error.message
    });
  }
};

const completeSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled session cannot be completed"
      });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        message: "Session is already completed"
      });
    }

    session.status = "completed";
    await session.save();

    res.json({
      message: "Session completed successfully",
      session
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to complete session",
      error: error.message
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  cancelSession,
  completeSession
};