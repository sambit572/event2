import React, { useEffect, useRef, useState, Suspense } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./ServiceList.css";
import Filter from "../../components/customer/serviceList/Filter.jsx";
import ServiceCard from "./../../components/customer/serviceList/ServiceCard";
import { BACKEND_URL } from "../../utils/constant.js";
import { setCategoryServices } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import djBanner from "../../assets/serviceListBanner/dj (1).webp";
import musicBanner from "../../assets/serviceListBanner/music-ban.webp";
import decorBanner from "../../assets/serviceListBanner/tent-ban.webp";
import photoBanner from "../../assets/serviceListBanner/photo-ban.webp";
import foodBanner from "../../assets/serviceListBanner/catering-banner.webp";
import banquetBanner from "../../assets/serviceListBanner/banquet-banner.webp";
import danceBanner from "../../assets/serviceListBanner/classical-ban.webp";
import islamicBanner from "../../assets/serviceListBanner/moulib-ban (2).webp";
import christianBanner from "../../assets/serviceListBanner/christian-ban.webp";
import panditBanner from "/categories/pandit.webp";
import makeupBanner from "../../assets/serviceListBanner/beauty-ban.webp";
import floralBanner from "../../assets/serviceListBanner/flower-ban.webp";
import carBanner from "../../assets/serviceListBanner/car-ban.webp";
import fireworksBanner from "/categories/fireworks.webp";
import cardBanner from "/categories/marriage-card.webp";
import magicBanner from "/categories/magician.webp";
import resortBanner from "/categories/resortBanner.webp";
// import stageBanner from "../../assets/home/categoriesImages/stage_decor.webp";
import eventBanner from "/categories/event_company.webp";
import balloonBanner from "../../assets/serviceListBanner/balloon banner.webp";

const ServiceCardSkeleton = () => (
  <div className="serviceCardSkeleton">
    <div className="imgSkeleton"></div>
    <div className="textSkeleton"></div>
    <div className="textSkeleton short"></div>
  </div>
);

const ServiceList = ({ onSwitchToLogin }) => {
  const dispatch = useDispatch();
  // const [services, setServices] = useState([]);
  const location = useLocation();
  const scrollRef = useRef(null);
  // ✅ Get category object from navigation
  const categoryData = location.state?.category;

  const { categoryId } = useParams(); // This is the category name passed in URL
  console.log("################################");
  console.log(categoryId);
  console.log("################################");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showSticky, setShowSticky] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [showArrows, setShowArrows] = useState(false);

  const bannerMap = {
    "DJ Services & Brash Band": djBanner,
    "Music Concert & Orchestra": musicBanner,
    "Decor & Tenthouse": decorBanner,
    "Photo & Videography": photoBanner,
    "Food & Catering": foodBanner,
    "Banquet Hall & Mandap": banquetBanner,
    "Classical Music & Dance": danceBanner,
    "Islamic Maulbi": islamicBanner,
    "Christian Priest": christianBanner,
    "Hindu Pandit": panditBanner,
    "Beauty Makeover": makeupBanner,
    "Floral Decor": floralBanner,
    "Ceremonial Ride": carBanner,
    "Luxury Ride": carBanner,
    Fireworks: fireworksBanner,
    "Card Design & Printing": cardBanner,
    "Magic Shows": magicBanner,
    // "Stage Decor": stageBanner,
    "Event Management Company": eventBanner,
    "Balloon Decor": balloonBanner,
    "Hotel & Resorts": resortBanner,
  };

  // ✅ Define subcategories for each main category
  const subcategoryMap = {
    "DJ Services & Brash Band": [
      "All",
      "Wedding DJ",
      "Corporate Event DJ",
      "Private Party DJ",
    ],
    "Music Concert & Orchestra": [
      "All",
      "Live Band Performance",
      "Qawwali Night",
      "Celebrity Concert",
    ],
    "Decor & Tenthouse": [
      "All",
      "Wedding Decor & Tent",
      "Birthday Party Decor",
      "Reception Decor",
      "Engagement Decor ",
    ],
    "Photo & Videography": [
      "All",
      "Wedding Photography & Videography",
      "Pre-Wedding Shoot",
      "Birthday",
      "Event Coverage",
    ],
    "Food & Catering": [
      "All",
      "Wedding Catering",
      "Birthday Party Catering",
      "Corporate Catering",
    ],
    "Banquet Hall & Mandap": [
      "All",
      "Wedding Banquet Hall",
      "Ring Ceremony ",
      "Birthday",
      "Anniversary",
    ],
    "Classical Music & Dance": [
      "All",
      "Classical Vocal Performance",
      "Instrumental Performance",
      "Bharatanatyam Dance",
    ],
    "Islamic Maulbi": [
      "All",
      "Religious Sermon",
      "Tilawat",
      "Marriage Ceremonies",
      "Funeral Services",
      "Special Event",
    ],
    "Christian Priest": [
      "All",
      "Christening",
      "Wedding Ceremony",
      "Funeral Service",
      "Blessings Prayers",
      "Church Program",
    ],
    "Hindu Pandit": [
      "All",
      "Wedding Ceremony",
      "Puja Ceremony",
      "Housewarming",
      "Naming Ceremony",
      "Shraddh Ceremony",
      "Special Event",
    ],
    "Beauty Makeover": ["All", "Bridal Makeup", "Unisex", "Mehendi Artist"],
    "Floral Decor": [
      "All",
      "Wedding Decor",
      "Stage & Backdrop Floral Decor",
      "Birthday Party Decor",
    ],
    "Ceremonial Ride": ["All", "Bridal Ride", "Luxury Ride", "Classic Ride"],
    "Luxury Ride": ["All", "Bridal Ride", "Luxury Ride", "Classic Ride"],
    Fireworks: [
      "All",
      "Wedding Fireworks",
      "Indoor Fireworks",
      "Outdoor Fireworks",
    ],
    "Card Design & Printing": [
      "All",
      "Wedding Invitations",
      "Birthday Party Invitations",
      "Corporate Cards",
    ],
    "Magic Shows": [
      "All",
      "Children’s Magic Shows",
      "Stage Magic Shows",
      "Close-Up Magic",
    ],
    "Event Management Company": [
      "All",
      "Wedding Full-Service Planner",
      "Corporate Event Management",
      "Birthday Party Planner",
    ],
    "Balloon Decor": [
      "All",
      "Birthday Balloon Decoration",
      "Theme-Based Balloon Decoration",
      "Baby Shower Balloon Decoration",
    ],
    "Hotel & Resorts": [
      "All",
      "Luxury Hotels",
      "Wedding Hotels & Resorts",
      "Resorts",
      "Beach Resorts",
    ],
  };

  // ✅ Show sticky header only after scrolling past banner
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 250; // same as .categoryHero height
      if (window.scrollY > heroHeight - 60) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BACKEND_URL}/common/category/${categoryId}`,
          {
            params: {
              subCategory:
                selectedSubcategory !== "All" ? selectedSubcategory : undefined,
            },
          }
        );

        let servicesData = response.data.data;
        console.log("Fetched services:", servicesData);
        // Attach ratings for each service
        servicesData = await Promise.all(
          servicesData.map(async (service) => {
            try {
              const ratingRes = await axios.get(
                `${BACKEND_URL}/reviews/rating/${service._id}`
              );
              return {
                ...service,
                ratingData: ratingRes.data.data, // ✅ attach averageRating, totalReviews, etc.
              };
            } catch (err) {
              console.error(`Failed to fetch rating for ${service._id}`, err);
              return {
                ...service,
                ratingData: {
                  averageRating: 0,
                  totalRatings: 0,
                  totalReviews: 0,
                },
              };
            }
          })
        );

        dispatch(setCategoryServices(servicesData)); // save to redux
        setServices(servicesData);
        setFilteredServices(servicesData); // Initialize filtered services
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId, selectedSubcategory, dispatch]);

  const handleApplyFilters = (filters) => {
    console.log("Applying filters:", filters);
    const min = Number(filters.minPrice);
    const max = Number(filters.maxPrice);

    // ❌ Negative price validation
    if ((filters.minPrice && min < 0) || (filters.maxPrice && max < 0)) {
      alert("Price cannot be negative");
      return;
    }

    // ❌ Min > Max validation
    if (filters.minPrice && filters.maxPrice && min > max) {
      alert("Minimum price cannot be greater than Maximum price");
      return;
    }
    // Initialize results by filtering services
    const results = services.filter((service) => {
      console.log("Inspecting service:", service); // Debugging log

      const serviceMin = Number(service.minPrice) || 0;
      const serviceMax = Number(service.maxPrice) || 0;

      const priceMatch =
        (!filters.minPrice && !filters.maxPrice) ||
        (filters.minPrice && !filters.maxPrice && serviceMin >= min) ||
        (!filters.minPrice && filters.maxPrice && serviceMax <= max) ||
        (filters.minPrice &&
          filters.maxPrice &&
          serviceMin >= min &&
          serviceMax <= max);

      // ✅ Rating check
      const ratingValue =
        Number(service.avgRating) ||
        Number(service?.ratingData?.averageRating) ||
        0; // Default to 0 if no rating is available
      const ratingMatch = filters.rating
        ? ratingValue >= Number(filters.rating) // Ensure rating is equal to or above the selected rating
        : true;

      const prepTimeDays = Math.ceil((service.duration || 0) / (24 * 60));
      const durationMatch =
        !filters.duration || prepTimeDays <= filters.duration;

      // ✅ State match
      let stateMatch = true;
      if (filters.state) {
        if (Array.isArray(service.stateLocationOffered)) {
          stateMatch = service.stateLocationOffered.some(
            (state) =>
              state?.toLowerCase().trim() === filters.state.toLowerCase().trim()
          );
        } else {
          stateMatch =
            service.stateLocationOffered?.toLowerCase().trim() ===
            filters.state.toLowerCase().trim();
        }
      }

      // ✅ City/District match
      let cityMatch = true;
      if (filters.subdistrict && stateMatch) {
        if (Array.isArray(service.locationOffered)) {
          cityMatch = service.locationOffered.some(
            (city) =>
              city?.toLowerCase().trim() ===
              filters.subdistrict.toLowerCase().trim()
          );
        } else {
          cityMatch =
            service.locationOffered?.toLowerCase().trim() ===
            filters.subdistrict.toLowerCase().trim();
        }
      }

      return (
        priceMatch && ratingMatch && durationMatch && stateMatch && cityMatch
      );
    });

    console.log("Filtered services:", results);

    // ✅ Sorting logic
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case "price":
            return (a.minPrice || 0) - (b.minPrice || 0);
          case "name":
            return a.serviceName.localeCompare(b.serviceName);
          case "duration":
            return (a.duration || 0) - (b.duration || 0);
          case "rating": {
            const ratingA = parseFloat(
              a?.ratingData?.averageRating ?? a.rating ?? 0
            );
            const ratingB = parseFloat(
              b?.ratingData?.averageRating ?? b.rating ?? 0
            );
            console.log("Sorting Ratings:", ratingA, ratingB);
            return ratingB - ratingA; // higher rating first
          }

          default:
            return 0;
        }
      });
    }
    setFilteredServices(results);
    console.log("Filtered and sorted count:", results.length);
  };

  // Runs when Cancel is clicked in Filter
  const handleCancelFilters = () => {
    setFilteredServices(services);
  };

  console.log("categoryId:", categoryId);

  // Scroll subcategories
  const scrollSubcategories = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 150;
      scrollRef.current.scrollTo({
        left:
          direction === "next"
            ? scrollLeft + scrollAmount
            : scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const currentCategory = categoryData?.title?.trim().replace(/\u00A0/g, " ");
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const hasOverflow =
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth;

        setShowArrows(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [currentCategory, subcategoryMap]);

  return (
    <>
      {categoryData && (
        <>
          {/* Banner Header */}
          <div className="categoryHero">
            <img
              decoding="async"
              loading="lazy" // src={bannerMap[categoryData.title] || carBanner}
              src={bannerMap[categoryData.title] || djBanner}
              alt={categoryData.title}
            />

            <FaArrowLeft
              className="backArrow"
              onClick={() => window.history.back()}
            />
            <h2 className="categoryHeroTitle">{categoryData.title}</h2>
          </div>

          {/* Sticky Header → only shows after scroll */}
          {showSticky && (
            <div className={`stickyHeader ${showSticky ? "show" : ""}`}>
              <FaArrowLeft
                className="backArrowSticky"
                onClick={() => window.history.back()}
              />
              <h2>{categoryData.title}</h2>
            </div>
          )}
        </>
      )}

      {currentCategory && subcategoryMap[currentCategory] && (
        <div className="subcategory-wrapper">
          {showArrows && (
            <button
              className="scroll-btn prev"
              onClick={() => scrollSubcategories("prev")}
            >
              <FaChevronLeft />
            </button>
          )}

          <div className="subcategory-tabs" ref={scrollRef}>
            {subcategoryMap[currentCategory].map((sub) => (
              <button
                key={sub}
                className={`subcategory-tab ${
                  selectedSubcategory === sub ? "active" : ""
                }`}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>

          {showArrows && (
            <button
              className="scroll-btn next"
              onClick={() => scrollSubcategories("next")}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}
      <div className="serviceList">
        <Filter onApply={handleApplyFilters} onCancel={handleCancelFilters} />
        <div className={`serviceCardDetails ${showSticky ? "scrollable" : ""}`}>
          {loading ? (
            // Show skeletons while loading
            Array.from({ length: 6 }).map((_, idx) => (
              <ServiceCardSkeleton key={idx} />
            ))
          ) : filteredServices?.length > 0 ? (
            filteredServices.map((service) => (
              <div className="singleServiceCard" key={service._id}>
                <Link
                  to={`/service/${categoryId}/${service._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                ></Link>

                <Suspense fallback={<ServiceCardSkeleton />}>
                  <ServiceCard
                    service={service}
                    onSwitchToLogin={onSwitchToLogin}
                  />
                </Suspense>
              </div>
            ))
          ) : (
            <p>No services found matching filters.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default ServiceList;
