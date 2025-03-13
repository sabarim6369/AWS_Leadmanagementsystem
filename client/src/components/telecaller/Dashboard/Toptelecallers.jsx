import React from 'react'

const Toptelecallers = ({isDarkTheme = true}) => {
  return (
    <div className={`w-full lg:w-full ${isDarkTheme ? 'bg-gray-700' : 'bg-white'} rounded-2xl p-4`}>
      <h1 className={`${isDarkTheme ? 'text-white' : 'text-gray-800'} font-bold text-xl mb-4`}>
        Top telecallers
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
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Caller Type</th>
                <th className="py-3 px-4">View Data</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-3 px-4">01</td>
                <td className="py-3 px-4">James</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-red-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-red-500 shadow-md w-max rounded text-center`}>
                    45 Min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-amber-500 text-amber-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-3 px-4">01</td>
                <td className="py-3 px-4">James</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 border-2 border-amber-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-amber-500 shadow-md w-max rounded text-center`}>
                    1 hr 34 Min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-red-500 text-red-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-3 px-4">02</td>
                <td className="py-3 px-4">Emma</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-3 px-4">
                  <span className={`border-2 border-blue-700 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-blue-700 shadow-md w-max text-center rounded px-2 py-1`}>
                    3 hr 4 Min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-green-500 text-green-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-4 px-4">02</td>
                <td className="py-4 px-4">Emma</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-4 px-4">
                  <span className={`border-2 border-pink-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-pink-500 shadow-md w-max rounded px-2 py-1`}>
                    2 hr 1 min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-blue-700 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-3 px-4">01</td>
                <td className="py-3 px-4">James</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-red-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-red-500 shadow-md w-max rounded text-center`}>
                    45 Min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-amber-500 text-amber-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-3 px-4">01</td>
                <td className="py-3 px-4">James</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 border-2 border-amber-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-amber-500 shadow-md w-max rounded text-center`}>
                    1 hr 34 Min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-red-500 text-red-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-3 px-4">02</td>
                <td className="py-3 px-4">Emma</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-3 px-4">
                  <span className={`border-2 border-blue-700 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-blue-700 shadow-md w-max text-center rounded px-2 py-1`}>
                    3 hr 4 Min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-green-500 text-green-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
              <tr className={`border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
                <td className="py-4 px-4">02</td>
                <td className="py-4 px-4">Emma</td>
                <td className="py-3 px-4">+91 86105 XXXXX</td>
                <td className="py-3 px-4">ABC Street,Dindigual</td>
                <td className="py-4 px-4">
                  <span className={`border-2 border-pink-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} text-pink-500 shadow-md w-max rounded px-2 py-1`}>
                    2 hr 1 min
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded px-2 py-1 border-2 border-blue-700 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center`}>
                    Hard
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded border-2 px-2 py-1 border-blue-500 text-blue-500 ${isDarkTheme ? 'bg-neutral-800' : 'bg-white'} shadow-md w-max rounded text-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:cursor-pointer`}>
                    View
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Toptelecallers