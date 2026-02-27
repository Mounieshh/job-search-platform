import express, { Request, Response } from "express"

const PORT = 5000
const app = express()


app.use("/", (req: Request, res: Response) => {
    res.send({
        message: "Server has been established.."
    })
})

app.listen(PORT, () => {
    console.log(`Server started running at ${PORT}`);
    
})
