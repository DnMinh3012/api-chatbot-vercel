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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("common"));

// Connect to the database

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect("mongodb+srv://dnhatminh1230:4iFQCp8mYqYGsAFv@chatbot.reg36mk.mongodb.net/?retryWrites=true&w=majority&appName=chatbot")
   .then(async () => {
      console.log("Connected to MongoDB");
   }).catch(error => {
      console.error("Error connecting to MongoDB:", error);
   });


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
