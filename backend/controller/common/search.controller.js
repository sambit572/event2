/**
 * Search Controller
 *
 * Endpoint: GET /api/search
 *
 * Description:
 *   Performs a search for services, categories, and vendors based on a query string and optional filters.
 *   Uses an aggregation pipeline for efficient filtering, joining, and faceting of results.
 *
 * ---
 * Request Query Parameters:
 *   - q (string, required): The main search term (minimum 2 characters).
 *   - location (string, optional): Filter by location (case-insensitive, partial match).
 *   - minPrice (number, optional): Minimum price filter (services with maxPrice >= minPrice).
 *   - maxPrice (number, optional): Maximum price filter (services with minPrice <= maxPrice).
 *   - rating (number, optional): Minimum average rating filter (services with averageRating >= rating).
 *
 * Example Request:
 *   GET /api/search?q=photography&location=Delhi&minPrice=1000&maxPrice=5000&rating=4
 *
 * ---
 * Response Format:
 *   Status: 200 OK
 *   {
 *     success: true,
 *     message: "Search results for \"photography\"",
 *     results: {
 *       services: [
 *         {
 *           vendorId: ObjectId,
 *           serviceCategory: string,
 *           serviceImage: [...],
 *           maxPrice: number,
 *           minPrice: number,
 *           serviceName: string,
 *           duration: ...,
 *           stateLocationOffered: string,
 *           locationOffered: [...],
 *           serviceDes: string,
 *           available: boolean,
 *           createdAt: date,
 *           updatedAt: date,
 *           averageRating: number,
 *           vendor: {
 *             _id: ObjectId,
 *             fullName: string,
 *             email: string,
 *             phoneNumber: string,
 *             profilePicture: string
 *           }
 *         },
 *         ...
 *       ],
 *       categories: [
 *         {
 *           name: string, // category name
 *           count: number // number of services in this category
 *         },
 *         ...
 *       ]
 *     }
 *   }
 *
 * ---
 * Error Responses:
 *   - 400 Bad Request: If the 'q' parameter is missing or too short.
 *     {
 *       success: false,
 *       message: "A search query (q) of more than 2 characters is required."
 *     }
 *   - 500 Internal Server Error: For unexpected errors during aggregation or database access.
 *     {
 *       message: "Something went wrong during the search."
 *     }
 *
 * ---
 * Implementation Notes:
 *   - The controller uses an aggregation pipeline with $match, $lookup, $unwind, and $facet for efficient querying.
 *   - The main search is performed on serviceName, serviceCategory, and vendor.fullName fields (case-insensitive, partial match).
 *   - The $facet stage returns both a list of matching services (with vendor and average rating info) and a breakdown of categories.
 *   - Optional filters (location, price, rating) are applied only if provided.
 *   - Limits are applied to the number of results (20 services, 10 categories).
 *
 * This controller is designed for flexibility, performance, and clarity in search results for the frontend.
 */
import { Service } from "../../model/vendor/service.model.js";

export const searchController = async (req, res) => {
    try {
        // --- 1. Get and Validate All Query Parameters ---
        const { q, location, minPrice, maxPrice, rating } = req.query;

        // Validation updated: Only 'q' is mandatory.
        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "A search query (q) of more than 2 characters is required."
            });
        }
        const searchTerm = q.trim();

        // --- 2. Build the Initial Filtering Stage ($match) ---
        // This is the most important optimization. We filter by specific,
        // potentially indexed fields FIRST to reduce the amount of data
        // that needs to be processed by the text search.
        const initialMatchStage = {};

        // Location is now an optional filter
        if (location) {
            initialMatchStage.locationOffered = { $regex: location, $options: "i" };
        }
        if (minPrice && !isNaN(minPrice)) {
            // Find services where its maxPrice is greater than or equal to the desired minPrice
            initialMatchStage.maxPrice = { ...initialMatchStage.maxPrice, $gte: parseInt(minPrice) };
        }
        if (maxPrice && !isNaN(maxPrice)) {
            // Find services where its minPrice is less than or equal to the desired maxPrice
            initialMatchStage.minPrice = { ...initialMatchStage.minPrice, $lte: parseInt(maxPrice) };
        }

        // --- 3. The Main Aggregation Pipeline ---
        const pipeline = [
            // Stage 1: Initial Filter (Location & Price)
            { $match: initialMatchStage },

            // Stage 2: Join with Vendors
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            { $unwind: "$vendor" },

            // Stage 3: Text Search Filter
            {
                $match: {
                    $or: [
                        { serviceName: { $regex: searchTerm, $options: "i" } },
                        { serviceCategory: { $regex: searchTerm, $options: "i" } },
                        { "vendor.fullName": { $regex: searchTerm, $options: "i" } },
                    ],
                },
            },

            // Stage 4: Use $facet to create the two separate result buckets
            {
                $facet: {
                    services: [
                        // Stage 4a: Join with the CORRECT reviews collection
                        {
                            $lookup: {
                                from: "userreviews", // <-- THE FIX IS HERE
                                localField: "_id",
                                foreignField: "serviceId",
                                as: "reviews"
                            }
                        },
                        // Stage 4b: Calculate the average rating
                        {
                            $addFields: {
                                averageRating: {
                                    $ifNull: [{ $avg: "$reviews.rating" }, 0]
                                }
                            }
                        },
                        // Stage 4c: Conditionally apply the rating filter
                        ...(rating && !isNaN(rating) ? [{
                            $match: { averageRating: { $gte: parseFloat(rating) } }
                        }] : []),

                        // Stage 4d: Project the final shape
                        {
                            $project: {
                                vendorId: 1,
                                serviceCategory: 1,
                                serviceImage: 1,
                                maxPrice: 1,
                                minPrice: 1,
                                serviceName: 1,
                                duration: 1,
                                stateLocationOffered: 1,
                                locationOffered: 1,
                                serviceDes: 1,
                                available: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                averageRating: 1, // Include the new field
                                vendor: {
                                    _id: "$vendor._id",
                                    fullName: "$vendor.fullName",
                                    email: "$vendor.email",
                                    phoneNumber: "$vendor.phoneNumber",
                                    profilePicture: "$vendor.profilePicture",
                                }
                            }
                        },
                        { $limit: 20 }
                    ],
                    categories: [
                        {
                            $group: {
                                _id: "$serviceCategory",
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: "$_id",
                                count: 1,
                            },
                        },
                        { $sort: { count: -1 } },
                        { $limit: 10 },
                    ],
                }
            }
        ];
        const searchResults = await Service.aggregate(pipeline);

        // The result is an array with one object containing the facets.
        const results = searchResults[0];

        res.status(200).json({
            success: true,
            message: `Search results for "${searchTerm}"`,
            results,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong during the search."
        });
    }
};

/**
 * getSearchSuggestions
 *
 * Endpoint: GET /api/search/suggestion
 *
 * Description:
 *   Fetches autocomplete suggestions for search queries. The suggestions are derived from both the 'services' and 'vendors' collections.
 *   Uses MongoDB's aggregation pipeline and autocomplete search indexes for efficient querying.
 *
 * Request Query Parameters:
 *   - q (string, required): The search term for which suggestions are needed (minimum 2 characters).
 *
 * Response Format:
 *   Status: 200 OK
 *   {
 *     success: true,
 *     suggestions: ["suggestion1", "suggestion2", ...]
 *   }
 *
 * Error Responses:
 *   - 500 Internal Server Error: For unexpected errors during aggregation or database access.
 *     {
 *       success: false,
 *       message: "Server error fetching suggestions."
 *     }
 *
 * Implementation Notes:
 *   - The method uses MongoDB's $search stage for autocomplete functionality.
 *   - Combines results from 'services' and 'vendors' collections using $unionWith.
 *   - Limits the total number of suggestions to 8 for performance and usability.
 */
export const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        // Validate the query parameter 'q'. If it's missing or too short, return an empty suggestions list.
        if (!q || q.trim().length < 2) {
            return res.status(200).json({ success: true, suggestions: [] });
        }
        const searchTerm = q.trim();

        const suggestions = await Service.aggregate([
            // Stage 1: Search the 'services' collection using its autocomplete index.
            {
                $search: {
                    index: "searchSuggestion", // The index on the 'services' collection.
                    autocomplete: {
                        query: searchTerm, // The search term provided by the user.
                        path: "serviceName", // The field to search within the 'services' collection.
                    }
                }
            },
            // Stage 2: Combine results with a search on the 'vendors' collection.
            {
                $unionWith: {
                    coll: "vendors", // The name of the 'vendors' collection.
                    pipeline: [
                        {
                            $search: {
                                index: "vendorSuggestions", // The index on the 'vendors' collection.
                                autocomplete: {
                                    query: searchTerm, // The search term provided by the user.
                                    path: "fullName" // The field to search within the 'vendors' collection.
                                }
                            }
                        }
                    ]
                }
            },
            // Stage 3: Project all results into a consistent format.
            {
                $project: {
                    _id: 0, // Exclude the '_id' field from the results.
                    suggestion: {
                        $ifNull: ["$serviceName", "$fullName"] // Use 'serviceName' if available, otherwise use 'fullName'.
                    }
                }
            },
            // Stage 4: Limit the total number of suggestions to 8.
            {
                $limit: 8
            }
        ]);

        // Extract just the string values for a clean response.
        const suggestionList = suggestions.map(item => item.suggestion);

        res.status(200).json({ success: true, suggestions: suggestionList });

    } catch (error) {
        console.error("Error fetching search suggestions:", error);
        res.status(500).json({ success: false, message: "Server error fetching suggestions." });
    }
};