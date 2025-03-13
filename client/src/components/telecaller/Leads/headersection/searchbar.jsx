import React from "react";

const Searchbar = ({ searchQuery, setSearchQuery, Status, setStatus,isDarkTheme }) => {
  return (
    <div className="flex items-center mb-6 gap-3">
      <div className="p-2 relative w-full max-w-[300px] md:max-w-[500px] md:ml-0">
      <i
          className={`fa fa-search text-2xl absolute left-4 top-1/2 transform -translate-y-1/2 ${
            isDarkTheme ? "text-white" : "text-black"
          }`}
        ></i>        <input
        className={`p-2 pl-12 rounded-xl w-full ${
          isDarkTheme ? "bg-gray-700 text-white" : "bg-white text-black"
        }`}          placeholder="Search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="p-2 bg-blue-500 rounded-xl">
        <select
 className={`bg-transparent outline-none px-2 py-1 ${
  isDarkTheme ? "text-black" : "text-black"
}`}          value={Status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          {/* <option value="unassigned">Unassigned</option> */}
          <option value="assigned">Pending</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="hot">Hot</option>
          <option value="fulfilled">Fulfilled</option>
        </select>
      </div>
    </div>
  );
};

export default Searchbar;
