import React from "react";
import {
  Phone,
  Navigation,
  MapPin,
  Hospital,
  Flame,
  Shield,
  Globe,
} from "lucide-react";

const icons = {
  hospital: <Hospital className="h-5 w-5 text-red-600" />,
  fire: <Flame className="h-5 w-5 text-orange-600" />,
  police: <Shield className="h-5 w-5 text-blue-600" />,
};

const bgColor = {
  hospital: "bg-red-100",
  fire: "bg-orange-100",
  police: "bg-blue-100",
};

const btnColor = {
  hospital: "bg-green-500 hover:bg-green-600",
  fire: "bg-orange-500 hover:bg-orange-600",
  police: "bg-blue-500 hover:bg-blue-600",
};

const ServiceCard = ({ service, onCall, onDirections }) => {
  // Robust extraction of service type
  const type =
    service.type ||
    (service.category?.includes("hospital")
      ? "hospital"
      : service.category?.includes("fire_station")
      ? "fire"
      : service.category?.includes("police")
      ? "police"
      : "hospital");

  // Robust extraction of phone number
  const phone =
    service.phone ||
    service?.contact?.phone ||
    service?.datasource?.raw?.phone ||
    "";

  const website = service?.website || service?.datasource?.raw?.website || "";

  const operator =
    service.operator ||
    service?.operator_details?.type ||
    service?.datasource?.raw?.["operator:type"] ||
    "";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 hover:shadow-md transition-shadow text-sm max-w-2xl w-full mx-auto flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 items-start">
  {/* Icon Section */}
  <div className={`rounded-lg p-2 ${bgColor[type]} self-start sm:self-auto flex-shrink-0`}>
    {icons[type]}
  </div>
  
  {/* Content Section */}
  <div className="flex-1 w-full sm:w-auto min-w-0">
    <div className="flex justify-between items-start mb-2">
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate pr-2">
          {service.name}
        </h3>
        <span
          className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded whitespace-nowrap ${
            service.status === "open"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {service.status === "open" ? "Open" : "Hours unknown"}
        </span>
      </div>
    </div>
    
    <p className="text-xs sm:text-sm text-gray-600 flex items-start mb-2">
      <MapPin className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
      <span className="break-words">{service.address}</span>
    </p>
    
    {operator && (
      <p className="text-xs sm:text-sm text-gray-500 mb-2">
        <span className="font-medium">Operator:</span> {operator}
      </p>
    )}
    
    {/* Phone number displayed as text */}
    {phone && (
      <p className="text-xs sm:text-sm text-gray-600 mb-3">
        <Phone className="h-3 w-3 mr-1 inline flex-shrink-0" />
        <span className="break-all">
          {phone.split(";").map((ph, i) => (
            <span key={i} className="underline text-blue-700 mr-2 hover:text-blue-800">
              {ph.trim()}
            </span>
          ))}
        </span>
      </p>
    )}
    
    {website && (
      <p className="text-xs sm:text-sm text-gray-600 mb-3">
        <Globe className="h-3 w-3 mr-1 inline flex-shrink-0" />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-700 hover:text-blue-800 break-all"
        >
          Website
        </a>
      </p>
    )}
    
    {/* Buttons */}
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
      {phone ? (
        <button
          // Demo: this alerts the phone number when clicked
          onClick={() => alert(phone)}
          className={`${btnColor[type]} w-full sm:flex-1 text-white py-2 sm:py-1.5 text-xs sm:text-sm rounded-md flex items-center justify-center hover:opacity-90 transition-opacity`}
        >
          <Phone className="h-4 w-4 mr-1" /> Call
        </button>
      ) : (
        <button
          disabled
          className="bg-gray-200 text-gray-400 w-full sm:flex-1 py-2 sm:py-1.5 text-xs sm:text-sm rounded-md flex items-center justify-center cursor-not-allowed"
        >
          <Phone className="h-4 w-4 mr-1" /> No Phone
        </button>
      )}
      
      <button
        onClick={() => onDirections(service.coordinates, service.name)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-1.5 text-xs sm:text-sm rounded-md flex items-center justify-center w-full sm:flex-1 transition-colors"
      >
        <Navigation className="h-4 w-4 mr-1" /> Directions
      </button>
    </div>
  </div>
</div>
  );
};

export default ServiceCard;
