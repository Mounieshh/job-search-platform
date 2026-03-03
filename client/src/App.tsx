import { Route, Routes } from "react-router"
import SignInPage from "./pages/sign-in"
import SignUpPage from "./pages/sign-up"
import Navbar from "./components/navbar"
import { Toaster } from "./components/ui/sonner"
import HomePage from "./pages/homepage"
import { AuthProvider } from "./context/AuthContext"


function App() {

  return (

    <AuthProvider>

      <div className="fixed">
          <Navbar/> 
      </div>
      
      
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<SignInPage/>}/>
        <Route path="/register" element={<SignUpPage/>}/>
      </Routes>

      <Toaster />

    </AuthProvider>

  )
}

export default App
