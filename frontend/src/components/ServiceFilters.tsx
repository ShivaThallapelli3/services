import React from "react";

const ServiceFilters = ({ selectedType, onFilterChange }) => {
  const tabs = ["all", "hospital", "fire", "police"];

  return (
   <div className="mb-4 sm:mb-6 px-2 sm:px-0">
  <div className="flex justify-center">
    <div className="flex flex-wrap sm:flex-nowrap justify-center gap-1 sm:space-x-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto max-w-full overflow-hidden">
      {tabs.map((type) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors flex-shrink-0 min-w-0 whitespace-nowrap ${
            selectedType === type
              ? "bg-gray-700 text-white"
              : "text-gray-500 hover:text-gray-700 active:bg-gray-200"
          }`}
        >
          <span className="truncate">
            {type === "all"
              ? "All Services"
              : `${type.charAt(0).toUpperCase() + type.slice(1)}${
                  type === "fire" ? " Stations" : "s"
                }`}
          </span>
        </button>
      ))}
    </div>
  </div>
</div>
  );
};

export default ServiceFilters;
