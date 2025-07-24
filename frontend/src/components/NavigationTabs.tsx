import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { name: "Emergency", path: "/" },
  { name: "Map", path: "/map" },
  // { name: "Community", path: "/community" },
  { name: "Admin", path: "/admin" },
];

const NavigationTabs = () => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.path === "/"}
              className={({ isActive }) =>
                [
                  "py-4 px-1 text-sm font-medium border-b-2",
                  "no-underline", // Ensure underline is removed
                  isActive
                    ? "text-red-600 border-red-500"
                    : "text-gray-500 border-transparent hover:text-gray-700",
                ].join(" ")
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationTabs;
