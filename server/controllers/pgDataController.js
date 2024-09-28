require("dotenv").config();
const { PgInfoModel } = require("../models/PgInfoModel");

const capitalizedText = (text) =>
  text[0].toUpperCase() + text.slice(1).toLowerCase();

exports.getPGDetails = async (req, res) => {
  try {
    const pgId = req.params.pgId;
    const pgDetails = await PgInfoModel.findById(pgId);
    if (!pgDetails) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Fetched PG details successfully",
      pgDetails,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error in fetching PG details" });
  }
};

exports.searchByCity = async (req, res) => {
  try {
    const searchCity = req.params.city;
    const city = capitalizedText(searchCity);
    const pgDetails = await PgInfoModel.find({ city: city });
    // const pgDetails = await PgInfoModel.find({ city: city }).select('pgName gMapLocation');


    if (!pgDetails || pgDetails.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: `No PGs found in ${city}` });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched PG details successfully",
      pgDetails,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error in fetching PG details" });
  }
};
