import { JobDetailsLook } from "@/api/job";
import { useQuery } from "@tanstack/react-query";

export function useJobDetails(companyName: string | undefined, slugId: string | undefined){
    return useQuery({
        queryKey: ["job_details", companyName, slugId],
        queryFn: () => JobDetailsLook(companyName, slugId),
        enabled: !!companyName && !!slugId
    })
}