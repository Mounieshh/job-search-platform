import { useRef, useState } from "react"
import { Pencil, User } from "lucide-react"

interface NameModalProps {
  name?: string
  username?: string
  avatarUrl?: string | null
  onEditClick?: () => void
}

const NameModal = ({ name = "Your Name", username = "@username", avatarUrl, onEditClick }: NameModalProps) => {
  const [preview, setPreview] = useState<string | null>(avatarUrl ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className="relative bg-card border border-border rounded-xl p-6">
      <button
        type="button"
        onClick={onEditClick}
        className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Pencil className="size-4" />
      </button>

      <div className="flex items-start gap-5">
        <div
          onClick={() => fileRef.current?.click()}
          className="relative h-20 w-20 shrink-0 rounded-full border border-border bg-muted flex items-center justify-center cursor-pointer overflow-hidden group"
        >
          {preview ? (
            <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <User className="size-9 text-muted-foreground" />
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Pencil className="size-4 text-white" />
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <div className="flex flex-col justify-center pt-1 space-y-0.5">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {name}
          </h2>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>
    </div>
  )
}

export default NameModal