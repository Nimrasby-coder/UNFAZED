const Payment = require("../models/Payment");

const createPayment = async (req, res) => {
  try {
    const {
      client,
      package: packageId,
      amount
    } = req.body;

    const payment = await Payment.create({
      therapist: req.therapistId,
      client,
      package: packageId,
      amount
    });

    res.status(201).json({
      message: "Payment created successfully",
      payment
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create payment",
      error: error.message
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      therapist: req.therapistId
    })
      .populate("client", "name email phone")
      .populate("package", "name sessions price")
      .sort({ createdAt: -1 });

    res.json({
      message: "Payments fetched successfully",
      payments
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  getPayments
};