import ApplicationDrawer from "@/components/user/ApplicationDrawer";
import { useParams } from "react-router";

export default function UserApplicationPage() {
  const { jobId } = useParams()

  if (!jobId) {
    return <div>Job not found</div>
  }

  return (
    <div>
          <ApplicationDrawer jobId={jobId}/>
    </div>
  )
}
