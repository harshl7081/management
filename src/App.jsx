import { Route, Routes } from "react-router-dom"
import ViewProject from "./Components/ViewProject"
import Not_found_404 from "./Components/Not_found_404"
import Login from "./Components/Login"
import Register from "./Components/Register.jsx"

function App() {

  return (
    <>
       <Routes> 
        <Route path="/" element={<ViewProject />} />   
        <Route path="*" element={<Not_found_404 />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />        
      </Routes>     
    </>
  )
}

export default App
