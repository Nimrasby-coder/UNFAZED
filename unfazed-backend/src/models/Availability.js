const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true
    },
    weeklySchedule: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
          min: 0,
          max: 6
        },

        startTime: {
          type: String,
          required: true
        },

        endTime: {
          type: String,
          required: true
        }
      }
    ],

    overrides: [
      {
        date: {
          type: Date,
          required: true
        },

        startTime: String,
        endTime: String,

        isBlocked: {
          type: Boolean,
          default: false
        }
      }
    ],

    blockedSlots: [
      {
        start: {
          type: Date,
          required: true
        },

        end: {
          type: Date,
          required: true
        }
      }
    ],

    bufferTime: {
      type: Number,
      default: 0
    },

    sessionDurations: {
      type: [Number],
      enum: [30, 45, 60, 90],
      default: [60]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Availability", availabilitySchema);