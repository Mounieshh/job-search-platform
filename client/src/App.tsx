import { Route, Routes, useLocation } from "react-router"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import Navbar from "./components/Navbar"
import { Toaster } from "./components/ui/sonner"
import { AuthProvider } from "./context/AuthContext"
import JobUploadForm from "./components/JobForm"
import RoleNavbar from "./components/RoleNavbar"
import JobsPage from "./pages/JobsPage"
import CompanyList from "./pages/CompanyList"
import ApprovalPage from "./pages/ApprovalPage"
import ApprovePage from "./pages/ApprovedPage"
import JobDetailPage from "./pages/JobDetailUserPage"
import JobDetailAdmin from "./pages/JobDetailAdminPage"
import CommunityPage from "./pages/CommunityPage"
import LeadApprovalPage from "./pages/LeadApprovalPage"
import JobDetailLeadPage from "./pages/JobDetailLeadPage"
import ApprovedByMe from "./components/lead/ApprovedByMe"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CompanyUsers from "./components/admin/CompanyUsers"

const AUTH_ROUTES = ["/login", "/register"]

function AppLayout() {
  const { pathname } = useLocation()
  const hideNavbar = AUTH_ROUTES.includes(pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "" : "pt-22 pl-48"}>
        {!hideNavbar && <RoleNavbar />}

        <div className="px-3 py-4 sm:px-6 sm:py-6">
          <Routes>
            {/* --COMMUNITY ROUTE-- */}
            <Route path="/" element={<CommunityPage />} />

            {/* --AUTH-- */}
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignUpPage />} />

            
            <Route path="/postjob" element={<JobUploadForm />} />
            <Route path="/joblistings" element={<JobsPage/>}/>
            <Route path="/jobs/:companyName/:slugId" element={<JobDetailPage/>}/>
            <Route path="/admin/jobs/:companyName/:slugId" element={<JobDetailAdmin/>}/>
            <Route path="/company" element={<CompanyList/>}/>

            <Route path="/newrequest" element={<ApprovalPage/>}/>
            <Route path="/approved" element={<ApprovePage/>}/>

            <Route path="/my-posts" element={<ApprovalPage/>}/>

            {/* --ADMIN ROUTE-- */}

            <Route path="/:companyId/users" element={<CompanyUsers/>}/>

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
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
