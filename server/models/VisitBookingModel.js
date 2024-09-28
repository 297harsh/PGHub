const mongoose = require("mongoose");

const visitBookingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersInfo",
      required: [true, "Owner ID is required"],
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersInfo",
      required: [true, "Renter ID is required"],
    },
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PGDetails",
      required: [true, "PG ID is required"],
    },
    visitTime: {
      type: String,
      required: [true, "Visit time is required"],
      validate: {
        validator: function (v) {
          return /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid time format! It should be in HH:MM AM/PM format.`,
      },
    },
    visitDate: {
      type: String,
      required: [true, "Visit date is required"],
      validate: {
        validator: function (v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid date format! It should be in YYYY-MM-DD format.`,
      },
    },
    visitMessage: {
      type: String,
    },
    visitStatus: {
      type: String,
      enum: {
        values: ["pending", "cancel", "complete"],
        message:
          'Visit status must be either "pending", "cancel", or "complete"',
      },
      default: "pending",
      required: [true, "Visit status is required"],
    },
  },
  { timestamps: true }
);

const VisitBookingModel = mongoose.model("VisitRequest", visitBookingSchema);

module.exports = { VisitBookingModel };
