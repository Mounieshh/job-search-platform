
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForgotPassword, useResetPassword } from "@/hooks/mutations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

const forgotSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
})

const resetSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters").max(50),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters").max(50),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function PasswordResetPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const { mutateAsync: requestReset } = useForgotPassword()
  const { mutateAsync: submitReset } = useResetPassword()

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onSubmitForgot = async (values: z.infer<typeof forgotSchema>) => {
    try {
      const response = await requestReset(values.email)
      toast.success(response?.message ?? "If that email exists, we've sent a reset link.")
      forgotForm.reset()
    } catch (error: any) {
      toast.error(error.message || "Unable to send reset link")
    }
  }

  const onSubmitReset = async (values: z.infer<typeof resetSchema>) => {
    if (!token) {
      toast.error("Invalid reset token")
      return
    }

    try {
      const response = await submitReset({ token, newPassword: values.newPassword })
      toast.success(response?.message ?? "Password updated successfully")
      resetForm.reset()
      navigate("/auth/login")
    } catch (error: any) {
      toast.error(error.message || "Unable to reset password")
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-none p-8">
        <div className="mb-6">
          <h1 className="text-2xl italic font-semibold text-card-foreground">
            {token ? "Set New Password" : "Forgot Password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {token
              ? "Enter your new password below."
              : "Enter your email and we'll send a reset link."}
          </p>
        </div>

        {!token ? (
          <Form {...forgotForm}>
            <form onSubmit={forgotForm.handleSubmit(onSubmitForgot)} className="space-y-4">
              <FormField
                name="email"
                control={forgotForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-none cursor-pointer" disabled={forgotForm.formState.isSubmitting}>
                {forgotForm.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>

              <p className="text-sm text-muted-foreground">
                Back to
                <Link to="/auth/login" className="ml-1 underline text-blue-400">
                  Sign In
                </Link>
              </p>
            </form>
          </Form>
        ) : (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-4">
              <FormField
                name="newPassword"
                control={resetForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={resetForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-none cursor-pointer" disabled={resetForm.formState.isSubmitting}>
                {resetForm.formState.isSubmitting ? "Updating..." : "Update Password"}
              </Button>

              <div className="flex flex-row justify-between">
                <p className="text-sm text-muted-foreground">
                    Back to
                    <Link to="/auth/login" className="ml-1 underline text-blue-400">
                    Sign In
                    </Link>
                </p>
                <p className="text-sm font-semibold">
                    Link will Expire in 2 mins
                </p>
              </div>
            </form>
          </Form>
        )}
    </div>
    </div>
  )
}
