import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateProfile } from "@/hooks/mutations/profile"
import {
  identitySchema,
  personalSchema,
  skillsFormSchema,
  workExperienceFormSchema,
  educationFormSchema,
  publicLinksFormSchema,
  type IdentityFormData,
  type PersonalFormData,
  type SkillsFormData,
  type WorkExperienceFormData,
  type EducationFormData,
  type PublicLinksFormData,
} from "@/validate/profile.zod"

function toInputDate(d: string | undefined) {
  if (!d) return ""
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return ""
  return x.toISOString().slice(0, 10)
}

export function IdentityEditDialog({
  open,
  onOpenChange,
  name,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  name: string
}) {
  const { mutate, isPending } = useUpdateProfile()
  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    mode: "onChange",
    defaultValues: { name },
  })

  useEffect(() => {
    if (open) form.reset({ name })
  }, [open, name, form])

  const onSubmit = (data: IdentityFormData) => {
    mutate(
      { name: data.name },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit name</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-none" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function PersonalEditDialog({
  open,
  onOpenChange,
  email,
  phone,
  location,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  email: string
  phone?: string
  location?: string
}) {
  const { mutate, isPending } = useUpdateProfile()
  const form = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    mode: "onChange",
    defaultValues: { email, phone: phone ?? "", location: location ?? "" },
  })

  useEffect(() => {
    if (open) form.reset({ email, phone: phone ?? "", location: location ?? "" })
  }, [open, email, phone, location, form])

  const onSubmit = (data: PersonalFormData) => {
    mutate(
      {
        email: data.email,
        phone: data.phone || undefined,
        location: data.location || undefined,
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit personal information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-none" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function SkillsEditDialog({
  open,
  onOpenChange,
  skills,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  skills: string[]
}) {
  const { mutate, isPending } = useUpdateProfile()
  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsFormSchema),
    mode: "onChange",
    defaultValues: { skillsText: skills.join(", ") },
  })

  useEffect(() => {
    if (open) form.reset({ skillsText: skills.join(", ") })
  }, [open, skills, form])

  const onSubmit = (data: SkillsFormData) => {
    const next = data.skillsText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    mutate({ skills: next }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit skills</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="skillsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-none min-h-30"
                      placeholder="Comma or newline separated"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-none" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function WorkExperienceEditDialog({
  open,
  onOpenChange,
  workExperience,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  workExperience: WorkExperience[]
}) {
  const { mutate, isPending } = useUpdateProfile()
  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceFormSchema),
    mode: "onChange",
    defaultValues: { items: [] },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  useEffect(() => {
    if (open) {
      form.reset({
        items:
          workExperience.length > 0
            ? workExperience.map((w) => ({
                company: w.company,
                role: w.role,
                location: w.location ?? "",
                startDate: toInputDate(w.startDate),
                endDate: toInputDate(w.endDate),
                description: w.description ?? "",
              }))
            : [
                {
                  company: "",
                  role: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                },
              ],
      })
    }
  }, [open, workExperience, form])

  const onSubmit = (data: WorkExperienceFormData) => {
    const payload = data.items
      .filter((i) => i.company.trim() && i.role.trim() && i.startDate)
      .map((item) => ({
        company: item.company,
        role: item.role,
        location: item.location || undefined,
        startDate: new Date(item.startDate).toISOString(),
        endDate: item.endDate ? new Date(item.endDate).toISOString() : undefined,
        description: item.description || undefined,
      }))
    mutate({ workExperience: payload }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Work experience</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex justify-between gap-2">
                  <span className="text-sm font-medium">Entry {index + 1}</span>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="h-8 rounded-none" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.company`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.role`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.location`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.startDate`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Start</FormLabel>
                        <FormControl>
                          <Input className="rounded-none" type="date" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.endDate`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>End</FormLabel>
                        <FormControl>
                          <Input className="rounded-none" type="date" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="rounded-none min-h-20" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-none"
              onClick={() =>
                append({
                  company: "",
                  role: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              Add entry
            </Button>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-none" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function EducationEditDialog({
  open,
  onOpenChange,
  education,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  education: Education[]
}) {
  const { mutate, isPending } = useUpdateProfile()
  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    mode: "onChange",
    defaultValues: { items: [] },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  useEffect(() => {
    if (open) {
      form.reset({
        items:
          education.length > 0
            ? education.map((e) => ({
                college: e.college,
                degree: e.degree,
                department: e.department ?? "",
                startingFrom: toInputDate(e.startingFrom),
                endingIn: toInputDate(e.endingIn),
                score: e.score ?? "",
                description: e.description ?? "",
              }))
            : [
                {
                  college: "",
                  degree: "",
                  department: "",
                  startingFrom: "",
                  endingIn: "",
                  score: "",
                  description: "",
                },
              ],
      })
    }
  }, [open, education, form])

  const onSubmit = (data: EducationFormData) => {
    const payload = data.items
      .filter((i) => i.college.trim() && i.degree.trim() && i.startingFrom && i.endingIn)
      .map((item) => ({
        college: item.college,
        degree: item.degree,
        department: item.department || undefined,
        startingFrom: new Date(item.startingFrom).toISOString(),
        endingIn: new Date(item.endingIn).toISOString(),
        score: item.score || undefined,
        description: item.description || undefined,
      }))
    mutate({ education: payload }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Education</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex justify-between gap-2">
                  <span className="text-sm font-medium">Entry {index + 1}</span>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="h-8 rounded-none" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.college`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>College</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.degree`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.department`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.startingFrom`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <Input className="rounded-none" type="date" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.endingIn`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <Input className="rounded-none" type="date" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.score`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Score / GPA</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="rounded-none min-h-20" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-none"
              onClick={() =>
                append({
                  college: "",
                  degree: "",
                  department: "",
                  startingFrom: "",
                  endingIn: "",
                  score: "",
                  description: "",
                })
              }
            >
              Add entry
            </Button>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-none" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function PublicLinksEditDialog({
  open,
  onOpenChange,
  publicLinks,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  publicLinks: PublicLinks
}) {
  const { mutate, isPending } = useUpdateProfile()
  const form = useForm<PublicLinksFormData>({
    resolver: zodResolver(publicLinksFormSchema),
    mode: "onChange",
    defaultValues: {
      github: publicLinks.github ?? "",
      linkedin: publicLinks.linkedin ?? "",
      portfolio: publicLinks.portfolio ?? "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        github: publicLinks.github ?? "",
        linkedin: publicLinks.linkedin ?? "",
        portfolio: publicLinks.portfolio ?? "",
      })
    }
  }, [open, publicLinks, form])

  const onSubmit = (data: PublicLinksFormData) => {
    mutate(
      {
        publicLinks: {
          github: data.github || "",
          linkedin: data.linkedin || "",
          portfolio: data.portfolio || "",
        },
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Public links</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" placeholder="https://linkedin.com/in/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-none" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
