require("dotenv").config();
const router = require("express").Router();

const ownerController = require("../controllers/ownerController");
const  upload  = require('../middlewares/multer');

router.post("/pg/addnewPg", upload.array('images', 10) , ownerController.addNewPg);

// get All PG for Particuller Owner
router.post("/pg/allPg", ownerController.getAllPgs);

// get particuler pgData by id
router.get("/pg/getData/:pgId", ownerController.getPGData);


// delete owner pg based on id
router.delete("/pg/deletePg/:pgId", ownerController.deletePg);



module.exports = router;