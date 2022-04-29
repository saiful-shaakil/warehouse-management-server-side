const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
    const warehouseCollection = client
      .db("warehouse")
      .collection("warehouseCollection");
    app.get("/collection", async (req, res) => {
      const query = {};
      const cursor = warehouseCollection.find(query);
      const result = await cursor.toArray();
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
