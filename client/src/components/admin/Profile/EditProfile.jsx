import React from 'react';

const EditProfile = ({ adminname, adminemail, setIsEditMode, isDarkTheme }) => {
  const themeClasses = isDarkTheme
    ? 'bg-[#1E1F2D] text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className={`${isDarkTheme ? 'bg-[#1E1F2D]' : 'bg-white'} rounded-2xl p-4 md:p-8 shadow-xl`}>
      <h2 className={`text-xl md:text-2xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
        Edit Profile
      </h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block mb-2 font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              defaultValue={adminname}
              className={`w-full p-3 border rounded-xl transition ${themeClasses}`}
            />
          </div>
          <div>
            <label className={`block mb-2 font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              defaultValue={adminemail}
              className={`w-full p-3 border rounded-xl transition ${themeClasses}`}
            />
          </div>
          <div>
            <label className={`block mb-2 font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Role
            </label>
            <input
              type="text"
              defaultValue="Administrator"
              className={`w-full p-3 border rounded-xl transition ${themeClasses}`}
            />
          </div>
          <div>
            <label className={`block mb-2 font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Location
            </label>
            <input
              type="text"
              defaultValue="New York, USA"
              className={`w-full p-3 border rounded-xl transition ${themeClasses}`}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setIsEditMode(false)}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl transition ${
              isDarkTheme ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-2.5 text-white rounded-xl transition shadow-lg ${
              isDarkTheme
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 shadow-indigo-500/20'
                : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-blue-500/20'
            }`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
