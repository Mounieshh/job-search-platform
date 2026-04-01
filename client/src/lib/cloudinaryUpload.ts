import { genUploader } from "uploadthing/client"

type CloudinaryErrorBody = {
  error?: { message?: string }
  secure_url?: string
}

async function uploadUnsigned(file: File, resourceType: "image" | "raw"): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  
  if (!cloudName || !uploadPreset) {
    throw new Error("Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET")
  }
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
  const body = new FormData()
  body.append("file", file)
  body.append("upload_preset", uploadPreset)
  const res = await fetch(endpoint, { method: "POST", body })
  const json = (await res.json()) as CloudinaryErrorBody
  if (!res.ok) {
    throw new Error(json.error?.message || "Upload failed")
  }
  if (!json.secure_url) {
    throw new Error("Upload failed")
  }
  return json.secure_url
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  return uploadUnsigned(file, "image")
}

export async function uploadResumePdfToCloudinary(file: File): Promise<string> {
  const uploadthingUrl = import.meta.env.VITE_UPLOADTHING_URL || "/api/uploadthing"
  const uploadthingResumeEndpoint = import.meta.env.VITE_UPLOADTHING_RESUME_ENDPOINT || "resumeUploader"

  const { uploadFiles } = genUploader({
    url: uploadthingUrl,
    package: "client",
  })

  const uploaded = await uploadFiles(uploadthingResumeEndpoint as never, {
    files: [file],
  })

  const fileData = uploaded?.[0]
  if (!fileData?.ufsUrl && !fileData?.url) {
    throw new Error("Resume upload failed")
  }

  return fileData.ufsUrl || fileData.url
}
