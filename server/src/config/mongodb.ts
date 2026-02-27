import mongoose from "mongoose";

export const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI!)
        console.log(`MongoDb instance started..`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}