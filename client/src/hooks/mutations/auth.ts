import { signIn, signUp } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSION_KEY } from "@/hooks/queries/auth";

export function useSignIn(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            queryClient.setQueryData(SESSION_KEY, data.user)  // set session after login
        }
    })
}


export function useSignUp(){
    return useMutation({
        mutationFn: signUp,
    })
}