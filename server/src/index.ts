import "dotenv/config"
import express from "express"
import { connectToMongo } from "./config/mongodb.js"
import authRouter from "../src/routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import jobRouter from "./routes/job.route.js"
import companyRouter from "./routes/company.route.js"
import { APP_ORIGIN, PORT } from "./config/env.js"

const app = express()

app.use(cors({
    origin: APP_ORIGIN,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())



app.use("/api/auth", authRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/company", companyRouter)

app.listen(PORT, async () => {
    console.log(`Server started running at ${PORT}`);
    await connectToMongo()
})
