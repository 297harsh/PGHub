const routes = require('express').Router();
const visitBookingController = require("../controllers/visitBookingController")

routes.post("/newVisit", visitBookingController.createVisitRequest);

module.exports = routes;