import PostJobForm from "@/components/postjob/PostJobForm";
import JobInstructions from "@/components/postjob/JobInstructions";
import { useSearchParams, useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useSession } from "@/hooks/queries/auth";

const STEPS = ["Basic Details", "Job Instructions", "Done"];

export default function JobBasicDetails() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data: user } = useSession()

    const currentStep = Number(searchParams.get("step") ?? "1");
    const jobId = searchParams.get("jobId") ?? undefined;

    const goToStep = (s: number, id?: string) => {
        if (id) {
            navigate(`?step=${s}&jobId=${id}`);
        } else {
            navigate(`?step=${s}`);
        }
    };

    const handlePostJob = () => {
        goToStep(3);
        toast.success("Job posted successfully");
    };

    return (
        <div className="h-fit flex flex-col items-center px-4 py-10">
            <div className="w-full max-w-xl mb-10">
                <div className="flex justify-between mb-2">
                    {STEPS.map((label, i) => {
                        const stepNumber = i + 1;
                        const isCompleted = currentStep > stepNumber;
                        const isActive = currentStep === stepNumber;
                        return (
                            <span
                                key={label}
                                className={`text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-foreground"
                                        : isCompleted
                                        ? "text-muted-foreground"
                                        : "text-muted-foreground/40"
                                }`}
                            >
                                {label}
                            </span>
                        );
                    })}
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <article className="w-full max-w-lg">
                {currentStep === 1 && (
                    <PostJobForm onNext={(id: string) => goToStep(2, id)} />
                )}
                {currentStep === 2 && (
                    <JobInstructions
                        jobId={jobId}
                        onBack={() => goToStep(1)}
                        onPostJob={handlePostJob}
                    />
                )}
                {currentStep === 3 && (
                    <div className="text-center py-10">
                        {user?.role === "USER" && (
                            <div className="flex flex-col items-center gap-4">
                                <h2 className="text-2xl font-bold">Job Request Sent</h2>
                                <p className="text-muted-foreground">Your job is pending approval. You can track it below.</p>
                                <Link to="/my-posts" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    View Posted Jobs
                                </Link>
                            </div>
                        )}
                        {user?.role === "LEAD" && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                                    <svg className="size-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold">Job Posted Successfully</h2>
                                <p className="text-muted-foreground text-sm">Your job is now live and pending lead review.</p>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={() => navigate("?step=1")}
                                        className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                    >
                                        Post another job
                                    </button>
                                    <Link to="/lead/posted" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        View posted jobs
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </article>
        </div>
    );
}