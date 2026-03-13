import { Card, CardContent, CardFooter } from "../ui/card"
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
                    <Card key={post.id} className="h-50 rounded-none">
                        <CardContent>
                            {post.content}
                        </CardContent>
                        <CardFooter>
                            {post.user?.name}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
    </div>
  )
}

export default CommunityPostList