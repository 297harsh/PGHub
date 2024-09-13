require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserDataModel = require("../models/UserDataModel");
const { generateToken } = require("../utils/generateToken");
const { sendEmail } = require("../utils/sendEmail");

exports.userRegistration = async (req, res) => {
  try {
    const { userName, email, mobileNo, password, role, termsAccepted } =
      req.body;

    if (
      !userName ||
      !email ||
      !mobileNo ||
      !password ||
      !role ||
      !termsAccepted
    ) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Missing or invalid data",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    let existingUser = await UserDataModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(200)
        .json({ success: false, message: "Already Registered, Please login" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new UserDataModel({
      userName,
      email,
      mobileNo,
      password: hashPassword,
      role,
      webterm: termsAccepted,
      verificationToken,
    });

    try {
      const savedUser = await newUser.save();
      if (savedUser) {
        const token = await generateToken(savedUser);
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&uid=${savedUser._id}`;
        // const html = `<p>Please verify your email by clicking on the following link:</p><p><a href="${verificationUrl}">Verify Email</a></p>`;
        const html = `<!DOCTYPE html>
          <html lang="en">

          <head>
              <title>Email Verification</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      /* color: #000000; */
                      font-size: 14px;
                      background-origin: auto;
                  }

                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #fff;
                      color: #000000;
                      border-radius: 8px;
                      padding: 20px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      border: 2px solid rgba(136, 160, 255, 0.75);

                  }

                  h1 {
                      color: #1f3e72;
                      text-align: center;
                  }

                  p {
                      font-size: 16px;
                      line-height: 1.5;
                  }

                  .button {
                      display: block;
                      width: 100%;
                      max-width: 200px;
                      margin: 20px auto;
                      padding: 10px;
                      text-align: center;
                      font-size: 18px;
                      color: #fff !important;
                      background-color: #1f3e72;
                      border-radius: 5px;
                      text-decoration: none;
                  }

                  .button:hover {
                      background-color: #2b50e4;
                  }

                  .footer {
                      text-align: center;
                      font-size: 12px;
                      color: #777;
                      margin-top: 20px;
                  }
              </style>
          </head>

          <body>
              <div class="container">
                  <h1>Email Verification</h1>
                  <h3>
                      <p>Hello ${savedUser.userName} !</p>
                      <p>Please verify your email by clicking on the following link:</p>
                      <a href="${verificationUrl}" class="button">Verify Email</a>
                      <p>If you did not request this, please ignore this email.</p>
                  </h3>
                  <div class="footer">
                      <p>&copy; ${new Date().getFullYear()}PGHub. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`;

        await sendEmail(email, "Verify your email", html);

        return res
          .status(200)
          .cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .json({
            success: true,
            message:
              "Registration successful. Please check your email to verify your account.",
            token,
          });
      } else {
        return res.status(500).json({
          success: false,
          message: "Registration Not Successful. Please try again",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error in Saving User Data" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const user = await UserDataModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please register an account.",
      });
    }

    // if (!user.is_verified) {
    //   return res.status(403).json({
    //     success: false,
    //     message:
    //       "Your email is not verified. Please check your inbox and verify your email to proceed.",
    //   });
    // }

    if (user.role == "owner") {
      if (!user.is_ownerVerified) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been banned by the administrator. Please contact support for further assistance.",
        });
      }
    }

    if (user.role == "renter") {
      if (!user.is_renterVerified) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been banned by the administrator. Please contact support for further assistance.",
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter correct password" });
    }

    const token = await generateToken(user);
    return res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENVIRONMENT === "production",
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token: token,
        userData: user,
      });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.VerifyEmail = async (req, res) => {
  const { token, uid } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  try {
    const trimmedToken = token.trim();

    const user = await UserDataModel.findOne({
      verificationToken: trimmedToken,
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    user.is_verified = true;
    if (user.role == "renter") {
      user.is_renterVerified = true;
    }
    if (user.role == "owner") {
      user.is_ownerVerified = true;
    }

    const verifiedUser = await user.save();
    const authtoken = await generateToken(verifiedUser);

    res
      .cookie("authToken", authtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENVIRONMENT === "production",
      })
      .status(200)
      .json({
        success: true,
        message: "Email verified successfully!",
        token: authtoken,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.userGetUserData = async (req, res) => {
  const email = req.decodedUserData.email;
  try {
    const user = await UserDataModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User Data ", userData: user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateUserData = async (req, res) => {
  const userId = req.params.userId;
  const { changedValues } = req.body;
  console.log("changedValues",changedValues)

  try {
    const user = await UserDataModel.findByIdAndUpdate(
      userId,
      { $set: changedValues }, 
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User data updated successfully",
      userData: user,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
