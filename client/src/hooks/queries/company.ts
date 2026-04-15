import { getCompanies, getCompanyUsers, getCredentialHistory } from "@/api/company";
import { useQuery } from "@tanstack/react-query";

export function useCompanyList(){
    return useQuery({
        queryKey: ["company_list"],
        queryFn: getCompanies
    })
}

export function useCompanyUsers(companyId: string | undefined){
    return useQuery({
        queryKey: ["company_users_list", companyId],
        queryFn: () => getCompanyUsers(companyId),
        enabled: Boolean(companyId),
    })
}

export function useCredentialHistory() {
    return useQuery({
        queryKey: ["credential_history"],
        queryFn: getCredentialHistory,
    })
}