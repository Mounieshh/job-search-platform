import { zodRegisterSchema, type ZodUserFormData, type ZodUserRegisterInput } from "@/validate/user.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useSignUp } from "@/hooks/mutations/auth"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const SignUpForm = () => {
  const navigate = useNavigate()

  const { mutateAsync: signUp } = useSignUp()

  const form = useForm<ZodUserRegisterInput, any, ZodUserFormData>({
    resolver: zodResolver(zodRegisterSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  })

  const [show, setShow] = useState(false)

  const onSubmit = async (formData: ZodUserFormData) => {
    try {
  
      await signUp(formData)

      toast.success("Account Created Successfully")
      form.reset()
      navigate("/auth/verify-email")

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-full max-w-md">

        <div className="rounded-none p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-card-foreground italic">Sign Up</h1>
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
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={show ? "text" : "password"}
                          {...field}
                          className="rounded-none pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 cursor-pointer"
                          onClick={() => setShow(!show)}
                        >
                          {show ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer rounded-none"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating account..." : "Create account"}
              </Button>


              <footer>
                <h2>
                  Already Having an Account? 
                  <span className="ml-2 underline text-blue-400">
                    <Link to="/auth/login">
                        Signin
                    </Link>
                  </span>
                </h2>
              </footer>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm