const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
//dotenv
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@redonion.uipb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const laptopCollection = client
      .db("warehouse")
      .collection("laptopCollection");
    const brandCollection = client.db("warehouse").collection("brand");
    //to get all the laptop collection
    app.get("/laptopCollection", async (req, res) => {
      const query = {};
      const cursor = laptopCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //to get all the brand collection
    app.get("/brand", async (req, res) => {
      const query = {};
      const cursor = brandCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // to get a single item
    app.get("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const laptop = await laptopCollection.findOne(query);
      res.send(laptop);
    });
    //to update the stock items
    app.put("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const updateStock = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateStock.quantity,
          sold: updateStock.sold,
        },
      };
      const result = await laptopCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    //to delete an item
    app.delete("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await laptopCollection.deleteOne(query);
      res.send(result);
    });
    //to post a new item
    app.post("/laptopCollection", async (req, res) => {
      const newLaptop = req.body;
      const result = await laptopCollection.insertOne(newLaptop);
      res.send(result);
    });
    // to filter the items that a user added
    app.get("/my-items", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = laptopCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // using jwt to create token
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.SECRET_TOKEN, {
        expiresIn: "2d",
      });
      res.send({ accessToken });
    });
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Warehouse server site is running");
});
app.listen(port, () => {
  console.log("running port of warehouse management website is ", port);
});
