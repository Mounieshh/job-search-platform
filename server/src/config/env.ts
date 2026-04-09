
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};


export const PORT = process.env.PORT || "5000"
export const NODE_ENV = getEnv("NODE_ENV", "development")
export const MONGO_URI = getEnv("MONGO_URI")
export const DATABASE_URL = getEnv("DATABASE_URL")
export const APP_ORIGIN = getEnv("APP_ORIGIN")

export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME")
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY")
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET")

export const SMTP_HOST = getEnv("SMTP_HOST")
export const SMTP_PORT = getEnv("SMTP_PORT", "587")
export const SMTP_USER = getEnv("SMTP_USER")
export const SMTP_PASS = getEnv("SMTP_PASS")
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
