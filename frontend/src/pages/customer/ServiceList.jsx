import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./ServiceList.css";
import Filter from "../../components/customer/serviceList/Filter.jsx";
import ServiceCard from "./../../components/customer/serviceList/ServiceCard";
import { BACKEND_URL } from "../../utils/constant.js";
import { setCategoryServices } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import djBanner from "../../assets/home/categoriesImages/dj_image.png";
import musicBanner from "../../assets/home/categoriesImages/bass-brand.webp";
import decorBanner from "../../assets/home/categoriesImages/tent_house.jpg";
import photoBanner from "../../assets/home/categoriesImages/photographer.png";
import foodBanner from "../../assets/home/categoriesImages/tenthouse.png";
import banquetBanner from "../../assets/home/categoriesImages/banquithall.jpeg";
import danceBanner from "../../assets/home/categoriesImages/classical_music_and_dance.jpg";
import islamicBanner from "../../assets/home/categoriesImages/moulbi.png";
import christianBanner from "../../assets/home/categoriesImages/father.png";
import panditBanner from "../../assets/home/categoriesImages/pandit.png";
import makeupBanner from "../../assets/home/categoriesImages/bride-mehendi-&-makeup.png";
import floralBanner from "../../assets/home/categoriesImages/flower-decor.png";
import carBanner from "../../assets/home/categoriesImages/ceremonial_ride.png";
import fireworksBanner from "../../assets/home/categoriesImages/photographer.png";
import cardBanner from "../../assets/home/categoriesImages/photographer.png";
import magicBanner from "../../assets/home/categoriesImages/photographer.png";
import stageBanner from "../../assets/home/categoriesImages/photographer.png";
import eventBanner from "../../assets/home/categoriesImages/photographer.png";

const ServiceList = ({ onSwitchToLogin }) => {
  const dispatch = useDispatch();
  // const [services, setServices] = useState([]);
  const location = useLocation();

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
    "Fireworks": fireworksBanner,
    "Card Design & Printing": cardBanner,
    "Magic Shows": magicBanner,
    "Stage Decor": stageBanner,
    "Event Company": eventBanner,
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

  return (
    <>
      {categoryData && (
        <>
          {/* Banner Header */}
          <div className="categoryHero">
            <img
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

      <div className="serviceList">
        <Filter onApply={handleApplyFilters} onCancel={handleCancelFilters} />

        <div className={`serviceCardDetails ${showSticky ? "scrollable" : ""}`}>
          {loading ? (
            <p>Loading services...</p>
          ) : filteredServices?.length > 0 ? (
            filteredServices.map((service, idx) => (
              <div className="singleServiceCard hover:shadow-lg" key={idx}>
                <Link
                  to={`/service/${categoryId}/${service._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                ></Link>
                <ServiceCard
                  service={service}
                  onSwitchToLogin={onSwitchToLogin}
                />
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
