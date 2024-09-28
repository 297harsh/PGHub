require("dotenv").config();
const { BookingModel } = require("../models/BookingModel");
const { PgInfoModel } = require("../models/PgInfoModel");
const UserDataModel = require("../models/UserDataModel");

const crypto = require("crypto");
const { Cashfree } = require("cashfree-pg");

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateOrderId() {
  try {
    const uniqueId = crypto.randomBytes(16).toString("hex");

    const hash = crypto.createHash("sha256");
    hash.update(uniqueId);

    const orderId = hash.digest("hex");

    return orderId.substr(0, 12);
  } catch (error) {
    console.log("Error generating order ID:", error);
    throw new Error("Order ID generation failed");
  }
}

exports.bookPg = async (req, res) => {
  try {
    const { userId, mobileNo, email, userName, pgId, amount } = req.query;

    // Generate a unique order ID
    const orderId = await generateOrderId();

    let request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: userId,
        customer_phone: mobileNo,
        customer_name: userName,
        customer_email: email,
      },
    };

    // Create the order using Cashfree SDK
    Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        if (response && response.data) {
          res.json(response.data);
        } else {
          res.status(500).json({ message: "Invalid response from Cashfree" });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          res.status(500).json({
            message: error.response.data.message,
            code: error.response.data.code,
          });
        } else {
          res
            .status(500)
            .json({ message: "Error occurred while creating order" });
        }
      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verify = async (req, res) => {
  try {
    let { orderId } = req.body;

    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        if (response && response.data) {
          res.json(response.data);
        } else {
          res.status(500).json({ message: "Invalid response from Cashfree" });
        }
      })
      .catch((error) => {
        console.log(
          "Error response from Cashfree: ",
          error.response ? error.response.data : error.message
        );
        res.status(500).json({
          message: error.response
            ? error.response.data.message
            : "Error occurred",
        });
      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
