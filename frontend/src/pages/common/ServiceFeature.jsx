import React from 'react';

const ServiceFeature = ({ title, features, icon, image, reverse = false }) => {
  return (
    <div className={`bg-transparent shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} mb-10`}>
      <div className="md:w-1/2 w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-[250px] object-cover"
        />
      </div>
      <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-[#001f3f] flex items-center gap-1 mb-1">
          <span>{icon}</span> {title}
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-700 ">
          {features.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceFeature;
