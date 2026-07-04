import { doLogout, getSession } from "@/api/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const SESSION_KEY = ["session"] as const

export function useSession(){
    return useQuery({
        queryKey: SESSION_KEY,
        queryFn: async () => {
            try {
                return await getSession()
            } catch {
                toast.error("Unable to reach the server. Running in offline mode.")
                return null
            }
        },
        staleTime: Infinity,
        retry: false,
    })
}


export function useLogout(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: doLogout,
        onSuccess: () => {
            queryClient.setQueryData(SESSION_KEY, null)
        }
    })
}