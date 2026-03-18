import { Toaster } from "@/components/ui/sonner"
import { Route, Routes, useLocation } from "react-router"
import SignInPage from "@/pages/SignInPage"
import SignUpPage from "@/pages/SignUpPage"
import Navbar from "@/components/Navbar"
import JobUploadForm from "@/components/JobForm"
import RoleNavbar from "@/components/RoleNavbar"
import JobsPage from "@/pages/JobsPage"
import CompanyList from "@/pages/CompanyList"
import ApprovalPage from "@/pages/ApprovalPage"
import ApprovePage from "@/pages/ApprovedPage"
import JobDetailPage from "@/pages/JobDetailUserPage"
import JobDetailAdmin from "@/pages/JobDetailAdminPage"
import CommunityPage from "@/pages/CommunityPage"
import LeadApprovalPage from "@/pages/LeadApprovalPage"
import JobDetailLeadPage from "@/pages/JobDetailLeadPage"
import ApprovedByMe from "@/components/lead/ApprovedByMe"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CompanyUsers from "@/components/admin/CompanyUsers"
import ProfilePage from "@/pages/ProfilePage"
import { useSession } from "./hooks/queries/auth"
import HeroPage from "./pages/HeroPage"

const AUTH_ROUTES = ["/login", "/register"]

function AppLayout() {
  const { pathname } = useLocation()
  const hideNavbar = AUTH_ROUTES.includes(pathname)
  const { data: user } = useSession()

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "" : "pt-26 md:flex md:min-h-[calc(100vh-3rem)] md:pt-12"}>
        { user && (
          <div>
              {!hideNavbar && <RoleNavbar />}
          </div>
        )}

        <div className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6">
          <Routes>
            {/* --COMMUNITY ROUTE-- */}
            
            <Route path="/community" element={<CommunityPage />} />

            {/* --AUTH-- */}

            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignUpPage />} />

            {/* --USER ROUTE-- */}

            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/jobs/:companyName/:slugId" element={<JobDetailPage/>}/>
            
            {/* --COMMON ROUTE-- */}

            <Route path="/" element={<HeroPage/>}/>
            <Route path="/postjob" element={<JobUploadForm />} />
            <Route path="/joblistings" element={<JobsPage/>}/>
            <Route path="/newrequest" element={<ApprovalPage/>}/>
            <Route path="/my-posts" element={<ApprovalPage/>}/>
            

            {/* --ADMIN ROUTE-- */}

            <Route path="/:companyId/users" element={<CompanyUsers/>}/>
            <Route path="/admin/jobs/:companyName/:slugId" element={<JobDetailAdmin/>}/>
            <Route path="/company" element={<CompanyList/>}/>
            <Route path="/approved" element={<ApprovePage/>}/>

            {/* --LEADS ROUTE-- */}

            <Route path="/lead-approval" element={<LeadApprovalPage/>}/>
            <Route path="/lead/:companyName/:slugId" element={<JobDetailLeadPage/>}/>
            <Route path="/lead/approved-by-me" element={<ApprovedByMe/>}/>
          </Routes>
        </div>
      </main>

      <Toaster />
    </>
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
