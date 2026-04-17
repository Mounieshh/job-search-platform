import { useEffect, useMemo, useRef, useState } from "react"
import {
  Building2,
  Eye,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  User,
  Globe,
  Briefcase,
  Loader2,
  FileText,
  CheckCircle2
} from "lucide-react"
import { toast } from "sonner"
import { useUserProfile, useLeadRequestStatus } from "@/hooks/queries/profile"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUpdateProfile } from "@/hooks/mutations/profile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  deleteAvatarPhotoFromSupabase,
  uploadAvatarPhotoToSupabase,
  uploadResumePdfToSupabase,
} from "@/lib/cloudinaryUpload"
import {
  IdentityEditDialog,
  PersonalEditDialog,
  SkillsEditDialog,
  WorkExperienceEditDialog,
  EducationEditDialog,
  PublicLinksEditDialog,
} from "@/components/user/profile/ProfileDialogs"

function profileCompletionPercent(user: User, profile: UserProfile) {
  let n = 0
  const checks = [
    () => !!user.name?.trim(),
    () => !!user.email?.trim(),
    () => !!profile.phone?.trim(),
    () => !!profile.location?.trim(),
    () => (profile.skills?.length ?? 0) > 0,
    () => (profile.workExperience?.length ?? 0) > 0,
    () => (profile.education?.length ?? 0) > 0,
    () => !!(profile.publicLinks?.github || profile.publicLinks?.linkedin || profile.publicLinks?.portfolio),
    () => !!profile.resumeUrl,
  ]
  checks.forEach((c) => { if (c()) n += 1 })
  return Math.round((n / checks.length) * 100)
}

function formatDisplayDate(d: string | undefined) {
  if (!d) return ""
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return ""
  return x.toLocaleDateString(undefined, { year: "numeric", month: "short" })
}

function resumeLabel(url: string) {
  try {
    const seg = decodeURIComponent(url.split("/").pop() || "resume.pdf")
    return seg.split("?")[0] || "resume.pdf"
  } catch {
    return "resume.pdf"
  }
}

function completionMessage(pct: number) {
  if (pct === 100) return "Your profile is complete."
  if (pct >= 75) return "Almost there — a few more details and you're done."
  if (pct >= 50) return "Good progress. Keep filling in the gaps."
  return "Start with your skills and experience to stand out."
}

function SectionHeader({ title, onEdit, editLabel }: { title: string; onEdit?: () => void; editLabel?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      {onEdit && (
        <button
          type="button"
          aria-label={editLabel ?? `Edit ${title}`}
          onClick={onEdit}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

const UserProfile = () => {
  const { data, isPending, error } = useUserProfile()
  const { data: leadStatus } = useLeadRequestStatus()
  const { mutateAsync: saveProfile, isPending: isSavingProfile } = useUpdateProfile()

  const [identityOpen, setIdentityOpen] = useState(false)
  const [personalOpen, setPersonalOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const [eduOpen, setEduOpen] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isUploadingToCloudinary, setIsUploadingToCloudinary] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [barWidth, setBarWidth] = useState(0)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const pct = useMemo(() => {
    if (!data) return 0
    return profileCompletionPercent(data.user, data.profile)
  }, [data])

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(pct), 120)
    return () => clearTimeout(t)
  }, [pct])

  const busyResume = isUploadingToCloudinary || isSavingProfile
  const busyAvatar = isUploadingAvatar || isSavingProfile
  const currentAvatarUrl = data?.profile?.avatarUrl || ""

  const handleResumeUpload = async () => {
    if (!resumeFile) { toast.error("Choose a PDF file first."); return }
    setIsUploadingToCloudinary(true)
    try {
      const uploadedUrl = await uploadResumePdfToSupabase(resumeFile)
      await saveProfile({ resumeUrl: uploadedUrl })
      toast.success("Resume uploaded.")
      setResumeDialogOpen(false)
      setResumeFile(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not upload resume")
    } finally {
      setIsUploadingToCloudinary(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please choose a valid image file"); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image size must be 5MB or less"); return }
    setIsUploadingAvatar(true)
    try {
      const uploadedUrl = await uploadAvatarPhotoToSupabase(file)
      await saveProfile({ avatarUrl: uploadedUrl })
      if (currentAvatarUrl && currentAvatarUrl !== uploadedUrl) {
        await deleteAvatarPhotoFromSupabase(currentAvatarUrl).catch(() => null)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload avatar")
    } finally {
      setIsUploadingAvatar(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ""
    }
  }

  const handleAvatarRemove = async () => {
    if (!currentAvatarUrl) return
    setIsUploadingAvatar(true)
    try {
      await saveProfile({ avatarUrl: "" })
      await deleteAvatarPhotoFromSupabase(currentAvatarUrl).catch(() => null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove avatar")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pt-2 pb-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            <div className="h-48 animate-pulse rounded-lg border border-border bg-muted/40" />
            <div className="h-32 animate-pulse rounded-lg border border-border bg-muted/40" />
          </div>
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-lg border border-border bg-muted/40" />
            <div className="h-40 animate-pulse rounded-lg border border-border bg-muted/40" />
            <div className="h-40 animate-pulse rounded-lg border border-border bg-muted/40" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pt-2 pb-8 sm:px-6">
        <p className="text-sm text-muted-foreground">Unable to load profile details right now.</p>
      </div>
    )
  }

  const { user, profile } = data
  const handle = user.email?.split("@")[0] ?? "user"
  const isLead = user.role === "LEAD"

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-2 pb-8 sm:px-6">
      
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

        <aside aria-label="Profile sidebar">
          <div className="rounded-lg bg-card">

            <div className="bg-card pb-4">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted overflow-hidden">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={`Profile photo of ${user.name}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="size-8 text-muted-foreground" aria-hidden="true" />
                    )}
                    {busyAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                        <Loader2 className="size-4 animate-spin text-foreground" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload profile photo"
                    onChange={(e) => {
                      const selected = e.target.files?.[0]
                      if (selected) void handleAvatarUpload(selected)
                    }}
                  />
                  <button
                    type="button"
                    aria-label={profile.avatarUrl ? "Remove profile photo" : "Upload profile photo"}
                    disabled={busyAvatar}
                    onClick={() => profile.avatarUrl ? void handleAvatarRemove() : avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                  >
                    {profile.avatarUrl
                      ? <Pencil className="size-3" aria-hidden="true" />
                      : <Pencil className="size-3" aria-hidden="true" />
                    }
                  </button>
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-foreground leading-tight">{user.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">@{handle}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Edit name"
                      onClick={() => setIdentityOpen(true)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {isLead && (
                      <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 text-xs font-medium hover:bg-primary/10">
                        Lead
                      </Badge>
                    )}
                    {user.isEmailVerified && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-3 text-primary" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{completionMessage(pct)}</span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">{pct}%</span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Profile completion"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="px-1 pt-2 border-t">
              <SectionHeader title="Personal" onEdit={() => setPersonalOpen(true)} editLabel="Edit personal information" />
              <div className="space-y-2.5 pb-4 text-sm">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate" >{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{profile.phone || <span className="text-muted-foreground/50">Not set</span>}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{profile.location || <span className="text-muted-foreground/50">Not set</span>}</span>
                </div>
              </div>
            </div>

            <div className="px-1 border-t">
              <SectionHeader title="Links" onEdit={() => setLinksOpen(true)} editLabel="Edit public links" />
              <div className="space-y-2.5 pb-4 text-sm">
                <div className="flex items-center gap-2.5">
                  <Github className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {profile.publicLinks?.github ? (
                    <a href={profile.publicLinks.github} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline-offset-4 hover:underline">
                      GitHub
                    </a>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">Not set</span>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <Linkedin className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {profile.publicLinks?.linkedin ? (
                    <a href={profile.publicLinks.linkedin} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline-offset-4 hover:underline">
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">Not set</span>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {profile.publicLinks?.portfolio ? (
                    <a href={profile.publicLinks.portfolio} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline-offset-4 hover:underline">
                      Portfolio
                    </a>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">Not set</span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-1 border-t">
              <SectionHeader title="Resume" onEdit={() => setResumeDialogOpen(true)} editLabel="Upload or replace resume" />
              <div className="pb-4">
                {profile.resumeUrl ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm text-primary underline-offset-4 hover:underline"
                      >
                        {resumeLabel(profile.resumeUrl)}
                      </a>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <Button type="button" variant="ghost" size="icon" className="h-9 w-9" asChild>
                        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="View resume">
                          <Eye className="size-3.5" aria-hidden="true" />
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:bg-destructive/10"
                        disabled={isSavingProfile}
                        aria-label="Remove resume"
                        onClick={() => saveProfile({ resumeUrl: "" })}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setResumeDialogOpen(true)}
                    className="text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    Upload resume
                  </button>
                )}
              </div>
            </div>

            {isLead && leadStatus?.status === "approved" && (
              <div className="px-1">
                <SectionHeader title="Company" />
                <div className="space-y-2.5 pb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{leadStatus.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="break-all">{leadStatus.companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{leadStatus.position}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>

        <main aria-label="Profile details">
          <div className="space-y-6">

            <section aria-labelledby="skills-heading">
              <div className="mb-3 flex items-center justify-between">
                <h2 id="skills-heading" className="text-base font-semibold text-foreground">Skills</h2>
                <button
                  type="button"
                  aria-label="Edit skills"
                  onClick={() => setSkillsOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                </button>
              </div>
              {profile.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded font-normal text-sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add your skills — they help leads match you to the right roles.{" "}
                  <button type="button" onClick={() => setSkillsOpen(true)} className="text-primary underline-offset-4 hover:underline">
                    Add skills
                  </button>
                </p>
              )}
            </section>

            <div className="border-t border-border" />

            <section aria-labelledby="work-heading">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="work-heading" className="text-base font-semibold text-foreground">Work experience</h2>
                {profile.workExperience?.length ? (
                  <button
                    type="button"
                    aria-label="Edit work experience"
                    onClick={() => setWorkOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => setWorkOpen(true)}>
                    Add
                  </button>
                )}
              </div>
              {profile.workExperience?.length ? (
                <ol className="space-y-0 divide-y divide-border">
                  {profile.workExperience.map((w, i) => (
                    <li key={`${w.company}-${i}`} className="py-4 first:pt-0 last:pb-0">
                      <p className="text-base font-medium text-foreground leading-snug">{w.role}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{w.company}{w.location ? ` · ${w.location}` : ""}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDisplayDate(w.startDate)} — {w.endDate ? formatDisplayDate(w.endDate) : "Present"}
                      </p>
                      {w.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{w.description}</p>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your work history helps employers understand your background.{" "}
                  <button type="button" onClick={() => setWorkOpen(true)} className="text-primary underline-offset-4 hover:underline">
                    Add experience
                  </button>
                </p>
              )}
            </section>

            <div className="border-t border-border" />

            <section aria-labelledby="edu-heading">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="edu-heading" className="text-base font-semibold text-foreground">Education</h2>
                {profile.education?.length ? (
                  <button
                    type="button"
                    aria-label="Edit education"
                    onClick={() => setEduOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline" onClick={() => setEduOpen(true)}>
                    Add
                  </button>
                )}
              </div>
              {profile.education?.length ? (
                <ol className="space-y-0 divide-y divide-border">
                  {profile.education.map((e, i) => (
                    <li key={`${e.college}-${i}`} className="py-4 first:pt-0 last:pb-0">
                      <p className="text-base font-medium text-foreground leading-snug">{e.college}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {e.degree}{e.department ? ` · ${e.department}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDisplayDate(e.startingFrom)} — {formatDisplayDate(e.endingIn)}
                      </p>
                      {e.score && (
                        <p className="text-xs text-muted-foreground mt-0.5">GPA: {e.score}</p>
                      )}
                      {e.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{e.description}</p>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add your education history.{" "}
                  <button type="button" onClick={() => setEduOpen(true)} className="text-primary underline-offset-4 hover:underline">
                    Add education
                  </button>
                </p>
              )}
            </section>

          </div>
        </main>
      </div>

      <Dialog open={resumeDialogOpen} onOpenChange={(open) => { setResumeDialogOpen(open); if (!open) setResumeFile(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload resume</DialogTitle>
            <DialogDescription>PDF only. Uploaded directly from your browser, then saved to your profile.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground" htmlFor="resume-file-input">
              PDF file
            </label>
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,application/pdf"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            />
            {resumeFile && <p className="text-xs text-muted-foreground truncate">{resumeFile.name}</p>}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setResumeDialogOpen(false)}>Cancel</Button>
            <Button type="button" disabled={!resumeFile || busyResume} onClick={() => void handleResumeUpload()}>
              {busyResume ? "Uploading…" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <IdentityEditDialog open={identityOpen} onOpenChange={setIdentityOpen} name={user.name} />
      <PersonalEditDialog open={personalOpen} onOpenChange={setPersonalOpen} email={user.email} phone={profile.phone} location={profile.location} />
      <SkillsEditDialog open={skillsOpen} onOpenChange={setSkillsOpen} skills={profile.skills ?? []} />
      <WorkExperienceEditDialog open={workOpen} onOpenChange={setWorkOpen} workExperience={profile.workExperience ?? []} />
      <EducationEditDialog open={eduOpen} onOpenChange={setEduOpen} education={profile.education ?? []} />
      <PublicLinksEditDialog open={linksOpen} onOpenChange={setLinksOpen} publicLinks={profile.publicLinks ?? {}} />
    </div>
  )
}

export default UserProfile

