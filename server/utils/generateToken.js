require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    userName: user.userName,
    email: user.email,
    picture: user.profilePicture,
  };

  const secretKey = process.env.JWT_SECRETKEY;
  const options = { expiresIn: process.env.JWT_TIMEOUT };

  const token = jwt.sign(payload, secretKey, options);

  return token;
};

module.exports = { generateToken };
