import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers, 
  FiTarget, 
  FiShield, 
  FiRefreshCw,
  FiLock,
  FiX,
  FiCheck,
  FiEdit2,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import Sidebar from "../../../utils/sidebar";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../../store/themestore";

const PasswordInput = memo(({ type, value, onChange, placeholder, showPassword, toggleShow, isDarkTheme }) => (
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        isDarkTheme 
          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
      }`}
    />
    <button
      type="button"
      onClick={toggleShow}
      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
        isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
    </button>
  </div>
));

PasswordInput.displayName = 'PasswordInput';

const SuperadminProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isHovering, setIsHovering] = useState(null);
  const [superadminid, setsuperadminid] = useState();
  const [activeadmin, setactiveadmins] = useState(0);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [superadmindata, setsuperadmindata] = useState({
    superadmindata: null,
    admindata: null,
    totalTelecallers: 0,
    totalleads: 0
  });
  const { isDarkTheme } = useThemeStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenvalidation = jwtDecode(token);
      console.log("Decoded Token:", tokenvalidation);
      setsuperadminid(tokenvalidation.adminId);
    }
  }, []);

  useEffect(() => {
    if (superadminid) {
      const getadmindata = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/superadmin/getsuperadmindata/${superadminid}`, {
            headers: { "database": "superadmin" }
          });
          console.log("Admin Data:", response.data);
          setsuperadmindata({
            superadmindata: response.data.superadmindata,
            admindata: response.data.admindata,
            totalTelecallers: response.data.totalTelecallers,
            totalleads: response.data.totalleads,
          });   
          const activeAdminsCount = response.data.admindata.filter(admin => admin.status === "active").length;
          setactiveadmins(activeAdminsCount);
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      };
      getadmindata();
    }
  }, [superadminid]); 

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match");
      toast.error("New password and confirm password do not match", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/superadmin/changepassword`, {
        adminid: superadminid,
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { "database": "superadmin" }
      });

      if (response.status === 200) {
        setSuccess("Password changed successfully!");
        toast.success("Password changed successfully!", { position: "top-right", autoClose: 2000 });
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        setTimeout(() => {
          setSuccess("");
          setActiveTab("profile");
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    }
  };

  const handleInputChange = (field) => (e) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const stats = [
    { label: "Total Admins", value: superadmindata?.admindata?.length || 0, icon: FiUsers },
    { label: "Active Admins", value: activeadmin, icon: FiRefreshCw },
    { label: "Total Telecallers", value: superadmindata.totalTelecallers, icon: FiTarget },
    { label: "Total Leads", value: superadmindata.totalleads, icon: FiShield },
  ];

  if (!superadmindata) {
    return (
      <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="lg:w-[250px] w-0">
          <Sidebar />
        </div>
        <div className={isDarkTheme ? "text-white" : "text-gray-900"}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gray-200'}`}>
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>

      <div className="flex-1 min-h-screen w-full p-8 overflow-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-full flex flex-col items-center"
        >
          <div className={`w-full max-w-6xl rounded-2xl shadow-xl p-8 ${
            isDarkTheme 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className="relative flex items-center justify-between mb-8">
              <h1 className={`text-3xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}>Profile</h1>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(activeTab === "profile" ? "password" : "profile")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === "password" 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : isDarkTheme 
                        ? "bg-gray-700 hover:bg-gray-600 text-white" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  <FiLock className="w-4 h-4" />
                  {activeTab === "password" ? "Back to Profile" : "Change Password"}
                </motion.button>
              </div>
            </div>

            {activeTab === "profile" ? (
              <>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative group">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg ${
                      isDarkTheme 
                        ? "bg-gray-700 text-white" 
                        : "bg-gray-200 text-gray-900"
                    }`}>
                      S
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 cursor-pointer"
                    >
                      <FiEdit2 className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                  
                  <div className="flex-1">
                    <h2 className={`text-3xl font-bold mb-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
                      {superadmindata.superadmindata?.username}
                    </h2>
                    <p className={`text-lg mb-4 ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
                      {superadmindata.superadmindata?.email}
                    </p>
                    <div className="flex gap-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm">Active</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-600 rounded-full text-sm">Full Access</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      onHoverStart={() => setIsHovering(index)}
                      onHoverEnd={() => setIsHovering(null)}
                      className={`relative rounded-xl p-6 transition-all duration-300 ${
                        isDarkTheme 
                          ? "bg-gray-700 border-gray-600 hover:border-blue-500" 
                          : "bg-white border-gray-200 hover:border-blue-500 shadow-sm"
                      }`}
                    >
                      <motion.div
                        animate={{
                          scale: isHovering === index ? 1.1 : 1,
                          color: isHovering === index ? "#60A5FA" : isDarkTheme ? "#9CA3AF" : "#4B5563"
                        }}
                        className="absolute top-4 right-4"
                      >
                        <stat.icon className={`w-6 h-6 ${isDarkTheme ? "text-white" : "text-gray-600"}`} />
                      </motion.div>
                      <p className={isDarkTheme ? "text-gray-400" : "text-gray-600" + " text-sm mb-2"}>{stat.label}</p>
                      <p className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}>{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl p-6 ${
                  isDarkTheme 
                    ? "bg-gray-700 border-gray-600" 
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <h3 className={`text-xl font-semibold mb-6 ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
                  Change Password
                </h3>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-600">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-600">
                    {success}
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <PasswordInput
                    type="old"
                    value={passwordData.oldPassword}
                    onChange={handleInputChange('oldPassword')}
                    placeholder="Enter old password"
                    showPassword={showPasswords.old}
                    toggleShow={() => togglePasswordVisibility('old')}
                    isDarkTheme={isDarkTheme}
                  />
                  <PasswordInput
                    type="new"
                    value={passwordData.newPassword}
                    onChange={handleInputChange('newPassword')}
                    placeholder="Enter new password"
                    showPassword={showPasswords.new}
                    toggleShow={() => togglePasswordVisibility('new')}
                    isDarkTheme={isDarkTheme}
                  />
                  <PasswordInput
                    type="confirm"
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm new password"
                    showPassword={showPasswords.confirm}
                    toggleShow={() => togglePasswordVisibility('confirm')}
                    isDarkTheme={isDarkTheme}
                  />
                  <div className="flex gap-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium text-white"
                    >
                      <FiCheck className="w-5 h-5" />
                      Save Changes
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("profile")}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium ${
                        isDarkTheme 
                          ? "bg-gray-600 hover:bg-gray-500 text-white" 
                          : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                      }`}
                    >
                      <FiX className="w-5 h-5" />
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SuperadminProfile;