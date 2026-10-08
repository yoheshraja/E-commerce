import {useState} from 'react'
import { useAuth } from "../components/AuthContext"; 
import api from './api'; 
import { useNavigate } from 'react-router-dom';

function Navbar() { 

      const { user } = useAuth(); 
      const [message, setMessage] = useState("")
      const [messageType, setMessageType] = useState("success")
      const navigate=useNavigate() 

      const showToast = (msg, type = "success") => {
        setMessage(msg)
        setMessageType(type)

        setTimeout(() => {
          setMessage("")
        }, 3000)
      }

      const logout = async () => { 
 
    try { 
 
      console.log("working") 
 
      const res = await api.post("/logout") 

      showToast(
        res?.data?.message,
        "success"
      )

      setTimeout(() => { 
        navigate("/login") 
      }, 3000) 
 
    } catch (error) { 
 
      console.log(error)

      showToast(
        error?.response?.data?.message || "Logout failed",
        "danger"
      )
 
    } 
  } 

  return ( 
    <>
    
    {/* Bootstrap Toast */}
    {message && (
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          className={`toast show text-bg-${messageType}`}
          role="alert"
        >
          <div className="d-flex">

            <div className="toast-body">
              {message}
            </div>

            <button
              type="button"
              className="btn-close me-2 m-auto"
              onClick={() => setMessage("")}
            ></button>

          </div>
        </div>
      </div>
    )}

   <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
  <div className="container-fluid"> 
    <a className="navbar-brand" href="/">E-Commerce</a> 
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> 
      <span className="navbar-toggler-icon"></span> 
    </button> 
    <div className="collapse navbar-collapse" id="navbarNav"> 
      <ul className="navbar-nav"> 
        {/* <li className="nav-item"> 
          <a className="nav-link active" aria-current="page" href="#">Home</a> 
        </li> */} 

        {user?.role==="Admin" && ( 
          <li class="nav-item"> 
            <a class="nav-link active" aria-current="page" href="/admin">
              Products
            </a> 
          </li>
        )}

        {user?.role==="Admin" && ( 
          <li class="nav-item"> 
            <a class="nav-link active" aria-current="page" href="/users">
              Users
            </a> 
          </li>
        )}

        {user ?  
            <li className="nav-item"> 
          <button 
            className="nav-link btn btn-primary btn-small" 
            onClick={logout}
          >
            Logout
          </button> 
        </li>
        :
        <li className="nav-item"> 
          <a 
            className="nav-link btn btn-primary btn-small"
            href="/login"
          >
            LogIn
          </a> 
        </li>
        } 
 
        {user && (
          <li className="nav-item"> 
            <a 
              className="nav-link btn btn-warning btn-small ms-3"
              href="/cart"
            >
              cart
            </a> 
          </li>
        )} 

      </ul> 
    </div> 
  </div> 
</nav> 
    </> 
  ) 
} 
 
export default Navbar