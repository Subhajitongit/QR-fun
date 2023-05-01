// Import required modules
const qrModel = require("../models/qrCodeModel"); // import QR code model
const userModel = require("../models/userModel"); // import user model
const QRCode = require("qrcode"); // import QR code generator
const axios = require("axios"); // import axios for HTTP requests
const shortid = require("shortid"); // import short ID generator

// Define function to create a new QR code
module.exports.createQR = async function createQR(req, res) {
  try {
    // Retrieve reward points from the request body
    const { points } = req.body;

    // Generate a unique short ID for the new QR code using the shortid module
    const shortId = shortid.generate();

    // Create a new QR code object using the QR code model and the generated short ID and reward points
    let qrCode = await qrModel.create({
      codeId: shortId,
      rewardPoints: points,
    });

    // Generate a preview of the new QR code using the QRCode module
    let preview;
    QRCode.toString(
      `{"codeId":${shortId}, "rewardPoints":${points}}`, // the data to encode in the QR code
      { type: "terminal" },
      function (err, url) {
        if (err) throw err; // handle errors, if any
        preview = url; // assign the generated url to the preview variable
      }
    );

    // Return a success response with the new QR code object and preview URL
    res.status(200).json({
      message: "QR code created successfully",
      data: { qrCode },
      preview: preview,
    });
  } catch (err) {
    // Return an error response with the error message
    res.status(400).json({
      message: `Failed to create QR code: ${err.message}`,
    });
  }
};

// Define function to scan a QR code
module.exports.scanQR = async function scanQR(req, res) {
  try {
    // Retrieve code and user from the request body
    const { code } = req.body;
    const userId = req.user;

    // Find the QR code with the specified code ID
    const qrCode = await qrModel.findOne({ codeId: code });
    if (!qrCode) {
      // If QR code is not found, return a 404 error
      return res.status(404).json({ message: "QR code not found" });
    }

    // Find the user with the specified user ID
    const user = await userModel.findById(userId);
    if (!user) {
      // If user is not found, return a 404 error
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate new points for the user by adding the reward points from the QR code
    const nPoints = user.points + qrCode.rewardPoints;

    // Get the user's location using an external API
    const location = { city: "", longitude: "", latitude: "" };
    await axios
      .get(process.env.GEO_URL)
      .then((response) => {
        // Extract city, longitude, and latitude from the API response
        location.city = response.data.city;
        location.longitude = response.data.longitude;
        location.latitude = response.data.latitude;
      })
      .catch((error) => {
        console.log(error);
      });

    // Update the user's points in the database
    await userModel.findByIdAndUpdate(userId, { points: nPoints });

    // Update the QR code's location history in the database
    await qrModel.findOneAndUpdate(
      { codeId: code },
      {
        $push: { location: location },
      }
    );

    // Return a success response
    res.status(200).json({ message: "QR code scanned successfully" });
  } catch (err) {
    // Return an error response with the error message
    res.status(400).json({
      message: `Failed to scan QR code: ${err.message}`,
    });
  }
};

module.exports.qrScannedLocations = async function qrScannedLocations(
  req,
  res
) {
  try {
    // Retrieve code and user from the request body
    const { code } = req.body;

    // Find the QR code with the specified code ID
    const qrCode = await qrModel.findOne({ codeId: code });
    if (!qrCode) {
      // If QR code is not found, return a 404 error
      return res.status(404).json({ message: "QR code not found" });
    }

    res
      .status(200)
      .json({ message: "Locations found successfully", data: qrCode.location });
  } catch (err) {}
};
