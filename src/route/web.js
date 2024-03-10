import expess from "express";
import controller, { getHomePage } from "../controller/controller";
const serverless = require('serverless-http')
let router = expess.Router();

let initWebRouter = (app) => {
    router.get("/", (req, res) => {
        res.send("app is running")
    });
    router.post('/webhook', controller.postWebhook);
    router.get('/webhook', controller.getWebhook);
    return app.use('/', router);
    // return app.use('/.netlify/functions/api', router);

}

module.exports = initWebRouter;