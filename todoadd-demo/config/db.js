import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not set in environment variables");
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully");
    }catch (error) {
        console.log("Error in DB connection");
        console.error(error.message);
        process.exit(1);
    }
}
