import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        // console.log("MongoDB connected successfully");
    }catch(err){
        // console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process with failure
    }}

    export default connectDB;