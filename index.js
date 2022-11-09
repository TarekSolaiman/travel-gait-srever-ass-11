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

async function run() {
  try {
    // make db for services
    const serviceDB = client.db("travelGait").collection("allServices");
    // make db for reviow
    const reviowDB = client.db("travelGait").collection("reviow");

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
      console.log(sendReviow);
      const reviowResult = await reviowDB.insertOne(sendReviow);
      res.send({ message: "Success full reviow" });
    });

    // read data in db with id
    app.get("/reviows/:id", async (req, res) => {
      const id = req.params.id;
      const query = { itemId: id };
      const result = reviowDB.find(query);
      const allReviows = await result.toArray();
      res.send(allReviows);
      console.log(allReviows);
    });

    // read data in db with email
    app.get("/allreviows", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = reviowDB.find(query);
      const allReviows = await result.toArray();
      res.send(allReviows);
    });

    //Delete data in db with id
    app.delete("/reviowdlt/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await reviowDB.deleteOne(query);
      res.send({ message: "success fuly deleted" });
    });

    //Update reviow id db with id
    app.patch("/upreviow/:id", async (req, res) => {
      const id = req.params.id;
      const newData = req.body;
      console.log(id, newData);
      // const query = {_id:ObjectId(id)}
      // const updateDoc={
      //   $set:{
      //     reviow:newData
      //   }
      // }
      // const result = await reviowDB.updateOne(query,updateDoc)
      // res.send({message:'success fuly update'})
    });
  } finally {
  }
}

run().catch((e) => console.log(e.message));

// test server
app.listen(port, () => {
  console.log(`TRAVEL GAIT server is runnin port : ${port}`);
});
