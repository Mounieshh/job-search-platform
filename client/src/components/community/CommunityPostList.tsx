import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
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
    <div className="space-y-4">
        {data.length === 0 ? (
            <div>
                Nothing to Show
            </div>
        ): (
            <div className="space-y-4">
                {data.map((post) => (
                    <Card key={post.id} className="rounded-none">
                        <CardHeader>
                            <CardTitle>
                                {post.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm leading-6">
                                {post.content}
                            </div>
                            {post.images?.length > 0 ? (
                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {post.images.map((image, index) => (
                                        <img
                                        key={`${post.id}-image-${index}`}
                                        src={image}
                                        alt={`Post image ${index + 1}`}
                                        className="h-28 w-full rounded border object-cover"
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="flex w-full items-center justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Likes
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="max-w-44 truncate text-sm font-medium">
                                        {post.anonymousName}
                                    </div>
                                    <div>
                                        <img 
                                        src={post.anonymousAvatar} 
                                        alt="Anonymous Image" 
                                        className="size-8 rounded-full border object-cover"
                                        height={32}
                                        width={32}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                     
                    </Card>
                ))}
            </div>
        )}
    </div>
  )
}

export default CommunityPostList