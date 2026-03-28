import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import axios from "axios";
import { baseUrl } from "@/lib/base";

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("pending");
                setMessage("Check your email for verification link.");
                return;
            }

            setMessage("Verifying your email...");

            try {
               
                const response = await axios.get(`${baseUrl}/api/auth/verify-email?token=${token}`, {
                    withCredentials: true
                });
                
                setStatus("success");
                setMessage(response.data.message || "Email verified successfully!");
                toast.success("Email verified successfully!");
            } catch (error: any) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Verification failed.");
                toast.error("Verification failed.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border p-8 text-center space-y-6">
                {status === "loading" && (
                    <div className="flex flex-col items-center space-y-4">
                        <Spinner className="size-10" />
                        <h1 className="text-xl font-semibold">Verifying Email</h1>
                        <p className="text-muted-foreground">{message}</p>
                    </div>
                )}

                {status === "pending" && (
                    <div className="flex flex-col items-center space-y-4">
                        <Mail className="size-16 text-primary" />
                        <h1 className="text-2xl font-bold">Verify Your Email</h1>
                        <p className="text-muted-foreground">
                            We've sent a verification link to your email. 
                            Please click the link in the email to complete your registration.
                        </p>
                        <Button asChild variant="outline" className="w-full rounded-none mt-4">
                            <Link to="/auth/login">Back to Sign In</Link>
                        </Button>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center space-y-4">
                        <CheckCircle className="size-16 text-green-500" />
                        <h1 className="text-2xl font-bold">Verification Successful!</h1>
                        <p className="text-muted-foreground">{message}</p>
                        <Button asChild className="w-full rounded-none mt-4">
                            <Link to="/auth/login">Go to Login</Link>
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center space-y-4">
                        <XCircle className="size-16 text-red-500" />
                        <h1 className="text-2xl font-bold">Verification Failed</h1>
                        <p className="text-muted-foreground">{message}</p>
                        <Button asChild variant="outline" className="w-full rounded-none mt-4">
                            <Link to="/auth/register">Try Registering Again</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
