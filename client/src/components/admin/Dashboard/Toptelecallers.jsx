import React from 'react';

const Toptelecallers = ({ stats, isDarkTheme }) => {
  return (
    <div className={`w-full lg:w-[70%] rounded-2xl p-4 ${isDarkTheme ? "bg-gray-700" : "bg-white shadow-lg"}`}>
      <h1 className={`font-bold text-xl mb-4 ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
        Top Telecallers
      </h1>
      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-64 scrollbar-none">
          <table className={`table-auto w-full text-left ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
            <thead className={`sticky top-0 ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}>
              <tr className={`border-b ${isDarkTheme ? "border-gray-600" : "border-gray-400"}`}>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Insights</th>
                <th className="py-3 px-4 text-center">Calls</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topTelecallers?.length > 0 ? (
                stats.topTelecallers.map((caller, index) => {
                  const callPercentage =
                    caller.totalCalls > 0
                      ? Math.round((caller.confirmedCalls / caller.totalCalls) * 100)
                      : 0;

                  return (
                    <tr key={caller.id} className={`border-b ${isDarkTheme ? "border-gray-600" : "border-gray-300"}`}>
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{caller.username}</td>
                      <td className="py-3 px-4">
                        <div className={`h-2 rounded ${isDarkTheme ? "bg-white" : "bg-gray-300"}`}>
                          <div
                            className="bg-blue-700 h-full"
                            style={{ width: `${callPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 border-2 shadow-md w-max rounded text-center ${
                            callPercentage > 75
                              ? "border-green-500 text-green-500"
                              : callPercentage > 50
                              ? "border-blue-500 text-blue-500"
                              : callPercentage > 25
                              ? "border-amber-500 text-amber-500"
                              : "border-red-500 text-red-500"
                          }`}
                        >
                          {callPercentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
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
