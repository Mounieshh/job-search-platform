import { useProfile } from "@/hooks/queries/profile"
import NameModal from "./profile/NameModal"

const UserProfile = () => {
    const { data: user, isPending, error } = useProfile()


    if (isPending) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
                <div className="space-y-4">
                    <div className="h-24 animate-pulse rounded-xl border border-border bg-muted/40" />
                    <div className="h-56 animate-pulse rounded-xl border border-border bg-muted/40" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
                <div className="rounded-xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
                    Unable to load profile details right now.
                </div>
            </div>
        )
    }


  return (
        <section className="w-full flex flex-row">
            <section className="w-1/3">
                    <section>
                        <NameModal
                        name={user.name}
                        username={user.name}
                        avatarUrl=""
                        />
                    </section>
                    <section>
                        Necessary Information
                    </section>
                    <section>
                        My Resume
                    </section>
            </section>

            <section className="w-2/3">
                    <section>
                        Work Experience
                    </section>
                    <section>
                        Education
                    </section>
                    <section>
                        Profile Links
                    </section>
                    <section>
                        Skills
                    </section>
            </section>
        </section>
  )
}

export default UserProfile