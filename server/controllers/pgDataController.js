require("dotenv").config();
const { PgInfoModel } = require("../models/PgInfoModel");

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
