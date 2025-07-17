import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// database connection
// Connect to MongoDB using Mongoose
export const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process if database connection fails
    }
}