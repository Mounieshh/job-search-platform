import { zodLoginSchema, type ZodUserLoginData } from "@/validate/user.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"

const SignInForm = () => {

    const navigate = useNavigate()
    const { setUser } = useAuth()

    const form = useForm<ZodUserLoginData>({
        resolver: zodResolver(zodLoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })


    const onSubmit = async (formData: ZodUserLoginData) => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if(!response.ok){
                throw new Error(data.message || "Login Failed")
            }
            
            setUser(data.user)
            toast.success("Login Successful")

            form.reset()

            navigate("/")

        } catch (error: any) {
            toast.error(error.message);
        }
    }
  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[30%] mx-auto space-y-5"> 

                <FormField
                name="email"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter your name.."
                            {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <FormField
                name="password"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Password
                        </FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter your password.."
                            {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <Button type="submit" className="cursor-pointer" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Getting you in..." : "Login Access"}
                </Button>
            </form>
        </Form>
    </div>
  )
}

export default SignInForm