import expess from "express";
import controller, { getHomePage } from "../controller/controller";
const serverless = require('serverless-http')
let router = expess.Router();

let initWebRouter = (app) => {
    router.get("/", controller.getHomePage);
    router.post('/webhook', controller.postWebhook);
    router.get('/webhook', controller.getWebhook);
    router.post('/setup-profile', controller.setupProfile);
    return app.use('/', router);
    // return app.use('/.netlify/functions/api', router);

}

module.exports = initWebRouter;