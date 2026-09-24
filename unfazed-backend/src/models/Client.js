const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      default: ""
    },

    intake: {
      age: Number,
      gender: String,
      reasonForConsultation: String,
      emergencyContact: String
    },

    consent: {
      given: {
        type: Boolean,
        default: false
      },
      givenAt: {
        type: Date
      }
    },

    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Client", clientSchema);