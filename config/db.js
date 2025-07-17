import mongoose from "mongoose";

// database connection
// Connect to MongoDB using Mongoose
export const connectDB = async () =>{
    const MONGODB_URI='mongodb+srv://soumensamanta721150:admin123@cluster0.qztdnrx.mongodb.net/express_db'
    await mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connected successfully")
    })

}