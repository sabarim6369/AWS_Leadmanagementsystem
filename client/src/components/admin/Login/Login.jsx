import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import decodeToken from "../../../utils/jwtdecode";
import Lottie from "lottie-react";
import loginLottie from "../../../Lottie/Login.json";
export default function LoginPage({ setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const[role,setRole]=useState("");
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();

  const validateForm = () => {
    return email !== "" && password !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in both fields.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log(role);
      let database = "";

      if (role === "superadmin") {
        database = "superadmin";
      } else if (role === "admin") {
        database = "superadmin"; 
      } else if (role === "telecaller") {
        database = "superadmin";
      }

      let response;
      if (role === "telecaller") {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/telecaller/login`, 
          { email, password, role,rememberMe },
          {
            headers: { database: database }, 
          }
        );
      } 
      else if (role === "admin") {
        response = await axios.post(
         `${process.env.REACT_APP_API_URL}/admin/login`, 
          { email, password, role,rememberMe },
          {
            headers: { database: database }, 
          }
        );
      }
      else if (role === "superadmin") {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/superadmin/login`, 
          { email, password, role,rememberMe },
          {
            headers: { database: database }, 
          }
        );
      }

      console.log(response);

      if (response.status === 200) {
        console.log(response.data.admindetails)
        console.log(response.data.token);
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admindetails", JSON.stringify(response.data.admindetails));
        setUserRole(role)
        if(role==="superadmin"){
          localStorage.setItem("superadmindetails", JSON.stringify(response.data.admindetails));
          setTimeout(() => {
            navigate("/admindashboard");
          }, 2000);
        }
        else{
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
      } 
     
      else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Email does not exist.");
      } 
      else if(error.response?.status===403){
        toast.error(error.response?.data.message)
      }
      else if (error.response?.status === 400) {
        toast.error("Invalid credentials.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
      {/* Left Side: Animation/Image */}
      <div className="hidden md:flex flex-1 items-center justify-center p-8 animate-fade-in-left">
        <div className="w-full max-w-lg flex flex-col items-center">
          <Lottie
            autoplay
            loop
  animationData={loginLottie}
              style={{ width: "500px", height: "500", marginBottom: "2rem" }}
  className="drop-shadow-2xl"
          />
          <h2 className="text-4xl font-extrabold text-white mb-4 text-center">Lead Management System</h2>
          <p className="text-lg text-gray-200 text-center">Welcome to a smarter, faster, and more professional way to manage your leads. Experience the next level of productivity.</p>
        </div>
      </div>
      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-200 animate-fade-in-right">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight">Sign In</h1>
          <form className="space-y-7" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-gray-700 text-sm font-semibold mb-2">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
              >
                <option value="">Select type of user</option>
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="telecaller">Telecaller</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="form-checkbox text-purple-500 mr-2" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember me for 30 days
              </label>
              <a href="#" className="text-sm text-purple-600 hover:underline font-medium">Forgot password?</a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
      {/* Animations */}
      <style>{`
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 1s ease; }
        .animate-fade-in-right { animation: fade-in-right 1s ease; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}</style>
    </div>
  );
}
