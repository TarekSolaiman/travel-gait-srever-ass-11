const { MongoClient, ServerApiVersion } = require("mongodb");
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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnj1mvk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // make db for services
    const serviceDB = client.db("travelGait").collection("allServices");
  } finally {
  }
}

run().catch((e) => console.log(e.message));

// test server
app.listen(port, () => {
  console.log(`TRAVEL GAIT server is runnin port : ${port}`);
});
