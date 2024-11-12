import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Dashboard";
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <Navbar />
      <div >
        
      </div>
    </div>
  );
};

export default Dashboard;
