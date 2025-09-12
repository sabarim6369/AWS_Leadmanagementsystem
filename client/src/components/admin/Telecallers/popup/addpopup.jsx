import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import decodeToken from './../../../../utils/jwtdecode';

const Addpopup = ({ popup, setispopupopen, type, adminid, onTelecallerAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
    address: "",
    adminId: adminid 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const tokenvalidation = decodeToken(token);
      const adminId = tokenvalidation.adminId;
      const databaseName = tokenvalidation.databaseName;
      console.log(adminId, databaseName);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/add`, 
        formData,
        {
          headers: {
            "database": databaseName,
          }
        }
      );
  
      if (response.status === 401) {
        toast.warning("Fill all fields");
      } else if (response.status === 402) {
        toast.warning("Telecaller with this email already exists.");
      } else if (response.status === 200) {
        toast.success("Telecaller added successfully");
        
        // Call the refresh function to update the telecaller list
        if (onTelecallerAdded) {
          onTelecallerAdded();
        }
      }
  
      setFormData({
        username: "",
        email: "",
        password: "",
        number: "",
        address: "",
        adminId: "679877d4c689f160a3d6ca1e"
      });
  
      setTimeout(() => {
        setispopupopen(false);
      }, 2000);
    } catch (error) {
      console.error("❌ Error details:", error);
      
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    popup && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-blue-600">
            <h1 className="text-xl font-bold text-white">
              Add {type}
            </h1>
            <button
              className="text-white hover:text-gray-200 transition-colors p-1"
              onClick={() => setispopupopen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Create a password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Enter address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add {type}
                </>
              )}
            </button>
          </form>
        </div>
        <ToastContainer position="top-center" />
      </div>
    )
  );
};

export default Addpopup;
