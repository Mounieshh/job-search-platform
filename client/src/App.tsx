import { Toaster } from "@/components/ui/sonner"
import { Navigate, Route, Routes, useLocation } from "react-router"
import SignInPage from "@/pages/auth/SignInPage"
import SignUpPage from "@/pages/auth/SignUpPage"
import Navbar from "@/components/shared/Navbar"
import CompanyList from "@/components/admin/CompanyList"
import CommunityPage from "@/pages/CommunityPage"
import LeadApprovalPage from "@/pages/LeadApprovalPage"
import ApprovedByMe from "@/components/leadSystem/ApprovedByMe"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CompanyUsers from "@/components/admin/CompanyUsers"
import ProfilePage from "@/pages/ProfilePage"
import HeroPage from "./pages/HeroPage"

import { useSession } from "@/hooks/queries/auth"
import PostJobPage from "./pages/job/PostJobPage"
import TrackMyPosts from "./components/user/TrackMyPosts"
import BrowseJobsPage from "./pages/BrowseJobsPage"
import AdminRequestsPage from "./pages/adminSystem/AdminRequestsPage"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AdminApprovedPage from "./pages/adminSystem/AdminApprovedPage"
import VerifyEmailPage from "./pages/auth/VerifyEmailPage"
import BecomeLeadPage from "./pages/BecomeLeadPage"
import AdminLeadRequestsPage from "./pages/adminSystem/AdminLeadRequestsPage"
import AdminDashboardPage from "./pages/adminSystem/AdminDashboardPage"
import JobsPosted from "./pages/leadSystem/JobsPosted"


const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/verify-email"]

function AppLayout() {
  const { pathname } = useLocation()
  const hideNavbar = AUTH_ROUTES.includes(pathname)
  const { data: user, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {!hideNavbar && <Navbar />}

      <main className={`${hideNavbar ? "flex-1" : "flex-1 pt-20 md:pt-24"} overflow-y-auto`}>
        <div className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6">
          <Routes>

            {/* --COMMUNITY ROUTE-- */}
            
            <Route path="/community" element={<CommunityPage />} />

            {/* --AUTH-- */}

            <Route path="/auth/login" element={user ? <Navigate to="/community" replace /> : <SignInPage />} />
            <Route path="/auth/register" element={user ? <Navigate to="/community" replace /> : <SignUpPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

            {/* --USER ROUTE-- */}

            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/my-posts" element={<TrackMyPosts/>}/>
            <Route path="/become-a-lead" element={<BecomeLeadPage />} />
            
            {/* --COMMON ROUTE-- */}
            
            <Route path="/" element={user ? <Navigate to="/community" replace /> : <HeroPage />} />
            <Route path="/browseJobs" element={<BrowseJobsPage/>}/>
            <Route path="/browseJobs/:jobId" element={<BrowseJobsPage/>}/>


            {/* --ADMIN ROUTE-- */}

            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/requests" element={<AdminRequestsPage/>}/>
            <Route path="/admin/reviewed" element={<AdminApprovedPage/>}/>
            <Route path="/admin/lead-requests" element={<AdminLeadRequestsPage />} />

            <Route path="/admin/requests/:jobId" element={<AdminRequestsPage/>}/>
            <Route path="/admin/reviewed/:jobId" element={<AdminApprovedPage />} />

            <Route path="/:companyId/users" element={<CompanyUsers/>}/>
            <Route path="/:companyId/users/:userId" element={<CompanyUsers/>}/>
            <Route path="/company" element={<CompanyList/>}/>

            {/* --LEADS ROUTE-- */}

            <Route path="/lead-approval" element={<LeadApprovalPage />} />
            <Route path="/lead-approval/:jobId" element={<LeadApprovalPage />} />
            <Route path="/lead/approved-by-me" element={<ApprovedByMe/>}/>
            <Route path="/lead/posted" element={<JobsPosted/>}/>


            {/* --JOB ROUTE COMMON-- */}

            <Route path="/job-basic-details" element={<PostJobPage/>}>
                <Route index element={<Navigate to="?step=1" replace />} />
            </Route>


          </Routes>
        </div>
      </main>
      <Toaster />
    </div>
  )
}


const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AppLayout />

        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  )
}

export default App
