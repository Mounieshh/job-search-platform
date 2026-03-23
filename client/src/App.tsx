import { Toaster } from "@/components/ui/sonner"
import { Route, Routes, useLocation } from "react-router"
import SignInPage from "@/pages/SignInPage"
import SignUpPage from "@/pages/SignUpPage"
import Navbar from "@/components/shared/Navbar"
import JobUploadForm from "@/components/shared/JobForm"
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
import HeroPage from "./pages/HeroPage"
import Footer from "./components/shared/Footer"

const AUTH_ROUTES = ["/auth/login", "/auth/register"]

function AppLayout() {
  const { pathname } = useLocation()
  const hideNavbar = AUTH_ROUTES.includes(pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "flex-1" : "flex-1 pt-20 md:pt-30"}>
        <div className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6">
          <Routes>
            {/* --COMMUNITY ROUTE-- */}
            
            <Route path="/community" element={<CommunityPage />} />

            {/* --AUTH-- */}

            <Route path="/auth/login" element={<SignInPage />} />
            <Route path="/auth/register" element={<SignUpPage />} />

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
      {!hideNavbar && <Footer/>}
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
