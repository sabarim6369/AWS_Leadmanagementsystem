import React from 'react';
import TelecallerCard from './TelecallerCard';

const Telecallers = ({ topTelecallers, isDarkTheme }) => (
  <div className={`${isDarkTheme ? "bg-[#1E1F2D]" : "bg-white border border-gray-200"} rounded-2xl p-4 md:p-8 shadow-xl`}>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h3 className={`text-xl md:text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
        Top 3 Telecallers
      </h3>
      <div className="flex gap-2 w-full sm:w-auto">
        <button className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition ${isDarkTheme ? "bg-[#2A2B3D] text-gray-400 hover:bg-[#3A3B4D]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          Filter
        </button>
        <button className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Add New
        </button>
      </div>
    </div>
    
    {topTelecallers.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {topTelecallers.map((caller) => (
          <TelecallerCard key={caller._id} caller={caller} isDarkTheme={isDarkTheme} />
        ))}
      </div>
    ) : (
      <p className={`text-center ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
        No top telecallers available
      </p>
    )}
  </div>
);

export default Telecallers;
