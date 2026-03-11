import { Route, Routes, useLocation } from "react-router"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import Navbar from "./components/Navbar"
import { Toaster } from "./components/ui/sonner"
import HomePage from "./pages/HomePage"
import { AuthProvider } from "./context/AuthContext"
import JobUploadForm from "./components/JobForm"
import RoleNavbar from "./components/RoleNavbar"
import JobsPage from "./pages/JobsPage"
import CompanyList from "./pages/CompanyList"
import ApprovalPage from "./pages/ApprovalPage"
import ApprovePage from "./pages/ApprovedPage"
import JobDetailPage from "./pages/JobDetailPage"
import JobDetailAdmin from "./pages/JobDetailAdmin"
import LeadApprovalPage from "./pages/LeadApprovalPage"

const AUTH_ROUTES = ["/login", "/register"]

function AppLayout() {
  const { pathname } = useLocation()
  const hideNavbar = AUTH_ROUTES.includes(pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "" : "pt-22"}>
        {!hideNavbar && <RoleNavbar />}

        <div className="px-3 py-4 sm:px-6 sm:py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/postjob" element={<JobUploadForm />} />
            <Route path="/joblistings" element={<JobsPage/>}/>
            <Route path="/jobs/:companyName/:slugId" element={<JobDetailPage/>}/>
            <Route path="/admin/jobs/:companyName/:slugId" element={<JobDetailAdmin/>}/>
            <Route path="/company" element={<CompanyList/>}/>

            <Route path="/newrequest" element={<ApprovalPage/>}/>
            <Route path="/approved" element={<ApprovePage/>}/>

            <Route path="/approval-process" element={<ApprovalPage/>}/>
            <Route path="/lead-approval" element={<LeadApprovalPage/>}/>
          </Routes>
        </div>
      </main>

      <Toaster />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}

export default App
