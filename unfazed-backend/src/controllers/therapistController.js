const Therapist = require("../models/Therapist");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerTherapist = async (req, res) => {
  try {
    const { name, email, password, phone, specialization } = req.body;

    const existingTherapist = await Therapist.findOne({ email });

    if (existingTherapist) {
      return res.status(400).json({
        message: "Therapist already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const therapist = await Therapist.create({
      name,
      email,
      password: hashedPassword,
      phone,
      specialization
    });

    res.status(201).json({
      message: "Therapist registered successfully",
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        phone: therapist.phone,
        specialization: therapist.specialization
      }
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

const loginTherapist = async (req, res) => {
  try {
    const { email, password } = req.body;

    const therapist = await Therapist.findOne({ email });

    if (!therapist) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      therapist.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: therapist._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token: token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        phone: therapist.phone,
        specialization: therapist.specialization
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.therapistId)
      .select("-password");

    if (!therapist) {
      return res.status(404).json({
        message: "Therapist not found"
      });
    }

    res.json({
      message: "Profile fetched successfully",
      therapist
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

module.exports = {
  registerTherapist,
  loginTherapist,
  getProfile
};