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
        <div className="min-h-screen flex flex-col items-center px-4 py-10">
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
                        <h2 className="mb-4">
                            {user && user.role === "USER" && (
                                <>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Job Request Sent (Pending Approval)</h2>
                                    </div>
                                    <p className="text-lg font-normal mb-3">You can view or manage the job in the Track My Posts Page</p>
                                    <Link to="/my-posts" className="bg-primary text-white px-3 py-2 rounded-lg">
                                        View Posted Jobs
                                    </Link>
                                </>
                            )}
                        </h2>
                    </div>
                )}
            </article>
        </div>
    );
}