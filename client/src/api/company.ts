import { baseUrl } from "@/lib/base";


export type CompanyResponse = {
    result: CompanyList[]
}

export type CompanyUsersResponse = {
    users: CompanyUsersList[]
}

export async function getCompanies(){
    const response = await fetch(`${baseUrl}/api/company/list`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the company list")
    }

    const data: CompanyResponse = await response.json()
    return data.result ?? []
}

export async function getCompanyUsers(companyId: string | undefined){
    if (!companyId) {
        return []
    }

    const response = await fetch(`${baseUrl}/api/company/${companyId}/users`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the company users list")
    }

    const data: CompanyUsersResponse = await response.json()
    return data.users ?? []

}