import React from 'react';

const colorClasses = {
  indigo: {
    dark: "from-indigo-500/10 to-indigo-600/10 border-indigo-500/20 bg-indigo-500/20 text-indigo-400",
    light: "from-indigo-100 to-indigo-200 border-indigo-300 bg-indigo-50 text-indigo-700"
  },
  purple: {
    dark: "from-purple-500/10 to-purple-600/10 border-purple-500/20 bg-purple-500/20 text-purple-400",
    light: "from-purple-100 to-purple-200 border-purple-300 bg-purple-50 text-purple-700"
  },
  emerald: {
    dark: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 bg-emerald-500/20 text-emerald-400",
    light: "from-emerald-100 to-emerald-200 border-emerald-300 bg-emerald-50 text-emerald-700"
  }
};

const StatsCard = ({ icon, title, value, change, color, isDarkTheme }) => {
  const themeClasses = colorClasses[color] || colorClasses.indigo;
  const currentTheme = isDarkTheme ? themeClasses.dark : themeClasses.light;

  return (
    <div className={`bg-gradient-to-br ${currentTheme} rounded-2xl p-4 md:p-6 border`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${isDarkTheme ? "bg-opacity-20" : "bg-opacity-40"} rounded-xl`}>
          {icon}
        </div>
        <span className={`text-sm ${isDarkTheme ? "text-gray-300" : "text-gray-700"}`}>{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className={`text-2xl md:text-3xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}>{value}</h3>
        <span className={`${isDarkTheme ? "text-emerald-400" : "text-green-600"} text-sm`}>↑ {change}%</span>
      </div>
    </div>
  );
};

export default StatsCard;
