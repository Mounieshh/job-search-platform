export {}


declare global {

    type User = {
        _id: string,
        name: string,
        email: string,
        role: string,
        isEmailVerified: boolean
    }

    type WorkExperience = {
        company: string
        role: string
        location?: string
        startDate: string
        endDate?: string
        description?: string
    }

    type Education = {
        college: string
        degree: string
        department?: string
        startingFrom: string
        endingIn: string
        score?: string
        description?: string
    }

    type PublicLinks = {
        github?: string
        linkedin?: string
        portfolio?: string
    }

    type UserProfile = {
        _id: string
        userId: string
        phone?: string
        location?: string
        resumeUrl?: string
        resumeParsedText?: string
        workExperience: WorkExperience[]
        education: Education[]
        publicLinks: PublicLinks
        skills: string[]
        createdAt?: string
        updatedAt?: string
    }

    type ProfileResponse = {
        user: User
        profile: UserProfile
    }

    // job details types
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

    //job details type with user
    type JobDataWithUser = {
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
        user : User
    }

    type JobDataforSingle = {
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
        postedUser : User
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
        isEmailVerified: boolean
    }

    type LeadRequest = {
        _id: string;
        userId?: User;
        companyName: string;
        companyEmail: string;
        position: string;
        message?: string;
        status: "pending" | "approved" | "rejected";
        adminComment?: string;
        createdAt: string;
        updatedAt: string;
    }

    type AdminCompanyDirectoryItem = {
        id: string
        name: string
        totalJobs: number
        primaryLeadId: string | null
        members: { userId: string; role: string }[]
        users: CompanyUsersList[]
    }
}