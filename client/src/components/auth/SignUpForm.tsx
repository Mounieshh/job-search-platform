import { zodUserSchema, type ZodUserFormData } from "@/validate/user.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const SignUpForm = () => {
    const form = useForm<ZodUserFormData>({
        resolver: zodResolver(zodUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async (formData: ZodUserFormData) => {

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            })
    
            const data = await response.json()
    
            if(!response.ok){
                throw new Error(data.message || "Account Creation Failed")
            }
    
            toast.success("Account Created Successfully")
        } catch (error: any) {
            console.error("Account creation error:", error.message);
        }
    }

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                name="name"
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
                name="email"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Email
                        </FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter your email.."
                            {...field}
                            type="email"
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
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter your password.."
                            {...field}
                            type="password"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <Button type="submit">
                    Create Account
                </Button>
            </form>
        </Form>
    </div>
  )
}

export default SignUpForm