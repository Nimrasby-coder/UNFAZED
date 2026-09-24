const mongoose = require("mongoose");

const clientPackageSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true
    },

    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true
    },

    sessionsTotal: {
      type: Number,
      required: true
    },

    sessionsUsed: {
      type: Number,
      default: 0
    },

    purchasedAt: {
      type: Date,
      default: Date.now
    },

    expiresAt: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "expired", "completed"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ClientPackage", clientPackageSchema);