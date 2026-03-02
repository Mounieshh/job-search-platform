import mongoose from "mongoose";
import { env } from "./env.js";

export const connectToMongo = async () => {

    try {
        await mongoose.connect(env.MONGO_URI)
        console.log(`MongoDb instance started..`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
