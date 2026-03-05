import { randomUUID } from "node:crypto";
import Session from "../models/session.schema.js";


export async function createSession(userId: string){
    const sessionId = randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await Session.create({
        sessionId,
        userId,
        expiresAt
    })

    return { sessionId, expiresAt }
}