const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

const createAvailability = async (req, res) => {
  try {
    const {
      weeklySchedule,
      overrides,
      blockedSlots,
      bufferTime,
      sessionDurations
    } = req.body;

    const availability = await Availability.findOneAndUpdate(
      { therapist: req.therapistId },
      {
        therapist: req.therapistId,
        weeklySchedule,
        overrides,
        blockedSlots,
        bufferTime,
        sessionDurations
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: "Availability saved successfully",
      availability
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save availability",
      error: error.message
    });
  }
};

const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({
      therapist: req.therapistId
    });

    if (!availability) {
      return res.status(404).json({
        message: "Availability not found"
      });
    }

    res.json({
      message: "Availability fetched successfully",
      availability
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch availability",
      error: error.message
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const {
      client,
      package: packageId,
      startTime,
      endTime
    } = req.body;

    const appointment = await Appointment.create({
      therapist: req.therapistId,
      client,
      package: packageId,
      startTime,
      endTime
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create appointment",
      error: error.message
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      therapist: req.therapistId
    });

    res.json({
      message: "Appointments fetched successfully",
      appointments
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({
      message: "Appointment fetched successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointment",
      error: error.message
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      therapist: req.therapistId
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    appointment.status = status;

    await appointment.save();

    res.json({
      message: "Appointment status updated successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update appointment status",
      error: error.message
    });
  }
};

module.exports = {
  createAvailability,
  getAvailability,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus
};