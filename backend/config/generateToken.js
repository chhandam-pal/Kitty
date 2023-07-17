const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const generateToken = (id) => {
  return jwt.sign({ id }, "Rishi", {
    expiresIn: "60d",
  });
};

module.exports = generateToken;
