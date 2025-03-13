import React, { useEffect, useState } from 'react';
import Sidebar from '../../../utils/sidebar';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import useThemeStore from "../../store/themestore";

const Callback = () => {
  const [callbacks, setCallbacks] = useState([]);
  const [telecallerid, setTelecallerid] = useState("");
  const { isDarkTheme } = useThemeStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenvalidation = jwtDecode(token);
      setTelecallerid(tokenvalidation.telecallerId);
    }
  }, []);

  useEffect(() => {
    const fetchCallbacks = async () => {
      if (!telecallerid) return;

      try {
        const token = localStorage.getItem("token");
        const tokenvalidation = jwtDecode(token);
        const databaseName = tokenvalidation.databaseName;

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/telecaller/getTodaysCallbacks/${telecallerid}`, {
          headers: { "database": databaseName },
        });

        setCallbacks(response.data.callbacks || []);
      } catch (error) {
        console.error("Error fetching callback data:", error);
      }
    };

    fetchCallbacks();
  }, [telecallerid]);

  return (
    <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <h1 className={`text-2xl font-bold mb-4 text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Callbacks Scheduled for Today
        </h1>

        {/* Table Container with Scroll */}
        <div className={`overflow-auto max-h-[88vh] border rounded-lg shadow-lg scrollbar-hide ${
          isDarkTheme ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <table className={`w-full border-collapse ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            <thead className={`${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'} sticky top-0`}>
              <tr>
                <th className={`border p-3 text-left ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>S.No</th>
                <th className={`border p-3 text-left ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>Lead Name</th>
                <th className={`border p-3 text-left ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>Email</th>
                <th className={`border p-3 text-left ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>Mobile Number</th>
                <th className={`border p-3 text-left ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>Callback Timing</th>
              </tr>
            </thead>
            <tbody className={isDarkTheme ? 'bg-gray-800' : 'bg-white'}>
              {callbacks.length > 0 ? (
                callbacks.map((callback, index) => (
                  <tr 
                    key={callback._id} 
                    className={`border-b ${
                      isDarkTheme 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <td className={`border p-3 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>{index + 1}</td>
                    <td className={`border p-3 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                      {callback.leadId?.name || "N/A"}
                    </td>
                    <td className={`border p-3 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                      {callback.leadId?.email || "N/A"}
                    </td>
                    <td className={`border p-3 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                      {callback.leadId?.mobilenumber || "N/A"}
                    </td>
                    <td className={`border p-3 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                      {callback.callbackTime ? new Date(callback.callbackTime).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan="5" 
                    className={`text-center p-4 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    No callbacks scheduled
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Callback;