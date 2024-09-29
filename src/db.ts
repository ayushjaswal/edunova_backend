import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// database uri from environment variables
const my_db = process.env.PRODUCTION_MONGODB_URI;

if (!my_db) {
  console.error("MongoDB URI is not defined. Check your .env file.");
  process.exit(1);
}

// connect to the database
const connect = async () => {
  try {
    await mongoose.connect(my_db);
    console.log("Database Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

// export the function
export default connect;
