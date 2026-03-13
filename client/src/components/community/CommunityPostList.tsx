import { Spinner } from "../ui/spinner"
import { useCommunityPosts } from "@/hooks/queries/useCommunityPosts"


const CommunityPostList = () => {

    const { data = [], isPending, error } = useCommunityPosts()

    if(isPending){
            return (
                <div className="min-h-screen flex justify-center items-center">
                        <Spinner className="size-7"/>
                </div>
            )
    }

     if (error) {
        return (
            <div>
                Nothing to show
            </div>
        )
     }

  return (
    <div>
        {data.length === 0 ? (
            <div>
                Nothing to show
            </div>
        ): (
            <div>
                {data.map((post) => (
                    <div key={post.id}>
                        <div>
                            {post.content}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default CommunityPostList