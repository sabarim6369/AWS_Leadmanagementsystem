import React from 'react';

const Toptelecallers = ({ isDarkTheme = true, toptelecallers = [] }) => {
  return (
    <div className={`w-full lg:w-full ${isDarkTheme ? 'bg-gray-700' : 'bg-white'} rounded-2xl p-4`}>
      <h1 className={`${isDarkTheme ? 'text-white' : 'text-gray-800'} font-bold text-xl mb-4`}>
        Top Telecallers
      </h1>
      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-64 scrollbar-none">
          <table className={`table-auto w-full text-left ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            <thead className={`sticky top-0 ${isDarkTheme ? 'bg-gray-700' : 'bg-white'}`}>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Total Calls</th>
                <th className="py-3 px-4">Caller Type</th>
                <th className="py-3 px-4">View Data</th>
              </tr>
            </thead>
            <tbody>
              {toptelecallers.length > 0 ? (
                toptelecallers.map((telecaller, index) => (
                  <tr key={telecaller.id || index} className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{telecaller.name}</td>
                    <td className="py-3 px-4">{telecaller.phone}</td>
                    <td className="py-3 px-4">{telecaller.address}</td>
                    <td className="py-3 px-4">
                      <span className={`rounded px-2 py-1 border-2 border-red-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-red-500 shadow-md`}>
                        {telecaller.totalCalls} Calls
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`rounded px-2 py-1 border-2 border-amber-500 text-amber-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md`}>
                        {telecaller.totalCalls > 50 ? "Hard" : "Moderate"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                        View
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-400">
                    No telecallers found
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

export default Toptelecallers;
