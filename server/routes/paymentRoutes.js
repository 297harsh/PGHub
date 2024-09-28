require("dotenv").config();
const router = require("express").Router();
const paymentController = require("../controllers/paymentController");

router.get("/bookPg", paymentController.bookPg);
router.post("/verify", paymentController.verify);
// router.post("/save", paymentController.savePayemntDetails);
// router.get("/getOwnerPayment/:ownerId", paymentController.getOwnerPayment);



module.exports = router;