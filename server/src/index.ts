
import express, { Request, Response } from "express"
import { connectToMongo } from "./config/mongodb.js"
import authRouter from "../src/routes/auth.route.js"
import cookieParser from "cookie-parser"

const PORT = 5000
const app = express()

app.use(cookieParser())
app.use(express.json())

// Mongodb connection
connectToMongo()

app.use("/api/auth", authRouter)

app.listen(PORT, () => {
    console.log(`Server started running at ${PORT}`);
    
})
