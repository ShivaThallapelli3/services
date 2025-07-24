import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceGrid = ({ services, onCall, onDirections }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
  {services.map((service) => (
    <ServiceCard
      key={service.id}
      service={service}
      onCall={onCall}
      onDirections={onDirections}
    />
  ))}
</div>
  );
};

export default ServiceGrid;
