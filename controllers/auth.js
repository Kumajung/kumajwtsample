const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Protected route example (middleware to verify JWT)
// Secret key for JWT signing (replace with a strong, random string)
const jwtSecret = "E11CD1B2AF1F4551F44394648A3C5";
exports.protected = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecret);
      console.log("User ID from JWT:", decoded.userId);
      res.json({ message: "Welcome to the protected route!" });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Invalid or expired token!" });
    }
};
