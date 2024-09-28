const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersInfo",
      required: true,
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersInfo",
      required: true,
    },
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PGDetails",
      required: true,
    },

    booking: {
      typesOfRoom: { type: String, required: true },
      numbedbook: { type: Number, required: true },
      rent: { type: Number, required: true },
      deposit: { type: String },
      depositAmount: { type: Number },
      // numMonthes: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },

    paymentId:{type: String, required: true},
    paymentStatus:{type: String, required: true},

    paymentDate:{type: Date, required: true},

    paymentRefund:{type:Boolean, default: false},
    paymentRefundResone:{type:String },

  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model("Booking", bookingSchema);
module.exports = { BookingModel };
