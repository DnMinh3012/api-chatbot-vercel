require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import initCronJob from "./config/cronJob";
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://chatbot:<V6i.@pvnCvL6x!h>@cluster0.ifq81wh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let app = express();
import { User, Allcode } from "./model/model";
// Use body-parser to parse incoming requests

app.use(function (req, res, next) {

   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("common"));

// Connect to the database

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const connectMG = async () => {
   await mongoose.connect("mongodb+srv://dnhatminh1230:4iFQCp8mYqYGsAFv@chatbot.reg36mk.mongodb.net/?retryWrites=true&w=majority&appName=chatbot")
      .then(async () => {
         console.log("Connected to MongoDB");
      }).catch(error => {
         console.error("Error connecting to MongoDB:", error);
      });
}
connectMG();
// Configure view engine
configViewEngine(app);

// Initialize all web routes
initWebRoutes(app);

// Initialize cron job
initCronJob();

let port = process.env.PORT || 8080;

app.listen(port, () => {
   console.log(`App is running at the port ${port}`);
});
