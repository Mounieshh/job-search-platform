import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

export const connectToMongo = async () => {

    try {
        await mongoose.connect(MONGO_URI)
        console.log(`MongoDb instance started..`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
