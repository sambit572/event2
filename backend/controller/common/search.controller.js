import { Service } from "../../model/vendor/service.model.js";

export const searchController = async (req, res) => {
    try {
        // --- 1. Get and Validate All Query Parameters ---
        const { q, location, minPrice, maxPrice } = req.query;

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
        const searchResults = await Service.aggregate([
            // Stage 1: Initial Filter (Location & Price) - FAST
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

            // Stage 3: Text Search Filter - SLOW (but now on a smaller dataset)
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
                    // --- Bucket 1: Matched Services ---
                    services: [
                        // Project the final shape, excluding sensitive vendor fields
                        {
                            $project: {
                                // Include all fields from the service document
                                vendorId: 1,
                                serviceCategory: 1, // This was already here, ensuring it's included
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
                                // Explicitly include only the safe vendor fields
                                vendor: {
                                    _id: "$vendor._id",
                                    fullName: "$vendor.fullName",
                                    email: "$vendor.email",
                                    phoneNumber: "$vendor.phoneNumber",
                                    profilePicture: "$vendor.profilePicture",
                                }
                            }
                        },
                        { $limit: 20 } // Add a limit to the services returned
                    ],
                    // --- Bucket 2: Matched Categories ---
                    categories: [
                        // Group to get unique category names from the filtered results
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
                        { $limit: 10 }, // Add a limit to the categories returned
                    ],
                }
            }
        ]);

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
