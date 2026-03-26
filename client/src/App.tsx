import { Toaster } from "@/components/ui/sonner"
import { Navigate, Route, Routes, useLocation } from "react-router"
import SignInPage from "@/pages/auth/SignInPage"
import SignUpPage from "@/pages/auth/SignUpPage"
import Navbar from "@/components/shared/Navbar"
import CompanyList from "@/components/admin/CompanyList"
import ApprovalPage from "@/pages/ApprovalPage"
import ApprovePage from "@/pages/ApprovedPage"
import CommunityPage from "@/pages/CommunityPage"
import LeadApprovalPage from "@/pages/LeadApprovalPage"
import ApprovedByMe from "@/components/lead/ApprovedByMe"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CompanyUsers from "@/components/admin/CompanyUsers"
import ProfilePage from "@/pages/ProfilePage"
import HeroPage from "./pages/HeroPage"

import { useSession } from "@/hooks/queries/auth"
import PostJobPage from "./pages/job/PostJobPage"
import TrackMyPosts from "./components/user/TrackMyPosts"
import BrowseJobsPage from "./pages/BrowseJobsPage"

const AUTH_ROUTES = ["/auth/login", "/auth/register"]

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
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "flex-1" : "flex-1 pt-20 md:pt-24"}>
        <div className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6">
          <Routes>
            {/* --COMMUNITY ROUTE-- */}
            
            <Route path="/community" element={<CommunityPage />} />

            {/* --AUTH-- */}

            <Route path="/auth/login" element={user ? <Navigate to="/community" replace /> : <SignInPage />} />
            <Route path="/auth/register" element={user ? <Navigate to="/community" replace /> : <SignUpPage />} />

            {/* --USER ROUTE-- */}

            <Route path="/profile" element={<ProfilePage/>}/>
            
            {/* --COMMON ROUTE-- */}
            
            <Route path="/" element={user ? <Navigate to="/community" replace /> : <HeroPage />} />
            <Route path="/browseJobs" element={<BrowseJobsPage/>}/>
            <Route path="/browseJobs/:jobId" element={<BrowseJobsPage/>}/>

            <Route path="/newrequest" element={<ApprovalPage/>}/>
            

            {/* --ADMIN ROUTE-- */}

            <Route path="/:companyId/users" element={<CompanyUsers/>}/>
            <Route path="/:companyId/users/:userId" element={<CompanyUsers/>}/>
            <Route path="/company" element={<CompanyList/>}/>
            <Route path="/approved" element={<ApprovePage/>}/>

            {/* --LEADS ROUTE-- */}

            <Route path="/lead-approval" element={<LeadApprovalPage/>}/>
            <Route path="/lead/approved-by-me" element={<ApprovedByMe/>}/>


            {/* --JOB ROUTE COMMON-- */}
            <Route path="/job-basic-details" element={<PostJobPage/>}>
                <Route index element={<Navigate to="?step=1" replace />} />
            </Route>


            {/* --NEW JOB POST ROUTES-- */}
            <Route path="/my-posts" element={<TrackMyPosts/>}/>

          </Routes>
        </div>
      </main>
      {/* {!hideNavbar && <Footer/>} */}
      <Toaster />
    </div>
  )
}


const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AppLayout />
    </QueryClientProvider>
  )
}

export default App
