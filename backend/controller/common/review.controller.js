import Review from "../../model/common/review.model.js";
import { User } from "../../model/user/user.model.js";

// Add Review (POST)
export const addReview = async (req, res) => {
  try {
    console.log("Received review request body:", req.body); // Debug log

    const { userEmail, reviewMessage, rating, reviewType } = req.body;

    // Enhanced validation with specific error messages
    const errors = [];
    if (!userEmail) errors.push("userEmail is required");
    if (!reviewMessage) errors.push("reviewMessage is required");
    if (!rating) errors.push("rating is required");
    if (!reviewType) errors.push("reviewType is required");

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({
        success: false,
        message: errors.join(", ") + ".",
        errors: errors
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Validate reviewType
    if (!["product", "vendorService"].includes(reviewType)) {
      return res.status(400).json({
        success: false,
        message: "reviewType must be either 'product' or 'vendorService'.",
      });
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Check for duplicate review from the same email
    const existingReview = await Review.findOne({ userEmail });
    if (existingReview) {
      console.log("Duplicate review attempt from:", userEmail);
      return res.status(409).json({
        success: false,
        message: "A review already exists from this email. Only one review per email is allowed.",
      });
    }

    // Create new review
    const newReview = new Review({
      userEmail: userEmail.toLowerCase().trim(), // Normalize email
      reviewMessage: reviewMessage.trim(),
      rating: Number(rating),
      reviewType,
    });

    console.log("Creating new review:", newReview);

    await newReview.save();

    console.log("Review saved successfully for:", userEmail);

    res.status(201).json({
      success: true,
      message: "Review saved successfully!",
      data: {
        id: newReview._id,
        userEmail: newReview.userEmail,
        rating: newReview.rating,
        reviewType: newReview.reviewType,
        createdAt: newReview.createdAt
      },
    });
  } catch (err) {
    console.error("Error in addReview:", err);
    
    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed: " + validationErrors.join(", "),
        errors: validationErrors
      });
    }

    if (err.code === 11000) { // Duplicate key error
      return res.status(409).json({
        success: false,
        message: "A review from this email already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get All Reviews with Pagination (GET)
export const getAllReviews = async (req, res) => {
  try {
    console.log("Fetching reviews with query:", req.query); // Debug log

    // Pagination parameters (default: page 1, 10 per page)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page number must be greater than 0"
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100"
      });
    }

    // Optional filter by reviewType
    const reviewType = req.query.reviewType;
    const filter = {};
    
    if (reviewType) {
      if (!["product", "vendorService"].includes(reviewType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reviewType. Must be 'product' or 'vendorService'"
        });
      }
      filter.reviewType = reviewType;
    }

    console.log("Using filter:", filter);

    // Fetch reviews sorted by creation date (newest first)
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(filter);

    console.log(`Found ${reviews.length} reviews out of ${totalReviews} total`);

    // Enrich each review with profile image and name
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          // Find user by email (case-insensitive)
          const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${review.userEmail}$`, 'i') }
          });

          let userName = "";
          let profileImage = "";
          let initials = "";

          if (user) {
            // Prefer full name
            if (user.fullName) {
              userName = user.fullName;
            } else if (user.firstName || user.lastName) {
              userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
            } else {
              userName = review.userEmail.split("@")[0];
            }

            // Get profile image from either field
            profileImage = user.profilePhoto || user.profileImage || "";
          } else {
            // User not found — fallback to email prefix
            console.log(`User not found for email: ${review.userEmail}`);
            userName = review.userEmail.split("@")[0];
          }

          // Generate initials from userName
          if (userName) {
            const parts = userName.trim().split(" ");
            initials = parts
              .map((p) => p[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
          } else {
            initials = review.userEmail.charAt(0).toUpperCase();
          }

          return {
            ...review.toObject(),
            userName,
            profileImage,
            initials,
          };
        } catch (userError) {
          console.error(`Error enriching review ${review._id}:`, userError);
          // Return basic review data if enrichment fails
          return {
            ...review.toObject(),
            userName: review.userEmail.split("@")[0],
            profileImage: "",
            initials: review.userEmail.charAt(0).toUpperCase(),
          };
        }
      })
    );

    // Send response
    res.status(200).json({
      success: true,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      reviewsPerPage: limit,
      reviews: enrichedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};