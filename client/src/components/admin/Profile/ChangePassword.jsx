import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = ({ setIsChangePassword, adminid, isDarkTheme }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.warning("New password and confirm password do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/changepassword`,
        {
          adminid,
          currentPassword,
          newPassword,
        },
        {
          headers: { database: "superadmin" },
        }
      );

      toast.success(response.data.message || "Password changed successfully!");
      setTimeout(() => {
        setIsChangePassword(false);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const themeClasses = isDarkTheme
    ? "bg-[#1E1F2D] text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div
      className={`${
        isDarkTheme ? "bg-[#1E1F2D]" : "bg-white"
      } rounded-2xl p-4 md:p-8 shadow-xl`}
    >
      <h2
        className={`text-xl md:text-2xl font-bold mb-8 ${
          isDarkTheme ? "text-white" : "text-gray-900"
        }`}
      >
        Security Settings
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label
              className={`block mb-2 font-medium ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full p-3 border rounded-xl transition ${themeClasses}`}
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label
              className={`block mb-2 font-medium ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-3 border rounded-xl transition ${themeClasses}`}
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label
              className={`block mb-2 font-medium ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 border rounded-xl transition ${themeClasses}`}
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setIsChangePassword(false)}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl transition ${
              isDarkTheme
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-900 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-2.5 text-white rounded-xl transition shadow-lg ${
              isDarkTheme
                ? "bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 shadow-indigo-500/20"
                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-blue-500/20"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
