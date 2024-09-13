const { PgInfoModel } = require("../models/PgInfoModel");
const cloudinary = require("../config/cloudinary");

const capitalizedText = (text) =>
  text[0].toUpperCase() + text.slice(1).toLowerCase();

exports.addNewPg = async (req, res) => {
  try {
    // get image details
    const files = req.files;

    // Parse form values
    const { formValues: formValuesString } = req.body;
    const formValuesParsed = JSON.parse(formValuesString);

    // console.log("Parsed formValues:", formValuesParsed);

    // Handle file uploads
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Upload images to Cloudinary and collect URLs
    const uploadPromises = files.map((file) =>
      cloudinary.uploader
        .upload(file.path, {
          folder: "PGHUb_images",
          allowed_formats: ["jpeg", "png", "jpg"],
        })
        .then((result) => result.secure_url)
    );

    const imageUrls = await Promise.all(uploadPromises);

    const newPG = new PgInfoModel({
      ownerId: formValuesParsed.ownerId,
      ownerEmail: formValuesParsed.ownerEmail,

      pgName: formValuesParsed.pgName,
      pgAddress: formValuesParsed.pgAddress,

      city: capitalizedText(formValuesParsed.city),
      state: capitalizedText(formValuesParsed.state),
      zipcode: formValuesParsed.zipcode,
      gMapLocation: {
        lat: formValuesParsed.gMapLocation.lat,
        lng: formValuesParsed.gMapLocation.lng,
      },

      images: imageUrls,
      operatingSince: formValuesParsed.operatingSince,
      summary: formValuesParsed.summary,
      gender: formValuesParsed.gender,
      suitableFor: formValuesParsed.suitableFor,

      roomAmenities: formValuesParsed.roomAmenities,
      commonAreaAmenities: formValuesParsed.commonAreaAmenities,

      foodAvailable: formValuesParsed.foodAvailable,
      foodOptions: formValuesParsed.foodOptions,
      foodType: formValuesParsed.foodType,
      foodCharges: formValuesParsed.foodCharges,
      foodChargesAmount: formValuesParsed.foodChargesAmount,

      totalRooms: formValuesParsed.totalRooms,
      totalBeds: formValuesParsed.totalBeds,
      remaintotalnumRooms: formValuesParsed.totalRooms,
      remaintotalnumBeds: formValuesParsed.totalBeds,

      roomInfo: {
        single: formValuesParsed.roomInfo.single,
        double: formValuesParsed.roomInfo.double,
        triple: formValuesParsed.roomInfo.triple,
        quad: formValuesParsed.roomInfo.quad,
      },

      remainRoom: {
        single: formValuesParsed.roomInfo.single,
        double: formValuesParsed.roomInfo.double,
        triple: formValuesParsed.roomInfo.triple,
        quadruple: formValuesParsed.roomInfo.quadruple,
      },

      isFull: formValuesParsed.isFull,

      deposit: formValuesParsed.deposit,
      depositAmount: formValuesParsed.depositAmount,
      maintenance: formValuesParsed.maintenance,
      electricityCharges: formValuesParsed.electricityCharges,
      waterCharges: formValuesParsed.waterCharges,
      waterChargeAmount: formValuesParsed.waterChargeAmount,

      houseRules: {
        noticePeriod: formValuesParsed.houseRules.noticePeriod,
        gateClosingTime: formValuesParsed.houseRules.gateClosingTime,
        visitorEntry: formValuesParsed.houseRules.visitorEntry,
        nonVegFood: formValuesParsed.houseRules.nonVegFood,
        oppositeGender: formValuesParsed.houseRules.oppositeGender,
        smoking: formValuesParsed.houseRules.smoking,
        drinking: formValuesParsed.houseRules.drinking,
        loudMusic: formValuesParsed.houseRules.loudMusic,
        party: formValuesParsed.houseRules.party,
        pets: formValuesParsed.houseRules.pets,
      },

      term: formValuesParsed.term,

      is_verified: true,
      is_ownerVerified: true,
      is_authorized: true,
    });
    // Save PG info with image URLs
    // const savedPg = await PgInfoModel.create({
    //   ...formValuesParsed,
    //   images: imageUrls,
    // });

    // Save the new PG document to the database
    await newPG.save();

    res.status(201).json({
      success: true,
      message: "PG information saved successfully",
      newPG,
    });
  } catch (error) {
    console.error("Error saving PG information:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save PG information",
      error: error.message,
    });
  }
};

exports.getAllPgs = async (req, res) => {
  try {
    const ownerEmail = req.body.ownerEmail;
    const pgDetails = await PgInfoModel.find({ ownerEmail });

    return res.status(200).json({
      success: true,
      message: "Successfully Featched PG's Details",
      pgDetails: pgDetails,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error in Featching PG's Details" });
  }
};

exports.deletePg = async (req, res) => {
  try {
    const pgId = req.params.pgId;

    const deletedPg = await PgInfoModel.findByIdAndDelete(pgId);

    if (!deletedPg) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "PG successfully deleted" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error in Deleting PG's Details" });
  }
};

exports.getPGData = async (req, res) => {
  console.log("hii")
  try {
    const pgId = req.params.pgId;

    const pgDetails = await PgInfoModel.findById(pgId);

    if (!pgDetails) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Fetched PG details successfully" , pgDetails});
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error in Fetching PG's Details" });
  }
};
