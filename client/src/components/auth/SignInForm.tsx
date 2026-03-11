import { zodLoginSchema, type ZodUserLoginData } from "@/validate/user.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"
import { baseUrl } from "@/lib/base"

const SignInForm = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const form = useForm<ZodUserLoginData>({
    resolver: zodResolver(zodLoginSchema),
    defaultValues: { email: "", password: "" }
  })

  const onSubmit = async (formData: ZodUserLoginData) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Login Failed")

      setUser(data.user)
      toast.success("Login Successful")
      form.reset()
      navigate("/")

    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="border-2 border-b-0 p-2 w-[36%]">
          <span className="text-sm font-medium text-foreground pb-1 px-3">
            Sign In
          </span>
          <Link
            to="/register"
            className="text-sm font-medium text-muted-foreground hover:text-foreground pb-1 px-3 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="rounded-none border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-card-foreground">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email below to login to your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <Button
                type="submit"
                className="w-full cursor-pointer rounded-none"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Login"}
              </Button>
            </form>
          </Form>

        </div>
      </div>
    </div>
  )
}

export default SignInForm