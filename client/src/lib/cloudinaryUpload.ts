import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseStorageClient: SupabaseClient | null = null

function getSupabaseStorageClient(): SupabaseClient {
  if (supabaseStorageClient) return supabaseStorageClient

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY")
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(supabaseUrl)
  } catch {
    throw new Error("Invalid VITE_SUPABASE_URL format")
  }

  if (!parsedUrl.hostname.endsWith(".supabase.co")) {
    throw new Error("VITE_SUPABASE_URL must be a valid Supabase project URL")
  }

  supabaseStorageClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return supabaseStorageClient
}


export async function uploadAvatarPhotoToSupabase(file: File): Promise<string> {
  const supabasePhotoBucket = import.meta.env.VITE_SUPABASE_IMAGE_BUCKET || "avatars"
  const supabase = getSupabaseStorageClient()


  const ext = file.name.split(".").pop()?.toLowerCase() || "png"
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = `photos/${fileName}`

  const { error: uploadError } = await supabase.storage.from(supabasePhotoBucket).upload(filePath, file, {
    upsert: false,
    contentType: file.type || "image/*"
  })

  if(uploadError){
    throw new Error(uploadError.message || "Avatar Upload Failed")
  }

  const { data } = supabase.storage.from(supabasePhotoBucket).getPublicUrl(filePath)

  if (!data?.publicUrl) {
    throw new Error("Avatar Url Fetch Failed")
  }

  return data.publicUrl
}

function extractStoragePathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  try {
    const parsed = new URL(publicUrl)
    const marker = `/storage/v1/object/public/${bucket}/`
    const idx = parsed.pathname.indexOf(marker)

    if (idx === -1) return null

    const encodedPath = parsed.pathname.slice(idx + marker.length)
    if (!encodedPath) return null

    return decodeURIComponent(encodedPath)
  } catch {
    return null
  }
}

export async function deleteAvatarPhotoFromSupabase(publicUrl: string): Promise<void> {
  const supabasePhotoBucket = import.meta.env.VITE_SUPABASE_IMAGE_BUCKET || "avatars"
  const supabase = getSupabaseStorageClient()
  const filePath = extractStoragePathFromPublicUrl(publicUrl, supabasePhotoBucket)

  if (!filePath) {
    throw new Error("Could not determine avatar path to delete")
  }

  const { error } = await supabase.storage.from(supabasePhotoBucket).remove([filePath])

  if (error) {
    throw new Error(error.message || "Avatar delete failed")
  }
}

export async function uploadResumePdfToSupabase(file: File): Promise<string> {
  const supabaseBucket = import.meta.env.VITE_SUPABASE_RESUME_BUCKET || "resumes"
  const supabase = getSupabaseStorageClient()
  
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