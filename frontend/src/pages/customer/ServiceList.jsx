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
import djBanner from "../../assets/home/categoriesImages/dj_image.png";
import musicBanner from "../../assets/home/categoriesImages/bass-brand.png";
import decorBanner from "../../assets/home/categoriesImages/tent_house.png";
import photoBanner from "../../assets/home/categoriesImages/photographer.png";
import foodBanner from "../../assets/aboutUs/CATERING.png";
import banquetBanner from "../../assets/home/categoriesImages/banquithall.png";
import danceBanner from "../../assets/home/categoriesImages/classical_music_and_dance.jpg";
import islamicBanner from "../../assets/home/categoriesImages/moulbi.png";
import christianBanner from "../../assets/home/categoriesImages/father.png";
import panditBanner from "../../assets/home/categoriesImages/pandit.png";
import makeupBanner from "../../assets/home/categoriesImages/bride-mehendi-&-makeup.png";
import floralBanner from "../../assets/home/categoriesImages/flower-decor.png";
import carBanner from "../../assets/home/categoriesImages/ceremonial_ride.png";
import fireworksBanner from "../../assets/home/categoriesImages/fireworks.png";
import cardBanner from "../../assets/home/categoriesImages/marriage-card.png";
import magicBanner from "../../assets/home/categoriesImages/magician.png";
import stageBanner from "../../assets/home/categoriesImages/stage_decor.png";
import eventBanner from "../../assets/home/categoriesImages/event_company.png";

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
    Fireworks: fireworksBanner,
    "Card Design & Printing": cardBanner,
    "Magic Shows": magicBanner,
    "Stage Decor": stageBanner,
    "Event Company": eventBanner,
  };

  // ✅ Define subcategories for each main category
  const subcategoryMap = {
    "DJ Services & Brash Band": [
      "All",
      "Wedding DJ",
      "Corporate Event DJ",
      "Private Party DJ",
      "Festival DJ",
      "Brass Band",
      "DJ + Band Combo",
    ],
    "Music Concert & Orchestra": [
      "All",
      "Live Band Performance",
      "Classical Orchestra",
      "Instrumental Ensemble",
      "Sufi / Qawwali Night",
      "Celebrity / Artist Concert",
    ],
    "Decor & Tenthouse": [
      "All",
      "Wedding Decor & Tent",
      "Reception / Engagement Decor",
      "Corporate Event Decor",
      "Birthday / Private Party Decor",
      "Stage & Backdrop Decoration",
      "Festival Decoration",
      "Theme-based Decoration",
    ],
    "Photo & Videography": [
      "All",
      "Wedding Photography & Videography",
      "Pre-Wedding Shoot",
      "Engagement / Reception Shoot",
      "Birthday / Event Coverage",
      "Corporate / Brand Shoot",
      "Cinematic Highlight Video",
    ],
    "Food & Catering": [
      "All",
      "Wedding Catering",
      "Birthday / Private Party Catering",
      "Corporate / Office Catering",
      "Buffet Catering",
      "Live Counters & Food Stalls", // 🥙 Panipuri, Chaat, Street food, etc.
      "Dessert & Beverage Stations", // 🍨 Ice cream, Mocktail bar, Juice stall
      "Private Chef & Cooking Services", // 👨‍🍳 Hire a chef only
      "Regional / Traditional Cuisine",
      "Multi-Cuisine / Continental Catering",
      "Vegetarian / Vegan Catering",
    ],
    "Banquet Hall & Mandap": [
      "All",
      "Wedding Banquet Hall",
      "Engagement / Ring Ceremony Hall",
      "Birthday / Anniversary Hall",
      "Corporate Event Hall",
      "Mandap / Traditional Setup",
      "Outdoor Lawn / Garden Venue",
      "Mini Hall / Community Hall",
      "Luxury Banquet / 5-Star Venue",
    ],
    "Classical Music & Dance": [
      "All",
      "Classical Vocal Performance",
      "Instrumental Performance",
      "Bharatanatyam Dance",
      "Kathak Dance",
      "Odissi / Kuchipudi / Mohiniyattam",
      "Fusion Classical Performance",
      "Group / Ensemble Performance",
      "Melody Party Dance Program",
    ],
    "Islamic Maulbi": [
      "All",
      "Religious Sermon / Bayan",
      "Quran Recitation / Tilawat",
      "Nikah / Marriage Ceremonies",
      "Funeral / Memorial Services",
      "Special Event / Program",
    ],
    "Christian Priest": [
      "All",
      "Baptism / Christening",
      "Wedding Ceremony",
      "Funeral / Memorial Service",
      "Blessings / Special Prayers",
      "Church / Community Program",
    ],
    "Hindu Pandit": [
      "All",
      "Wedding / Vivah Ceremony",
      "Puja / Religious Ceremony",
      "Housewarming / Griha Pravesh",
      "Naming Ceremony / Annaprashan",
      "Funeral / Shraddh Ceremony",
      "Special Event / Festival Puja",
    ],
    "Beauty Makeover": [
      "All",
      "Bridal Makeup",
      "Groom / Male Makeup",
      "Unisex / Party Makeup",
      "Mehendi / Henna Artist",
      "Hair Styling & Spa",
      "Special Event / Photo Shoot",
    ],
    "Floral Decor": [
      "All",
      "Wedding / Bridal Decor",
      "Birthday / Private Party Decor",
      "Corporate Event / Conference Decor",
      "Themed / Custom Floral Arrangements",
      "Stage & Backdrop Floral Decor",
      "Table / Centerpiece Decor",
      "Outdoor / Garden Event Decor",
    ],
    "Ceremonial Ride": [
      "All",
      "Wedding Car / Bridal Car",
      "Luxury / Premium Car Rental",
      "Vintage / Classic Car",
      "Decorated Bus / Van",
      "Horse / Animal Ride",
      "Motorbike / Bike Decor",
    ],
    Fireworks: [
      "All",
      "Wedding / Celebration Fireworks",
      "Corporate Event Fireworks",
      "Indoor Fireworks / Spark Show",
      "Outdoor / Large Scale Fireworks",
      "Customized / Themed Fireworks",
      "Diwali / Festival Fireworks",
    ],
    "Card Design & Printing": [
      "All",
      "Wedding Invitations",
      "Birthday / Party Invitations",
      "Corporate / Business Cards",
      "Custom / Themed Invitations",
      "Greeting Cards",
      "Event Flyers / Posters",
    ],
    "Magic Shows": [
      "All",
      "Stage Magic / Illusion Shows",
      "Close-Up / Table Magic",
      "Children’s Magic Shows",
      "Street / Walk-Around Magic",
      "Themed / Custom Magic Shows",
    ],
    "Stage Decor": [
      "All",
      "Wedding Stage / Mandap Decor",
      "Corporate Event Stage",
      "Birthday / Private Party Stage",
      "Themed / Conceptual Stage Decor",
      "Outdoor / Lawn Stage Decor",
      "Stage Lighting & Backdrop",
    ],
    "Event Company": [
      "All",
      "Wedding Planner / Full-Service",
      "Corporate Event Management",
      "Birthday / Private Party Planner",
      "Themed / Conceptual Event Planner",
      "Festival / Religious Event Organizer",
      "Exhibition / Trade Show Planner",
      "Destination / Outdoor Event Planner",
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
          `${BACKEND_URL}/common/category/${categoryId}`
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
  }, [categoryId, dispatch]);

  const handleApplyFilters = (filters) => {
    console.log("Applying filters:", filters);
    // Initialize results by filtering services
    const results = services.filter((service) => {
      console.log("Inspecting service:", service); // Debugging log

      const serviceMin = Number(service.minPrice) || 0;
      const serviceMax = Number(service.maxPrice) || 0;

      // ✅ Price overlap check
      const priceMatch =
        (!filters.minPrice && !filters.maxPrice) ||
        (serviceMin >= filters.minPrice && serviceMax <= filters.maxPrice);

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

  return (
    <>
      {categoryData && (
        <>
          {/* Banner Header */}
          <div className="categoryHero">
            <img
              src={bannerMap[categoryData.title] || djBanner}
              alt={categoryData.title}
              loading="lazy"
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

      {/* {currentCategory && subcategoryMap[currentCategory] && (
        <div className="subcategory-wrapper">
          <button
            className="scroll-btn prev"
            onClick={() => scrollSubcategories("prev")}
          >
            <FaChevronLeft />
          </button>

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

          <button
            className="scroll-btn next"
            onClick={() => scrollSubcategories("next")}
          >
            <FaChevronRight />
          </button>
        </div>
      )} */}
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
              <div
                className="singleServiceCard hover:shadow-lg"
                key={service._id}
              >
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
