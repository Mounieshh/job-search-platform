import "dotenv/config"
import express from "express"
import dns from "node:dns"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectToMongo } from "./config/mongodb.js"
import { APP_ORIGIN, PORT } from "./config/env.js"

import authRouter from "./routes/auth.route.js"
import jobRouter from "./routes/job.route.js"
import companyRouter from "./routes/company.route.js"
import leadRouter from "./routes/lead.route.js"
import communityRouter from "./routes/community.route.js"
import userRouter from "./routes/profile.route.js"

dns.setServers(["1.1.1.1"])

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://job-search-community.vercel.app",
    APP_ORIGIN
]

app.use(cors({
    origin: function (origin, callback) {
        if(!origin) return callback(null, true)

        if (allowedOrigins.includes(origin) || process.env.APP_ORIGIN === "*") {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("API running");
})

app.use("/api/auth", authRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/company", companyRouter)
app.use("/api/lead", leadRouter)
app.use("/api/community", communityRouter)
app.use("/api/user", userRouter)

async function startServer() {
    try {
        await connectToMongo()

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })

    } catch (error) {
        console.error("Startup error:", error)
        process.exit(1)
    }
}

startServer()