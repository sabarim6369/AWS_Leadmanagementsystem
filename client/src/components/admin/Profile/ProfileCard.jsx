import React from 'react';

const ProfileCard = ({ adminname, adminemail, isDarkTheme }) => (
  <div className={`rounded-2xl p-4 md:p-8 shadow-xl mb-8 transition 
    ${isDarkTheme ? 'bg-gradient-to-br from-[#1E1F2D] to-[#2E2F3D]' : 'bg-gradient-to-br from-gray-100 to-gray-300'}`}>
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
      <div className="relative">
        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shadow-lg transition 
          ${isDarkTheme ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
          <span className={`text-3xl md:text-4xl font-bold transition 
            ${isDarkTheme ? 'text-white' : 'text-black'}`}>
            {adminname.charAt(0)}
          </span>
        </div>
        <div className="absolute -bottom-3 -right-3 bg-emerald-500 rounded-full p-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div className="flex-grow text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition 
              ${isDarkTheme ? 'text-white' : 'text-black'}`}>
              {adminname}
            </h2>
            <p className={`font-medium mb-1 transition 
              ${isDarkTheme ? 'text-indigo-400' : 'text-blue-500'}`}>
              Administrator
            </p>
            <p className={`transition ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              {adminemail}
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className={`text-sm transition ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Member since
              </p>
              <p className={`font-semibold transition ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                Jan 2024
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm transition ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Performance
              </p>
              <p className={`font-semibold transition ${isDarkTheme ? 'text-emerald-400' : 'text-green-500'}`}>
                92%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileCard;
