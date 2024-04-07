const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Secret key for JWT signing (replace with a strong, random string)
const jwtSecret = "E11CD1B2AF1F4551F44394648A3C5";
// รายชื่อผู้ใช้งาน
exports.users = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `users`");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Users List failed!" });
  }
};

// ลงทะเบียน
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    // เข้ารหัสแบบปลอดภัย
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = await pool.query(
      "INSERT INTO users (id, username, password) VALUES (NULL,?, ?)",
      [username, hashedPassword]
    );

    res.json({
      message: "User registered successfully!",
      userId: rows.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed!" });
  }
};

// User login endpoint
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password!" });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.json({ message: "Login successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed!" });
  }
};
