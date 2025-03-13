import React from 'react';
import GaugeChart from 'react-gauge-chart';

const LeadStatus = ({ isDarkTheme }) => {
  const chartStyle = {
    height: 200,
    width: '100%',
  };

  return (
    <div className={`w-full lg:w-[30%] rounded-2xl p-4 ${isDarkTheme ? 'bg-gray-700' : 'bg-white shadow-lg'}`}>
      <h1 className={`text-xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Lead Status</h1>
      <div className="mt-4">
        <GaugeChart
          id="gauge-chart1"
          style={chartStyle}
          nrOfLevels={3}
          colors={["#FF5F6D", "#FFC371", "#2ECC71"]}
          arcWidth={0.3}
          percent={0.8}
          textColor={isDarkTheme ? "#ffffff" : "#333333"}
        />
      </div>
    </div>
  );
};

export default LeadStatus;
