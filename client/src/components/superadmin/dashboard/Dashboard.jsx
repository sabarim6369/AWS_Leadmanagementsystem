import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { RiAdminLine, RiShieldUserLine, RiCloseLine, RiUserAddLine } from "react-icons/ri";
import Sidebar from "../../../utils/sidebar";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../../store/themestore";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const modalVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

export default function SuperAdminDashboard() {
  const [adminData, setAdminData] = useState({ name: "", email: "", password: "" });
  const [superAdminData, setSuperAdminData] = useState({ name: "", email: "", password: "" });
  const [showModal, setShowModal] = useState(null);
  const [username, setUsername] = useState("");
  const [superadminid, setSuperadminid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkTheme } = useThemeStore();

  useEffect(() => {
    const superadmindetails = JSON.parse(localStorage.getItem("superadmindetails"));
    if (superadmindetails) {
      setUsername(superadmindetails.username);
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      if (decoded) {
        setSuperadminid(decoded.adminId);
      }
    }
  }, []);

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "admin") {
      setAdminData(prev => ({ ...prev, [name]: value }));
    } else {
      setSuperAdminData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      username: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const endpoint = type === "admin" 
        ? `${process.env.REACT_APP_API_URL}/superadmin/add`
        : `${process.env.REACT_APP_API_URL}/superadmin/addsuperadmin`;

      const payload = type === "admin" 
        ? { ...formData, superadminId: superadminid }
        : formData;

      const response = await axios.post(endpoint, payload, {
        headers: { database: "superadmin" }
      });

      if (response.status === 201) {
        toast.success(`${type === "admin" ? "Admin" : "Super Admin"} added successfully!`);
        setShowModal(null);
        type === "admin" ? setAdminData({ name: "", email: "", password: "" })
                        : setSuperAdminData({ name: "", email: "", password: "" });
      }
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>
      <div className="flex-grow p-6 overflow-auto">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1 
              className={`text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
                isDarkTheme ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'
              }`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome, {username || "SuperAdmin"}!
            </motion.h1>
            <motion.p 
              className={isDarkTheme ? "text-gray-400 text-lg" : "text-gray-600 text-lg"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your organization's administrative structure
            </motion.p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6 mb-12"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl ${
                isDarkTheme 
                  ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50' 
                  : 'bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200'
              } border shadow-xl`}
            >
              <RiShieldUserLine className={`w-12 h-12 ${isDarkTheme ? 'text-purple-400' : 'text-purple-600'} mb-4`} />
              <h3 className={`text-xl font-semibold ${isDarkTheme ? 'text-purple-300' : 'text-purple-700'} mb-2`}>
                Super Administrators
              </h3>
              <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
                Manage system-wide access and control
              </p>
              <button
                onClick={() => setShowModal("superAdmin")}
                className={`mt-4 px-6 py-2 ${
                  isDarkTheme 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-purple-500 hover:bg-purple-600'
                } rounded-lg text-white font-medium transition-all flex items-center gap-2`}
              >
                <RiUserAddLine />
                Add Super Admin
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl ${
                isDarkTheme 
                  ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50' 
                  : 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200'
              } border shadow-xl`}
            >
              <RiAdminLine className={`w-12 h-12 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'} mb-4`} />
              <h3 className={`text-xl font-semibold ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
                Administrators
              </h3>
              <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
                Manage department-level administrators
              </p>
              <button
                onClick={() => setShowModal("admin")}
                className={`mt-4 px-6 py-2 ${
                  isDarkTheme 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } rounded-lg text-white font-medium transition-all flex items-center gap-2`}
              >
                <RiUserAddLine />
                Add Admin
              </button>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={(e) => e.target === e.currentTarget && setShowModal(null)}
              >
                <motion.div
                  variants={modalVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`w-full max-w-md rounded-xl shadow-2xl p-6 relative border ${
                    isDarkTheme 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setShowModal(null)}
                    className={`absolute top-4 right-4 ${
                      isDarkTheme 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    } p-1 rounded-full transition-colors`}
                  >
                    <RiCloseLine className="w-5 h-5" />
                  </button>

                  <h2 className={`text-2xl font-bold text-center mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    Add {showModal === "admin" ? "Administrator" : "Super Administrator"}
                  </h2>

                  <form onSubmit={(e) => handleSubmit(e, showModal)} className="space-y-4">
                    <div>
                      <label className={isDarkTheme ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Name</label>
                      <input
                        className={`w-full mt-1 p-3 rounded-lg ${
                          isDarkTheme 
                            ? 'bg-gray-700/50 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        name="name"
                        placeholder="Enter name"
                        value={showModal === "admin" ? adminData.name : superAdminData.name}
                        onChange={(e) => handleChange(e, showModal)}
                        required
                      />
                    </div>

                    <div>
                      <label className={isDarkTheme ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Email</label>
                      <input
                        className={`w-full mt-1 p-3 rounded-lg ${
                          isDarkTheme 
                            ? 'bg-gray-700/50 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        value={showModal === "admin" ? adminData.email : superAdminData.email}
                        onChange={(e) => handleChange(e, showModal)}
                        required
                      />
                    </div>

                    <div>
                      <label className={isDarkTheme ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Password</label>
                      <input
                        className={`w-full mt-1 p-3 rounded-lg ${
                          isDarkTheme 
                            ? 'bg-gray-700/50 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={showModal === "admin" ? adminData.password : superAdminData.password}
                        onChange={(e) => handleChange(e, showModal)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2
                        ${showModal === "admin" 
                          ? `${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`
                          : `${isDarkTheme ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}`
                        } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <RiUserAddLine />
                          Add {showModal === "admin" ? "Administrator" : "Super Administrator"}
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkTheme ? "dark" : "light"}
      />
    </div>
  );
}