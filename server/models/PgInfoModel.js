const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomTypeSchema = new Schema({
  RentOfBed: {
    type: Number,
    required: true,
  },
  numOfRoom: {
    type: Number,
    default: "0",
    required: true,
  },
  numOfBed: {
    type: Number,
    default: "0",
    required: true,
  },
});

const pgInfoSchema = new Schema(
  {
    // Owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    ownerEmail: {
      type: String,
      ref: "Users",
      required: true,
    },
    // ownerEmail: { type: String, required: true },

    // Basic
    pgName: { type: String, required: true },
    pgAddress: { type: String, required: true },

    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: Number, required: true },
    gMapLocation: {
      lat: { type: String, required: true },
      lng: { type: String, required: true },
    },

    images: [{ type: String }],
    operatingSince: { type: String, required: true },
    summary: { type: String, required: true },
    gender: [{ type: String }],
    suitableFor: [{ type: String }],

    // Amenities
    roomAmenities: [{ type: String }],
    commonAreaAmenities: [{ type: String }],

    // Food
    foodAvailable: { type: String, required: true },
    foodOptions: [{ type: String }],
    foodType: [{ type: String }],
    foodCharges: { type: String },
    foodChargesAmount: { type: String },

    // Room
    totalRooms: { type: Number, required: true },
    totalBeds: { type: Number, required: true },

    remaintotalNumRooms: { type: Number, default: 0 },
    remaintotalNumBeds: { type: Number, default: 0 },

    remainRoom: {
      single: { type: roomTypeSchema, required: false },
      double: { type: roomTypeSchema, required: false },
      triple: { type: roomTypeSchema, required: false },
      quadruple: { type: roomTypeSchema, required: false },
    },

    roomInfo: {
      single: { type: roomTypeSchema, required: false },
      double: { type: roomTypeSchema, required: false },
      triple: { type: roomTypeSchema, required: false },
      quad: { type: roomTypeSchema, required: false },
    },

    isFull: { type: Boolean, default: false },
    emptyroom: { type: Number },
    roomRent: { type: Number },

    // Charges
    deposit: { type: String },
    depositAmount: { type: Number },
    maintenance: { type: String, default: "NA" },
    electricityCharges: { type: String, required: true },
    waterCharges: { type: String, required: true },
    waterChargeAmount: { type: Number },

    // Rules
    houseRules: {
      noticePeriod: { type: String },
      gateClosingTime: { type: String },
      visitorEntry: { type: String },
      nonVegFood: { type: String },
      oppositeGender: { type: Boolean },
      smoking: { type: Boolean },
      drinking: { type: Boolean },
      loudMusic: { type: Boolean },
      party: { type: Boolean },
      pets: { type: Boolean },
    },

    //
    term: { type: Boolean, default: true },

    is_verified: {
      type: Boolean,
      default: true,
    },
    is_ownerVerified: {
      type: Boolean,
      default: true,
    },
    is_authorized: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PgInfoModel = mongoose.model("PGDetails", pgInfoSchema);
module.exports = { PgInfoModel };
