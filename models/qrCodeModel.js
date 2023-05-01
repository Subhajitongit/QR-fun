// Import necessary modules
const mongoose = require("mongoose");

// Define a schema for the qr code collection in the database
const qrSchema = mongoose.Schema(
  {
    codeId: {
      type: String,
      required: true,
    },
    location: {
      type: [],
    },
    rewardPoints: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields to documents
);

// Define a model for the qr code collection using the schema
const qrModel = mongoose.model("qrcode", qrSchema);

// Export the model for use in other modules
module.exports = qrModel;
