const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const statusCode = require("./src/utilities/statusCode");
const {
  fetchAndStoreAssets,
  apiStatus,
} = require("./src/controllers/FetchAndStoreAssets");

// Connect to MongoDB ATLAS
mongoose.connect(
  process.env.DB_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log("Unable to connect to DB " + error);
    }
    console.log("Connected to DB Successfully");
  }
);

// Parse JSON req/res
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/start", (req, res) => {
  fetchAndStoreAssets(req, res);
});

app.get("/status", (req, res) => {
  apiStatus(req, res);
});

// Console Log The Requested Endpoint URL
app.use("/", (req, res, next) => {
  console.log(`API Call from: ${req.originalUrl}`);
  next();
});

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
