const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    // make db for services
    const serviceDB = client.db("travelGait").collection("allServices");
    // make db for reviow
    const reviowDB = client.db("travelGait").collection("reviow");

    // send jwtToken
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
      // console.log(user);
    });

    // create services data in db
    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await serviceDB.insertOne(service);
      res.send({ message: "successfully add" });
    });

    // read allservices data from db
    app.get("/services", async (req, res) => {
      const alldata = {};
      const size = parseInt(req.query.size);
      const services = serviceDB.find(alldata);
      const result = await services.limit(size).toArray();
      res.send(result);
    });

    // read one data from db with id
    app.get("/oneservice/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceDB.findOne(query);
      res.send(result);
    });

    // create reviow data id reviowDB
    app.post("/reviow", async (req, res) => {
      const sendReviow = req.body;
      const query = { ...sendReviow, date: new Date() };
      // console.log(query);
      const reviowResult = await reviowDB.insertOne(query);
      res.send({ message: "Success full reviow" });
    });

    // read alldata in db with id
    app.get("/reviows/:id", async (req, res) => {
      const id = req.params.id;
      const query = { itemId: id };
      const result = reviowDB.find(query);
      const allReviows = await result.toArray();
      res.send(allReviows);
      // console.log(allReviows);
    });

    // read alldata in db with email
    app.get("/allreviows", verifyJWT, async (req, res) => {
      const decoded = req.decoded;
      // console.log("aitai docod korsi", decoded);
      if (decoded.email !== req.query.email) {
        res.status(403).send({ message: "unauthorized access" });
      }
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
        const result = reviowDB.find(query);
        const allReviows = await result.toArray();
        res.send(allReviows);
      }
    });

    //Delete data in db with id
    app.delete("/reviowdlt/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await reviowDB.deleteOne(query);
      res.send({ message: "success fuly deleted" });
    });

    // read a data in db with id
    app.get("/onereviow/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviowDB.findOne(query);
      res.send(result);
      // console.log(result);
    });

    //Update reviow id db with id
    app.patch("/upreviow/:id", async (req, res) => {
      const id = req.params.id;
      const { reviow, rating } = req.body;
      // console.log(reviow);
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          reviow: reviow,
          rating: rating,
        },
      };
      const options = { upsert: true };
      const result = await reviowDB.updateOne(query, updateDoc, options);
      res.send({ message: "success fuly update" });
    });
  } finally {
  }
}

run().catch((e) => console.log(e.message));

// test server
app.listen(port, () => {
  console.log(`TRAVEL GAIT server is runnin port : ${port}`);
});
