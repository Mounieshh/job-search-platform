export {}


declare global {

    type User = {
        _id: string,
        name: string,
        email: string,
        accountType: string,
        role: string
    }

    // job types
    type JobData = {
        id: string,
        roleTitle: string,
        companyName: string,
        employmentType: string,
        location: string,
        url: string,
        description: string,
        userId: string,
        companyId: string,
        draftStats: string,
        status: string,
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

}