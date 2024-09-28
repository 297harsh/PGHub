const { VisitBookingModel } = require("../models/VisitBookingModel");

// Create a new visit request
exports.createVisitRequest = async (req, res) => {
  try {
    const { visitData } = req.body;
    const visitRequest = new VisitBookingModel(visitData);
    
    await visitRequest.validate();
    
    const savedRequest = await visitRequest.save();
    if (savedRequest) {
      return res
        .status(201)
        .json({ success: true, message: "Visit book succesfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Error in saving Visitrequest data" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: `Validation Error: ${error.message}` });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};
