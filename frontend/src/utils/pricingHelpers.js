// src/utils/pricingHelpers.js

/**
 * Get formatted price display for a service list/card view.
 * Uses the pre-computed 'startingPrice' from the backend for catering.
 * @param {Object} service - The service object from API
 * @returns {string} Formatted price string
 */
export const getServicePriceDisplay = (service) => {
  if (!service) return "N/A";

  const pricingType = service.pricingType || "flat";

  // For Catering services
  if (pricingType === "perPlate") {
    // Use the pre-computed startingPrice from the backend
    if (service.startingPrice) {
      return `Starting from ₹${service.startingPrice}/- per plate`;
    }
    // Fallback if startingPrice is somehow missing
    return "Contact for pricing";
  }

  // For all other services (non-catering)
  else {
    if (service.minPrice && service.maxPrice) {
      return `₹${service.minPrice} - ₹${service.maxPrice}`;
    }
    // Fallback
    return "Price not available";
  }
};

/**
 * Get detailed pricing info for service detail page
 * @param {Object} service - The service object from API
 * @returns {Object} Detailed pricing information
 */
export const getDetailedPricingInfo = (service) => {
  if (!service) return null;

  const pricingType = service.pricingType || "flat";

  if (pricingType === "perPlate") {
    if (service.packages && service.packages.length > 0) {
      return {
        type: "packages",
        packages: service.packages.map((pkg) => ({
          name: pkg.packageName,
          pricePerPlate: pkg.perPlatePrice,
          minPlates: pkg.minPlates,
          maxPlates: pkg.maxPlates,
          description: pkg.description,
          priceRange: `₹${pkg.perPlatePrice * pkg.minPlates} - ₹${
            pkg.perPlatePrice * pkg.maxPlates
          }`,
        })),
      };
    } else if (service.perPlatePrice) {
      return {
        type: "simple",
        pricePerPlate: service.perPlatePrice,
        minPlates: service.minPlates,
        maxPlates: service.maxPlates,
        priceRange: `₹${service.perPlatePrice * service.minPlates} - ₹${
          service.perPlatePrice * service.maxPlates
        }`,
      };
    }
  } else {
    return {
      type: "flat",
      minPrice: service.minPrice,
      maxPrice: service.maxPrice,
      priceRange: `₹${service.minPrice} - ₹${service.maxPrice}`,
    };
  }

  return null;
};

/**
 * Validate plate count against package/base pricing limits
 * @param {number} plateCount - Number of plates entered by user
 * @param {number} minPlates - Minimum allowed plates
 * @param {number} maxPlates - Maximum allowed plates
 * @returns {Object} { isValid: boolean, errorMessage: string }
 */
export const validatePlateCount = (plateCount, minPlates, maxPlates) => {
  if (!plateCount || plateCount <= 0) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid number of plates",
    };
  }

  if (plateCount < minPlates) {
    return {
      isValid: false,
      errorMessage: `Minimum ${minPlates} plates required for this package`,
    };
  }

  if (plateCount > maxPlates) {
    return {
      isValid: false,
      errorMessage: `Maximum ${maxPlates} plates allowed for this package`,
    };
  }

  return {
    isValid: true,
    errorMessage: "",
  };
};

/**
 * Calculate total price for catering package
 * @param {number} plateCount - Number of plates
 * @param {number} pricePerPlate - Price per plate
 * @returns {number} Total price
 */
export const calculateCateringTotal = (plateCount, pricePerPlate) => {
  if (!plateCount || !pricePerPlate || plateCount <= 0 || pricePerPlate <= 0) {
    return 0;
  }

  return plateCount * pricePerPlate;
};

/**
 * Get all available pricing options for catering service (base + packages)
 * @param {Object} service - The service object
 * @returns {Array} Array of pricing options
 */
export const getCateringPricingOptions = (service) => {
  if (!service || service.pricingType !== "perPlate") {
    return [];
  }

  const options = [];

  // Add base per-plate option if available
  if (service.perPlatePrice && service.minPlates && service.maxPlates) {
    options.push({
      id: "base",
      packageName: "Standard Plate",
      description: "Base per-plate option",
      pricePerPlate: service.perPlatePrice,
      minPlates: service.minPlates,
      maxPlates: service.maxPlates,
      isBase: true,
    });
  }

  // Add packages if available
  if (service.packages && service.packages.length > 0) {
    service.packages.forEach((pkg, index) => {
      options.push({
        id: `pkg-${index}`,
        packageName: pkg.packageName,
        description: pkg.description || "",
        pricePerPlate: pkg.perPlatePrice,
        minPlates: pkg.minPlates,
        maxPlates: pkg.maxPlates,
        isBase: false,
      });
    });
  }

  return options;
};
