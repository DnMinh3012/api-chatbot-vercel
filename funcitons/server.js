import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine"
import initWebRouter from "./route/web"
// const { onRequest } = require("firebase-functions/v2/https");
// // const logger = require("firebase-functions/logger");
// const functions = require("firebase-functions");
require('dotenv').config();
const serverless = require('serverless-http')

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRouter(app);
let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Backend is runing on the port:" + port);
})
// exports.api = functions.https.onRequest(app)
