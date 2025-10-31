const mongoose = require("mongoose");
require('dotenv').config();

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Database Connected (Local MongoDB)");
  } catch (err) {
    console.error("Database Connection Failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDb;
