import { Route, Routes } from "react-router"
import SignInPage from "./pages/sign-in"
import SignUpPage from "./pages/sign-up"
import Navbar from "./components/navbar"

function App() {

  return (
    <>
      
      <Navbar/>
      
      <Routes>
        <Route path="/login" element={<SignInPage/>}/>
        <Route path="/register" element={<SignUpPage/>}/>
      </Routes>

    </>
  )
}

export default App
