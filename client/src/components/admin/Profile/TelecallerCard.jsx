import React from 'react';

const TelecallerCard = ({ caller, isDarkTheme }) => {
  const names = caller.username.split(' ');
  const avatarText = names.length > 1 
    ? `${names[0].charAt(0).toUpperCase()}${names[1].charAt(0).toUpperCase()}` 
    : names[0].charAt(0).toUpperCase();

  return (
    <div className={`group rounded-xl p-4 md:p-6 transition duration-300 shadow-lg ${
      isDarkTheme 
        ? "bg-gradient-to-br from-[#2A2B3D] to-[#2E2F3D] hover:from-[#2E2F3D] hover:to-[#3A3B4D]" 
        : "bg-white border border-gray-200 hover:bg-gray-100"
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg text-white font-bold 
  ${isDarkTheme ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-indigo-100 text-indigo-700"}`}>
  {avatarText}
</div>

            <div className={`absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 ${
              isDarkTheme ? "border-[#2A2B3D]" : "border-white"} ${
              caller.status === "active" ? "bg-emerald-500" : "bg-gray-500"
            }`}></div>
          </div>
          <div>
            <h4 className={`text-base md:text-lg font-semibold transition ${
              isDarkTheme ? "text-white group-hover:text-indigo-400" : "text-gray-900 group-hover:text-indigo-600"
            }`}>
              {caller.username}
            </h4>
            <p className={`text-xs md:text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
              ID: TC-{caller._id}
            </p>
          </div>
        </div>
        <button className={`${isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className={`${isDarkTheme ? "text-gray-400" : "text-gray-700"}`}>Leads</span>
          <span className={`${isDarkTheme ? "text-white" : "text-gray-900"} font-medium`}>{caller.leads}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={`${isDarkTheme ? "text-gray-400" : "text-gray-700"}`}>Total Calls</span>
          <span className={`${isDarkTheme ? "text-white" : "text-gray-900"} font-medium`}>{caller.calls}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={`${isDarkTheme ? "text-gray-400" : "text-gray-700"}`}>Pending</span>
          <span className={`${isDarkTheme ? "text-gray-300" : "text-gray-800"}`}>{caller.pending}</span>
        </div>
        <button className={`w-full py-2.5 mt-2 rounded-lg transition shadow-lg group-hover:shadow-indigo-500/40 ${
          isDarkTheme 
            ? "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 shadow-indigo-500/20"
            : "bg-indigo-500 text-white hover:bg-indigo-600"
        }`}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default TelecallerCard;
