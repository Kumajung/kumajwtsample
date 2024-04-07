const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const pool = require('./config/db');
const { readdirSync } = require('fs')

const app = express();
app.use(cors());
app.use(express.json());

readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

app.get("/", async (req, res) => {
  res.json({ message: "Hello Kuma world" });
});

app.listen(3000, () => console.log("Server listening on port 3000"));
