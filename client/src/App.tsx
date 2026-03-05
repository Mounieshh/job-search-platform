import { Route, Routes, useLocation } from "react-router"
import SignInPage from "./pages/sign-in"
import SignUpPage from "./pages/sign-up"
import Navbar from "./components/navbar"
import { Toaster } from "./components/ui/sonner"
import HomePage from "./pages/homepage"
import { AuthProvider } from "./context/AuthContext"
import JobUploadForm from "./components/job-form"
import RoleNavbar from "./components/rolenavbar"
import JobsPage from "./pages/jobspage"
import CompanyList from "./pages/companylist"

const AUTH_ROUTES = ["/login", "/register"]

function AppLayout() {
  const { pathname } = useLocation()
  const hideNavbar = AUTH_ROUTES.includes(pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "" : "pt-14"}>
        {!hideNavbar && <RoleNavbar />}

        <div className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/postjob" element={<JobUploadForm />} />
            <Route path="/joblistings" element={<JobsPage/>}/>
            <Route path="/company" element={<CompanyList/>}/>
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
