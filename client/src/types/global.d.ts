export {}


declare global {

    type User = {
        _id: string,
        name: string,
        email: string,
        accountType: string,
        role: string
    }

    type Job = {
        id: string,
        title: string,
        summary: string,
        description: string,
        companyName: string,
        location?: string,
        salary?: string,
        url?: string,
        status: string,
        rejectedReason?: string | null,
        postedBy: string,
        user: User | null
    }

    type JobDetail = {
        id: string
        title: string
        summary?: string | null
        description?: string | null
        companyName?: string | null
        location?: string | null
        salary?: string | null
        url?: string | null
        employmentType?: string | null
        status: string
        createdAt: string
        rejectedReason?: string | null
        postedBy: string
        requirements: string[]
        duties: string[]
        user: User | null
    }

    type CommunityPostItem = {
        id: string
        title: string | null
        content: string
        images: string[]
        postedUser: string
        createdAt: string
        updatedAt: string
        user: User | null,
        anonymousName: string,
        anonymousAvatar: string,
        likes: number | null,
        likedBy: string[]
    }

    type CompanyList = {
        id:string,
        name: string,
        companyUsers: number,
        totalJobs: number
    }
    
    type CompanyUsersList = User & {
        company?: {
            companyId?: string
            companyName?: string
            position?: string
        }
    }

    type UserResponse = {
        id: string,
        name: string,
        email: string,
        role: "USER" | "LEAD" | "ADMIN",
        accountType: "job_seeker" | "company_employee"
    }

    type PostJobDetail = {
        id: string
        title: string
        summary?: string | null
        description?: string | null
        companyName?: string | null
        location?: string | null
        salary?: string | null
        url?: string | null
        employmentType?: string | null
        status: string
        createdAt: string
        rejectedReason?: string | null
        postedBy: string
        requirements: string[]
        duties: string[]
    }

    type JobUser = {
        _id: string,
        name: string,
        email: string,
        role: "USER" | "ADMIN" | "LEAD"
    }

}