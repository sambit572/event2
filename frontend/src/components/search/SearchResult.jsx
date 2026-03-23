import { useNavigate } from "react-router-dom";

export const SearchResult = ({
  services = [],
  vendors = [],
  categories = [],
}) => {
  const navigate = useNavigate();

  const formatPrice = (min, max) => {
    if (!min && !max) return "Price on request";
    if (!min) return `Up to ₹${max.toLocaleString()}`;
    if (!max) return `From ₹${min.toLocaleString()}`;
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const handleServiceClick = (service) => {
  navigate(`/service/${service.serviceCategory}/${service._id}`);
};

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className="flex-1 space-y-6 ">
      {/* Services Section */}
      {services.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 ">
            Services ({services.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                onClick={() => handleServiceClick(service)}
                className=" rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    decoding="async"
                    loading="lazy"
                    src={
                      service.serviceImage[0] ||
                      "/placeholder.svg?height=200&width=300&query=service"
                    }
                    alt={service.serviceName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                      {service.serviceName}
                    </h3>
                  </div>
                  <div className="flex justify-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-10 whitespace-nowrap">
                    {service.serviceCategory}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {service.serviceDes}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black-700">
                        Price:
                      </span>
                      <span className="text-sm font-semibold text-black-600">
                        {formatPrice(service.minPrice, service.maxPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black-700">
                        Duration:
                      </span>
                      <span className="text-sm text-black-600">
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                    {typeof service.averageRating === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black-700">
                          Rating:
                        </span>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(service.averageRating)
                                    ? "text-green-700"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-black-600">
                            {service.averageRating === 0
                              ? "0"
                              : service.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-black-100">
                    <div className="flex items-center space-x-2">
                      <img
                        decoding="async"
                        loading="lazy"
                        src={
                          service.vendor?.profilePicture ||
                          "/placeholder.svg?height=32&width=32&query=vendor"
                        }
                        alt={service.vendor?.fullName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm text-black-600">
                        by {service.vendor?.fullName}
                      </span>
                    </div>
                    {service.locationOffered && (
                      <div className="mt-2">
                        <span className="text-xs text-black-500">
                          Locations:{" "}
                        </span>
                        <span className="text-xs text-black-600">
                          {Array.isArray(service.locationOffered)
                            ? service.locationOffered.slice(0, 2).join(", ") +
                              (service.locationOffered.length > 2
                                ? ` +${service.locationOffered.length - 2} more`
                                : "")
                            : service.locationOffered}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vendors Section */}
      {vendors.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black-800">
            Vendors ({vendors.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    decoding="async"
                    loading="lazy"
                    src={
                      vendor.profilePicture ||
                      "/placeholder.svg?height=80&width=80&query=vendor"
                    }
                    alt={vendor.fullName}
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {vendor.fullName}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Vendor
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Categories ({categories.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className=" rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300 text-center cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-800">
                  {category.name}
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  ({category.count})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {services.length === 0 &&
        vendors.length === 0 &&
        categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
    </div>
  );
};
