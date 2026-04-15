import { useMemo, useState } from "react"
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
} from "lucide-react"
import { toast } from "sonner"
import { useUserProfile, useLeadRequestStatus } from "@/hooks/queries/profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { uploadResumePdfToSupabase } from "@/lib/cloudinaryUpload"
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
    () =>
      !!(profile.publicLinks?.github || profile.publicLinks?.linkedin || profile.publicLinks?.portfolio),
    () => !!profile.resumeUrl,
  ]
  checks.forEach((c) => {
    if (c()) n += 1
  })
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

  const pct = useMemo(() => {
    if (!data) return 0
    return profileCompletionPercent(data.user, data.profile)
  }, [data])

  const busyResume = isUploadingToCloudinary || isSavingProfile

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Choose a PDF file first.")
      return
    }
    setIsUploadingToCloudinary(true)
    try {
      const uploadedUrl = await uploadResumePdfToSupabase(resumeFile)
      await saveProfile({ resumeUrl: uploadedUrl })
      setResumeDialogOpen(false)
      setResumeFile(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not upload resume"
      toast.error(msg)
    } finally {
      setIsUploadingToCloudinary(false)
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl border border-border bg-muted/40" />
          <div className="h-56 animate-pulse rounded-xl border border-border bg-muted/40" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
        <div className="rounded-xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
          Unable to load profile details right now.
        </div>
      </div>
    )
  }

  const { user, profile } = data
  const handle = user.email?.split("@")[0] ?? "user"
  const isLead = user.role === "LEAD"

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                  <User className="size-9 text-muted-foreground" />
                </div>
                <div className="min-w-0 pt-1 text-left">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">@{handle}</p>
                  {isLead && (
                    <Badge className="mt-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs font-medium">
                      Lead
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => setIdentityOpen(true)}
              >
                <Pencil className="size-4" />
              </Button>
            </CardHeader>
          </Card>

          {isLead && leadStatus?.status === "approved" && (
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Company information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{leadStatus.companyName}</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="break-all">{leadStatus.companyEmail}</span>
                </div>
                <div className="flex gap-3">
                  <Briefcase className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{leadStatus.position}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="min-w-0 flex-1 text-left text-base font-semibold">Personal information</CardTitle>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={() => setPersonalOpen(true)}>
                <Pencil className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="break-all">{user.email}</span>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{profile.phone || "—"}</span>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{profile.location || "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="min-w-0 flex-1 text-left text-base font-semibold">Resume</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => setResumeDialogOpen(true)}
              >
                <Pencil className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.resumeUrl ? (
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {resumeLabel(profile.resumeUrl)}
                  </a>
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="size-4" />
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      disabled={isSavingProfile}
                      onClick={() => saveProfile({ resumeUrl: "" })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No resume uploaded.</p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full rounded-none"
                onClick={() => setResumeDialogOpen(true)}
              >
                Upload resume
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="min-w-0 flex-1 text-left text-base font-semibold">Public links</CardTitle>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={() => setLinksOpen(true)}>
                <Pencil className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Github className="size-4 text-muted-foreground" />
                {profile.publicLinks?.github ? (
                  <a href={profile.publicLinks.github} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline-offset-4 hover:underline">
                    GitHub
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="size-4 text-muted-foreground" />
                {profile.publicLinks?.linkedin ? (
                  <a href={profile.publicLinks.linkedin} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline-offset-4 hover:underline">
                    LinkedIn
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-muted-foreground" />
                {profile.publicLinks?.portfolio ? (
                  <a href={profile.publicLinks.portfolio} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline-offset-4 hover:underline">
                    Portfolio
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border shadow-sm">
            <CardContent className="py-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Profile completion</p>
                  <span className="text-sm font-semibold tabular-nums text-foreground">{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Add your missing details to strengthen your profile.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="min-w-0 flex-1 text-left text-base font-semibold">Skills</CardTitle>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={() => setSkillsOpen(true)}>
                <Pencil className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {profile.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-md font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Add skills to highlight your strengths.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="min-w-0 flex-1 text-left text-base font-semibold">Work experience</CardTitle>
              {profile.workExperience?.length ? (
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={() => setWorkOpen(true)}>
                  <Pencil className="size-4" />
                </Button>
              ) : (
                <button type="button" className="shrink-0 text-sm font-medium text-primary hover:underline" onClick={() => setWorkOpen(true)}>
                  + Add work experience
                </button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.workExperience?.length ? (
                profile.workExperience.map((w, i) => (
                  <div key={`${w.company}-${i}`} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-foreground">{w.role}</p>
                      <p className="text-sm text-muted-foreground">{w.company}</p>
                      {w.location ? <p className="text-xs text-muted-foreground">{w.location}</p> : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDisplayDate(w.startDate)} — {w.endDate ? formatDisplayDate(w.endDate) : "Present"}
                      </p>
                    </div>
                    {w.description ? <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{w.description}</p> : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Add your work experience to stand out to employers.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="min-w-0 flex-1 text-left text-base font-semibold">Education</CardTitle>
              {profile.education?.length ? (
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={() => setEduOpen(true)}>
                  <Pencil className="size-4" />
                </Button>
              ) : (
                <button type="button" className="shrink-0 text-sm font-medium text-primary hover:underline" onClick={() => setEduOpen(true)}>
                  + Add education
                </button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education?.length ? (
                profile.education.map((e, i) => (
                  <div key={`${e.college}-${i}`} className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                    <Building2 className="mt-1 size-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="font-semibold text-foreground">{e.college}</p>
                        <p className="text-sm text-muted-foreground">
                          {e.degree}
                          {e.department ? ` · ${e.department}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDisplayDate(e.startingFrom)} — {formatDisplayDate(e.endingIn)}
                          
                        </p>
                        <p>
                        <span className="text-sm ">
                        CGPA: {e.score ? ` ${e.score}` : ""} 
                        </span>
                        </p>
                      </div>
                      {e.description ? <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{e.description}</p> : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Add your education history.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={resumeDialogOpen}
        onOpenChange={(open) => {
          setResumeDialogOpen(open)
          if (!open) setResumeFile(null)
        }}
      >
        <DialogContent className="rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload resume</DialogTitle>
            <DialogDescription>PDF only. The file is uploaded to Cloudinary from your browser, then the link is saved to your profile.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-none file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground"
              onChange={(e) => {
                const f = e.target.files?.[0]
                setResumeFile(f ?? null)
              }}
            />
            {resumeFile ? <p className="text-xs text-muted-foreground truncate">{resumeFile.name}</p> : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" className="rounded-none" onClick={() => setResumeDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="rounded-none" disabled={!resumeFile || busyResume} onClick={() => void handleResumeUpload()}>
              {busyResume ? "Working…" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <IdentityEditDialog open={identityOpen} onOpenChange={setIdentityOpen} name={user.name} />
      <PersonalEditDialog
        open={personalOpen}
        onOpenChange={setPersonalOpen}
        email={user.email}
        phone={profile.phone}
        location={profile.location}
      />
      <SkillsEditDialog open={skillsOpen} onOpenChange={setSkillsOpen} skills={profile.skills ?? []} />
      <WorkExperienceEditDialog open={workOpen} onOpenChange={setWorkOpen} workExperience={profile.workExperience ?? []} />
      <EducationEditDialog open={eduOpen} onOpenChange={setEduOpen} education={profile.education ?? []} />
      <PublicLinksEditDialog open={linksOpen} onOpenChange={setLinksOpen} publicLinks={profile.publicLinks ?? {}} />
    </div>
  )
}

export default UserProfile
