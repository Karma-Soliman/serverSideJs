import mongoose from "mongoose"
import "dotenv/config"

const MONGO_URI = process.env.MONGO_URI

export const connectToMongoDB = async () => {
    if (!MONGO_URI) {
      console.error("MONGO_URI is not defined in .env")
      process.exit(1)
    } try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")
    } catch(err) {
        console.error("MongoDB connection failed: ", err)
        process.exit(1)
    }
}