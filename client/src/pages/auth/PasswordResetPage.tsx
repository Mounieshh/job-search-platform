import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForgotPassword, useResetPassword } from "@/hooks/mutations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { MailCheck } from "lucide-react"

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
  const [emailSent, setEmailSent] = useState(false)
  const [sentTo, setSentTo] = useState("")

  const { mutateAsync: requestReset } = useForgotPassword()
  const { mutateAsync: submitReset } = useResetPassword()

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  })

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onSubmitForgot = async (values: z.infer<typeof forgotSchema>) => {
    try {
      await requestReset(values.email)
      setSentTo(values.email)
      setEmailSent(true)
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

        {emailSent ? (
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 border border-blue-100">
              <MailCheck className="size-7 text-blue-500" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-card-foreground">Check your inbox</h1>
              <p className="text-sm text-muted-foreground">
                We sent a password reset link to
              </p>
              <p className="text-sm font-medium text-foreground">{sentTo}</p>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              The link expires in 2 minutes. If you don't see it, check your spam folder.
            </p>
            <div className="pt-2 flex flex-col items-center gap-2 w-full">
              <button
                onClick={() => { setEmailSent(false); setSentTo("") }}
                className="text-sm text-blue-400 underline underline-offset-2"
              >
                Use a different email
              </button>
              <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                Back to sign in
              </Link>
            </div>
          </div>
        ) : !token ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-card-foreground">Forgot Password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email and we'll send a reset link.
              </p>
            </div>
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
                  <Link to="/auth/login" className="ml-1 underline text-blue-400">Sign In</Link>
                </p>
              </form>
            </Form>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl italic font-semibold text-card-foreground">Set New Password</h1>
              <p className="mt-1 text-sm text-muted-foreground">Enter your new password below.</p>
            </div>
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
                    <Link to="/auth/login" className="ml-1 underline text-blue-400">Sign In</Link>
                  </p>
                  <p className="text-sm font-semibold">Link expires in 2 mins</p>
                </div>
              </form>
            </Form>
          </>
        )}

      </div>
    </div>
  )
}