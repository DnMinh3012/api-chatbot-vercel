import express from "express";
import bodyParser from "body-parser";//thư viện lấy tham số client sử dụng
import viewEngine from "./config/viewEnine";
import initWebRouter from "./route/web";
import connectDB from "./config/conFigdb";
// import cors from "cors";
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");
require('dotenv').config();
var cors = require('cors')
let app = express();
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
const connectMG = async () => {
   await mongoose.connect("mongodb+srv://dnhatminh1230:4iFQCp8mYqYGsAFv@chatbot.reg36mk.mongodb.net/?retryWrites=true&w=majority&appName=chatbot")
      .then(async () => {
         console.log("Connected to MongoDB");
      }).catch(error => {
         console.error("Error connecting to MongoDB:", error);
      });
}
//config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
viewEngine(app);
initWebRouter(app);
connectDB(app);

let port = process.env.PORT || 3000;
//port  === undefined => port = 3000
app.listen(port, () => {
   //callback
   console.log("Do Minh dep trai on the port: " + port);
})