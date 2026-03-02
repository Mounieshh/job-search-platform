import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: process.env.PORT || "5000",

    MONGO_URI: getEnv("MONGO_URI"),
    DATABASE_URL: getEnv("DATABASE_URL"),
};