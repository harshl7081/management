import React from 'react';

const GlobalFilter = ({ globalFilter, setGlobalFilter, selectedYear, setSelectedYear }) => {
  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 p-2 rounded-lg"
      />
        {/* <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">All Years</option> */}
        {/* Add more options for years if necessary */}
        {/* <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select> */}
    </div>
  );
};

export default GlobalFilter;
