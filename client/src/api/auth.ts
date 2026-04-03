import { baseUrl } from "@/lib/base";
import type { ZodUserFormData, ZodUserLoginData } from "@/validate/user.zod";

type UserSession = {
    user: UserResponse
}
export type SignInUserResponse = {
    id: string,
    name: string,
    email: string,
    role: "ADMIN" | "LEAD" | "USER"
}
type SignInResponse = {
    message: string
    user: SignInUserResponse
}


export async function getSession(){
    const response = await fetch(`${baseUrl}/api/auth/me`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        return null
    }

    const data: UserSession = await response.json()
    return data.user ?? null
}

export async function doLogout() {
    await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
    })
}

export async function signIn(formData: ZodUserLoginData){
    const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message)
    }

    return data as SignInResponse ?? null
}

export async function signUp(formData: ZodUserFormData){
    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData)
    })

    const data = await response.json()
    if(!response.ok){
        throw new Error(data.message || "Account creation failed")
    }

    return data
}


export async function resetPassword(token: string, newPassword: string){
    const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token, newPassword })
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || "Reset password failed")
    }

    return data
}

export async function forgotPassword(email: string){
    const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || "Forgot password request failed")
    }

    return data
}

export async function submitResetPassword(payload: { token: string; newPassword: string }){
    const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || "Reset password failed")
    }

    return data
}