import "./ServiceDetailCard.css";

const ServiceCard = ({ service }) => {
  if (!service) return null;

  const {
    serviceName,
    serviceDes,
    locationOffered,
    minPrice,
    maxPrice,
    duration,
    serviceCategory,
    rating,
    reviews,
  } = service;

  const totalReviews = reviews?.length || 0;
  const averageRating = rating || 0;

  return (
    <div className="dj-service-card p-4 bg-white rounded-lg border border-gray-200">
      <h2 className="dj-title text-xl font-semibold text-gray-800 mb-2">
        {serviceName || "DJ Test Title"}
      </h2>

      <p className="serviceDetails-location text-sm text-black mb-2">
        {Array.isArray(locationOffered)
          ? locationOffered.join(", ")
          : locationOffered || "Location not provided"}
      </p>

      <p className="serviceDetails-price text-lg font-bold text-black mb-3">
        ₹
        {service.minPrice && service.maxPrice
          ? service.minPrice === service.maxPrice
            ? service.minPrice
            : `${service.minPrice} - ${service.maxPrice}`
          : "N/A"}
      </p>

      {/* ⭐ Rating and Reviews Section */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {averageRating.toFixed(1)} ★
        </span>
        <span className="text-gray-500 text-sm">({totalReviews} reviews)</span>
      </div>

      <div className="service-description">
        <p className="text-black text-sm">{serviceDes}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
