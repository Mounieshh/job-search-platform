import { zodLoginSchema, type ZodUserLoginData } from "@/validate/user.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { useSignIn } from "@/hooks/mutations/auth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SignInForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: signIn } = useSignIn();
  const [show, setShow] = useState(false);

  const form = useForm<ZodUserLoginData>({
    resolver: zodResolver(zodLoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData: ZodUserLoginData) => {
    try {
      await signIn(formData);
      toast.success("Welcome back.");
      form.reset();
      navigate("/");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center px-6 py-10 sm:py-12">
      <div
        className="w-full max-w-sm opacity-0 translate-y-3"
        style={{ animation: "auth-enter 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}
      >
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl text-foreground leading-tight">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div
              className="opacity-0 translate-y-2"
              style={{ animation: "auth-enter 0.45s cubic-bezier(0.16,1,0.3,1) 0.18s forwards" }}
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className="opacity-0 translate-y-2"
              style={{ animation: "auth-enter 0.45s cubic-bezier(0.16,1,0.3,1) 0.26s forwards" }}
            >
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                      <Link
                        to="/auth/password-reset"
                        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors duration-150"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={show ? "text" : "password"}
                          autoComplete="current-password"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          aria-label={show ? "Hide password" : "Show password"}
                          onClick={() => setShow(!show)}
                          className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r"
                        >
                          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className="opacity-0 translate-y-2"
              style={{ animation: "auth-enter 0.45s cubic-bezier(0.16,1,0.3,1) 0.34s forwards" }}
            >
              <Button
                type="submit"
                className="w-full h-11 transition-all duration-150 active:scale-[0.98]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
