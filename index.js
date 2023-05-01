const express = require("express");
const { connectToMongoDB } = require("./dbconfig");
const userRouter = require("./routes/userRoute");
const qrRouter = require("./routes/qrRoute");

require("dotenv").config();

// Create an instance of the express application
const app = express();

// Connect to MongoDB
connectToMongoDB(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Set the port number
const PORT = process.env.PORT || 8080;

// Use JSON and URL-encoded bodies for incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.json({ message: "Hello! Welcome to QR fun" });
});

// Define routes for user and QR APIs
app.use("/api/user", userRouter);
app.use("/api/qr", qrRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}.`);
});
