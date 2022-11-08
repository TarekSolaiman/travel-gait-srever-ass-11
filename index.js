const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// test server
app.get("/", (req, res) => {
  res.send("Travel gait server is Running");
});

// test server
app.listen(port, () => {
  console.log(`TRAVEL GAIT server is runnin port : ${port}`);
});