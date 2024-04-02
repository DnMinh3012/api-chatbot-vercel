require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import initCronJob from "./config/cronJob";
import connectDB from "./config/connectDB.js";

let app = express();

// Use body-parser to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
connectDB();

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
