import React, { useEffect, useState } from 'react';
import Sidebar from '../../../utils/sidebar';
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../../store/themestore";

const Admin = () => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const { isDarkTheme } = useThemeStore();

  const[admins,setadmins]=useState([]);
  useEffect(() => {
    const getAdmins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/superadmin/getadmins`, {
          headers: { "database": "superadmin" }
        });
        console.log(response.data)
        if (response.data && Array.isArray(response.data.admindata)) {
          setadmins(response.data.admindata);
        } else {
          console.error("Unexpected API response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching admins", error);
      }
    };
  
    getAdmins();
  }, []);

  const pauseadmin = async(adminid, status) => {
    console.log(adminid);

    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/superadmin/pause`, {
      adminId: adminid,
      status: status
    }, {
      headers: { "database": "superadmin" }
    });
    if(response.status === 200) {
      toast.success(response.data.message)
      window.location.reload()
    }
  }

  const handlePasswordChange = (adminId) => {
    console.log(`Changing password for admin ${adminId} to ${newPassword}`);
    setNewPassword('');
    setSelectedAdmin(null);
    setDropdownVisible(null);
  };

  return (
    <div className={`flex min-h-screen ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gray-200'
    }`}>
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>
      <div className="flex-grow p-6 overflow-auto">
        <h1 className={`text-3xl font-bold mb-6 ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className={`rounded-lg p-6 shadow-lg relative ${
                isDarkTheme 
                  ? 'bg-white/10 backdrop-blur-lg' 
                  : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {admin.username
                      ? admin.username.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>
                      {admin.username || "Admin"}
                    </h3>
                    <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                      {admin.status}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownVisible(
                        dropdownVisible === admin._id ? null : admin._id
                      )
                    }
                    className={isDarkTheme ? 'text-white' : 'text-gray-700'}
                  >
                    <i className="fa fa-bars text-lg"></i>
                  </button>
                  {dropdownVisible === admin._id && (
                    <div className={`absolute right-0 mt-2 w-40 shadow-lg rounded-md py-2 z-10 ${
                      isDarkTheme 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white text-gray-900'
                    }`}>
                      <button 
                        className={`block w-full text-left px-4 py-2 ${
                          isDarkTheme 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => pauseadmin(admin._id, admin.status)}
                      >
                        {admin.status === "active" ? "Pause admin" : "Make active"}
                      </button>
                      <button 
                        className={`block w-full text-left px-4 py-2 ${
                          isDarkTheme 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => pauseadmin(admin._id, "delete")}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                {admin.email || "No email provided"}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
                {[
                  { label: "Telecallers", value: admin.telecallers || 5 },
                  { label: "Total Leads", value: admin.leads || 0 },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 text-center ${
                      isDarkTheme 
                        ? 'bg-white/10' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                      {stat.label}
                    </p>
                    <p className={`text-lg font-bold ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {selectedAdmin === admin._id && (
                <div className="space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full px-3 py-2 rounded-md focus:ring focus:ring-blue-500 ${
                      isDarkTheme 
                        ? 'bg-white/5 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handlePasswordChange(admin._id)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAdmin(null);
                        setDropdownVisible(null);
                      }}
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                        isDarkTheme 
                          ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Admin;