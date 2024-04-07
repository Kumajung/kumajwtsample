const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Replace with your actual database credentials
const pool = mysql.createPool({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "db_01",
});

const app = express();
app.use(cors());
app.use(express.json());

// Secret key for JWT signing (replace with a strong, random string)
const jwtSecret = "E11CD1B2AF1F4551F44394648A3C5";

app.get("/", async (req, res) => {
  res.json({ message: "Hello Kuma world" });
});

app.get("/users", async function (req, res, next) {
  try {
    const [rows] = await pool.query("SELECT * FROM `users`");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Users List failed!" });
  }
});

// User registration endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
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
});

// User login endpoint
app.post("/login", async (req, res) => {
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
});

// Protected route example (middleware to verify JWT)
app.get("/protected", (req, res) => {
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
});

app.listen(3000, () => console.log("Server listening on port 3000"));
