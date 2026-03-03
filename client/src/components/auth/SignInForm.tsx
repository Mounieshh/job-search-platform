import { zodLoginSchema, type ZodUserLoginData } from "@/validate/user.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"

const SignInForm = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const form = useForm<ZodUserLoginData>({
    resolver: zodResolver(zodLoginSchema),
    defaultValues: { email: "", password: "" }
  })

  const onSubmit = async (formData: ZodUserLoginData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      className="bg-zinc-50 border-zinc-200 focus:bg-white"
                      {...field}
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
                  <FormLabel className="text-zinc-700 text-sm">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      className="bg-zinc-50 border-zinc-200 focus:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-700 text-white cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

          </form>
        </Form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-zinc-900 font-medium hover:underline">
              Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default SignInForm