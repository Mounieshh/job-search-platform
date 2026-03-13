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
        source: string
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
        content: string
        images: string[]
        postedUser: string
        createdAt: string
        updatedAt: string
    }
    

}