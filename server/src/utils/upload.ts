// utils/uploadToCloudinary.ts
import cloudinary from "../config/cloudinary.js"
import streamifier from "streamifier"

export const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "community_posts" },
      (error, result) => {
        if (error) return reject(error)
        resolve(result!.secure_url)
      }
    )

    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}