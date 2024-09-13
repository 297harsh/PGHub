const mongoose = require("mongoose");

const UsersInfoSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://asset.cloudinary.com/dp8ginana/c3894a97e51289db241d2221b82fb822",
    },
    age: {
      type: Number,
      default: null,
    },
    about: {
      type: String,
      default: "NA",
    },
    address: {
      type: String,
      default: "NA",
    },
    city: {
      type: String,
      default: "NA",
    },
    state: {
      type: String,
      default: "NA",
    },

    googleId: {
      type: String,
      unique: false,
      default: null,
    },
    facebookId: {
      type: String,
      unique: false,
      default: null,
    },
    webterm: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["admin", "owner", "renter"],
      required: true,
    },

    // verified by email
    is_verified: {
      type: Boolean,
      default: false,
    },

    is_adminVerified: {
      type: Boolean,
      default: false,
    },
    is_ownerVerified: {
      type: Boolean,
      default: false,
    },
    is_renterVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const UserInfoModel = mongoose.model("UsersInfo", UsersInfoSchema);
module.exports = UserInfoModel;
