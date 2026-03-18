import { zodRegisterSchema, type ZodUserFormData, type ZodUserRegisterInput } from "@/validate/user.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select"
import { useSignUp } from "@/hooks/mutations/auth"

const SignUpForm = () => {
  const navigate = useNavigate()

  const[userType, setUserType] = useState<"job_seeker" | "company_employee">("job_seeker")

  const { mutateAsync: signUp } = useSignUp()

  const form = useForm<ZodUserRegisterInput, any, ZodUserFormData>({
    resolver: zodResolver(zodRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      accountType: "job_seeker",
      companyName: "",
      position: undefined,
    }
  })

  const onSubmit = async (formData: ZodUserFormData) => {
    try {
  
      await signUp(formData)

      toast.success("Account Created Successfully")
      form.reset()
      navigate("/login")

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="border-2 border-b-0 p-2 w-full flex flex-row justify-around uppercase font-mono">
          <Link
            to="/login"
            className="text-lg font-medium text-muted-foreground hover:text-foreground pb-1 px-3 transition-colors"
          >
            Sign In
          </Link>
          <span className="text-lg font-medium text-foreground pb-1 px-3">
            Sign Up
          </span>
        </div>

        <div className="flex gap-3 rounded-none border-2 border-border bg-card">
            <Button
              type="button"
              onClick={() => {
                setUserType("job_seeker")
                form.setValue("accountType", "job_seeker")
                form.setValue("companyName", "")
                form.setValue("position", undefined)
              }}
              className={`flex-1 rounded-none cursor-pointer font-medium transition-all ${
                userType === "job_seeker" 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-transparent text-foreground hover:bg-muted-foreground/10"
              }`}
            >
              Normal
            </Button>

            <Button
              type="button"
              onClick={() => {
                setUserType("company_employee")
                form.setValue("accountType", "company_employee")
              }}
              className={`flex-1 rounded-none cursor-pointer font-medium transition-all ${
                userType === "company_employee" 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-transparent text-foreground hover:bg-muted-foreground/10"
              }`}
            >
              Business
            </Button>
        </div>

        <div className="rounded-none border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-card-foreground">Sign Up</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create your account to get started
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="rounded-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                        className="rounded-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                        className="rounded-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {userType === "company_employee" && (
                <>
                  <FormField
                  name="companyName"
                  control={form.control}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                        placeholder="Enter the company name"
                        {...field}
                        className="rounded-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />

                  <FormField
                    name="position"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-none w-full">
                              <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="software_engineer">
                              Software Engineer
                            </SelectItem>

                            <SelectItem value="frontend_developer">
                              Frontend Developer
                            </SelectItem>

                            <SelectItem value="backend_developer">
                              Backend Developer
                            </SelectItem>

                            <SelectItem value="fullstack_developer">
                              Fullstack Developer
                            </SelectItem>

                            <SelectItem value="hr_manager">
                              HR Manager
                            </SelectItem>

                            <SelectItem value="recruiter">
                              Recruiter
                            </SelectItem>

                            <SelectItem value="team_lead">
                              Team Lead
                            </SelectItem>

                            <SelectItem value="engineering_manager">
                              Engineering Manager
                            </SelectItem>

                            <SelectItem value="other">
                              Other
                            </SelectItem>
                          </SelectContent>

                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer rounded-none"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm