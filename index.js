const express = require("express");
const cors = require("cors");
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
    //to get all the collection
    app.get("/laptopCollection", async (req, res) => {
      const query = {};
      const cursor = laptopCollection.find(query);
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
        },
      };
      const result = await laptopCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
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
  console.log("running port of warehouse is ", port);
});
