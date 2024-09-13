require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");

const { generateToken } = require("../utils/generateToken");
const { verifyToken } = require("../middlewares/verifyToken");
const authController = require("../controllers/authController");
// const { sendEmail } = require("../utils/sendEmail");

router.post("/signup", authController.userRegistration);
router.post("/signin", authController.userLogin);
router.get("/verify-email",authController.VerifyEmail);
router.get("/getUserData", verifyToken, authController.userGetUserData);
router.put("/updateUserData/:userId", authController.updateUserData);



module.exports = router;