import express, { Request, Response } from "express"
import { connectToMongo } from "./config/mongodb.js"

const PORT = 5000
const app = express()

// Mongodb connection
connectToMongo()


app.use("/", (req: Request, res: Response) => {
    res.send({
        message: "Server has been established.."
    })
})

app.listen(PORT, () => {
    console.log(`Server started running at ${PORT}`);
    
})
