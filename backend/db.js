const mongoose = require('mongoose');
const mongoURI =  "mongodb://localhost:27017/inotebook";

// Define the function to connect to MongoDB
async function connectToMongo() {
  try {
    // Mongoose connection (returns a Promise)
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Export the function to use it elsewhere in your application
module.exports = connectToMongo;
