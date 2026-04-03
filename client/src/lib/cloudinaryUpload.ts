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

export async function uploadResumePdfToSupabase(file: File): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const supabaseBucket = import.meta.env.VITE_SUPABASE_RESUME_BUCKET || "resumes"

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY")
  }

  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf"
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = `applications/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(supabaseBucket)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type || "application/pdf",
    })

  if (uploadError) {
    throw new Error(uploadError.message || "Resume upload failed")
  }

  const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath)

  if (!data?.publicUrl) {
    throw new Error("Resume URL retrieval failed")
  }

  return data.publicUrl
}