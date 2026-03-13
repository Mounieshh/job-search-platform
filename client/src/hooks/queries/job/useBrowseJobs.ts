
import { browseJobs } from "@/api/job";
import { useQuery } from "@tanstack/react-query";



export function useBrowseJobs(){
    return useQuery({
        queryKey: ["browse_jobs"],
        queryFn: browseJobs
    })
}