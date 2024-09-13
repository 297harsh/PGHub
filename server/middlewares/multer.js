const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // import your cloudinary configuration

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "PGHUb_images", // specify the folder name where you want to store images
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });

module.exports = upload;
