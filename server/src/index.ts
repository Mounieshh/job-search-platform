import "dotenv/config"
import express from "express"
import dns from "node:dns"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

import { connectToMongo } from "./config/mongodb.js"
import { APP_ORIGIN, PORT } from "./config/env.js"

import authRouter from "./routes/auth.route.js"
import companyRouter from "./routes/company.route.js"
import leadRouter from "./routes/lead.route.js"
import communityRouter from "./routes/community.route.js"
import userRouter from "./routes/profile.route.js"
import postJobRouter from "./routes/postjob.route.js"
import adminRouter from "./routes/admin.route.js"
import { fileURLToPath } from "node:url"
import path from "node:path"
import fs from "node:fs"

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


// logging (morgan)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("dev"))
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
    res.send("API running");
})

app.use("/api/auth", authRouter)
app.use("/api/company", companyRouter)
app.use("/api/lead", leadRouter)
app.use("/api/community", communityRouter)
app.use("/api/user", userRouter)
app.use("/api/jobs", postJobRouter)
app.use("/api/admin", adminRouter)

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