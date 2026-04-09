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
import { Dialog, DialogTrigger } from "../ui/dialog";

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
      toast.success("Login Successful");
      form.reset();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-none p-8">
          <div className="mb-6">
            <h1 className="text-2xl italic font-semibold text-card-foreground">Sign In</h1>
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
                    <div className="flex flex-row justify-between">
                      <FormLabel>Password</FormLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                                <Link to="/auth/password-reset" className="text-sm underline text-blue-400">
                                        Forget Password
                                </Link>
                            </DialogTrigger>
                          </Dialog>
                    </div>

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
                {form.formState.isSubmitting ? "Signing in..." : "Login"}
              </Button>

              <footer>
                <h2>
                  Don't Have an Account?
                  <span className="ml-2 underline text-blue-400">
                    <Link to="/auth/register">Signup</Link>
                  </span>
                </h2>
              </footer>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;