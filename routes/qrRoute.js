// Import necessary modules
const express = require("express");

const {
  createQR,
  scanQR,
  qrScannedLocations,
} = require("../controllers/qrController");
const { verifyToken } = require("../middlewares/verifyToken");

// Create a new router instance
const qrRouter = express.Router();

// Define POST endpoints for create QR and scan QR
qrRouter.route("/create").post(createQR);
qrRouter.route("/scan").post(verifyToken, scanQR);
qrRouter.route("/qrLocations").post(qrScannedLocations);

// Export the router instance for use in other modules
module.exports = qrRouter;
