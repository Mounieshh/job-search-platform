import { baseUrl } from "@/lib/base";


type UserProfileResponse = {
    message: string,
    user: User
}

export async function getUserProfile(){
    const response = await fetch(`${baseUrl}/api/user/profile`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the profile info")
    }

    const data: UserProfileResponse = await response.json()
    return data.user ?? null
}