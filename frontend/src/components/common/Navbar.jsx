import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import "./Navbar.css";

import { FaSearch } from "react-icons/fa";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { clearUser, fetchCart, setCartCount } from "../../redux/UserSlice.js";
import socket from "../../socket/socketClient.js";
import { clearVendor } from "../../redux/VendorSlice.js";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import CartButton from "./navbar/CartButton";
import ProfileMenu from "./navbar/ProfileMenu";
import VendorMenu from "./navbar/VendorMenu";
import ThreeDot from "./navbar/ThreeDot";

const CATEGORIES = [
  "dj",
  "band",
  "tenthouse",
  "photographer",
  "pandit",
  "magic",
  "cultural-troupe",
  "islamic",
  "christian",
  "catering",
  "makeup",
  "floral",
  "transport",
  "fireworks",
  "card-design",
];

const Navbar = ({ onOpenLogin, onOpenRegister, onOpenVendorLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);

  const [currentUser, setCurrentUser] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [VendorFirstName, setVendorFirstName] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

  // pop up show after logout
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showVendorLogoutPopup, setShowVendorLogoutPopup] = useState(false);

  const profileRef = useRef(null);
  const ellipsisRef = useRef(null);
  const vendorRef = useRef(null);
  const inputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const suggestionRef = useRef(null);
  const searchBarRef = useRef(null);

  const RELATED_TERMS = {};

  const mapAliases = (aliases, category) => {
    aliases.forEach((alias) => {
      RELATED_TERMS[alias.toLowerCase()] = category;
    });
  };

  mapAliases(["photo", "photos", "photography", "picture"], "photographer");
  mapAliases(["dj", "deejay"], "dj");
  mapAliases(["band", "music", "musician"], "band");
  mapAliases(["tent", "tenthouse", "tents"], "tenthouse");
  mapAliases(["pandit", "priest", "brahmin", "brahman", "pujari"], "pandit");
  mapAliases(["magic", "magician", "illusionist"], "magic");
  mapAliases(["cater", "catering", "caterers", "food", "buffet"], "catering");
  mapAliases(
    ["makeup", "beauty", "beautician", "makeupartist", "parlour"],
    "makeup"
  );
  mapAliases(["floral", "flowers", "flower", "decor", "florist"], "floral");
  mapAliases(["transport", "car", "vehicle", "cab"], "transport");
  mapAliases(["fireworks", "firework", "crackers", "pataka"], "fireworks");
  mapAliases(
    ["card", "invitation", "invite", "invites", "cards"],
    "card-design"
  );
  mapAliases(["church", "christian", "weddingchurch"], "christian");
  mapAliases(
    ["islam", "muslim", "imam", "maulbi", "moulbi", "muslim priest"],
    "islamic"
  );
  mapAliases(
    ["culture", "troupe", "artist", "folk", "dance", "group dance"],
    "cultural-troupe"
  );

  useEffect(() => {
    const storedName = localStorage.getItem("userFirstName");
    if (storedName) {
      setUserFirstName(storedName);
      dispatch(fetchCart());
    }
  }, [dispatch]);

  useEffect(() => {
    const handleCartUpdate = (data) => {
      console.log("Socket event 'cart-updated' received with data:", data);
      dispatch(setCartCount(data.count));
    };
    socket.on("cart-updated", handleCartUpdate);
    return () => {
      socket.off("cart-updated", handleCartUpdate);
    };
  }, [dispatch]);

  const fetchDynamicSuggestions = async (query) => {
    try {
      if (query.trim().length <= 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const res = await axios.get(
        `http://localhost:8001/api/search/suggestion?q=${query}`
      );
      if (res.data.success) {
        setSuggestions(res.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchicon = (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      setShowMobileSearchBar((prev) => !prev);
    } else {
      setShowMobileSearchBar(true);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleSearchNavigate = (text) => {
    if (!text.trim()) return;

    const keyword = text.toLowerCase().trim();

    // 🔥 Map aliases → category
    if (RELATED_TERMS[keyword]) {
      navigate(`/category/${RELATED_TERMS[keyword]}`);
      return;
    }

    // fallback → search page
    navigate(`/search?query=${encodeURIComponent(text)}`);
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/profile`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCurrentUser(res.data.data);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("currentlyLoggedIn");
      setUserFirstName(null);
      dispatch(clearUser());

      // ✅ Show popup message
      setShowLogoutPopup(true);
      setTimeout(() => {
        setShowLogoutPopup(false);
        navigate("/", { replace: true });
      }, 3000);
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed. Please try again.");
    }
  };

  const vendorLogout = async () => {
    try {
      console.log("Logging out vendor...");
      await axios.post(
        `${BACKEND_URL}/vendors/logout`,
        {},
        { withCredentials: true }
      );

      // Clear vendor info
      localStorage.removeItem("VendorFullName");
      localStorage.removeItem("VendorFirstName");
      localStorage.removeItem("VendorInitial");
      localStorage.removeItem("VendorCurrentlyLoggedIn");
      setVendorFirstName(null);
      dispatch(clearVendor());

      // ✅ Show popup
      setShowVendorLogoutPopup(true);
      setTimeout(() => {
        setShowVendorLogoutPopup(false);
        navigate("/", { replace: true });
      }, 3000);
    } catch (error) {
      console.error("Logout failed", error);
      alert("Failed to logout");
    }
  };

  const handleLoginClick = () => {
    setShowProfileDropdown(false);
    onOpenLogin();
  };

  const handleSignupClick = () => {
    setShowProfileDropdown(false);
    onOpenRegister();
  };

  useEffect(() => {
    const handleClickOutsideAll = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        vendorRef.current &&
        !vendorRef.current.contains(event.target) &&
        ellipsisRef.current &&
        !ellipsisRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
        setShowVendorDropdown(false);
        setShowEllipsisDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideAll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideSearch = (e) => {
      const clickedOutsideDesktop =
        searchBarRef.current && !searchBarRef.current.contains(e.target);
      const clickedOutsideMobile =
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target);
      if (
        showMobileSearchBar &&
        (clickedOutsideDesktop || clickedOutsideMobile)
      ) {
        setShowMobileSearchBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, [showMobileSearchBar]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateName = () => {
      const storedName = localStorage.getItem("userFirstName");
      const storedVendor = localStorage.getItem("VendorFirstName");
      setUserFirstName(storedName);
      setVendorFirstName(storedVendor);
    };
    updateName();
    window.addEventListener("userLoggedIn", updateName);
    return () => window.removeEventListener("userLoggedIn", updateName);
  }, []);

  const placeholders = [
    "Search for Services and more..",
    "e.g, DJ Services & Brash Band",
    "e.g, Decor & Tenthouse",
    "e.g, Classical Music & Dance",
    "e.g, pandit",
    "e.g, Photo & Videography",
    "e.g, Music Concert & Orchestra",
    "e.g, Beauty Makeover",
  ];
  const [placeholder, setPlaceholder] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/your-cart");
    } else {
      onOpenLogin(true);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        vendorRef.current &&
        !vendorRef.current.contains(event.target) &&
        ellipsisRef.current &&
        !ellipsisRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
        setShowVendorDropdown(false);
        setShowEllipsisDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      handleSearchNavigate(searchInput.trim());
      setSearchInput("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className="align_center navbar">
      <div className="navbar">
        {/* ✅ User Logout Popup */}
        {showLogoutPopup && (
          <div className="fixed top-[250px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold text-lg shadow-2xl border border-blue-700 animate">
            You are logged out successfully!
          </div>
        )}

        {/* ✅ Vendor Logout Popup */}
        {showVendorLogoutPopup && (
          <div className="fixed top-[115px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold text-lg shadow-2xl border border-blue-700 animate">
            You are logged out successfully!
          </div>
        )}

        {/* Logo */}
        <div className="logo">
          {/* <img decoding="async" src={logo} alt="logo" /> */}
          <span onClick={handleHomeClick}>EventsBridge</span>
        </div>

        <div className="search-and-nav-icons-container items-center">
          {/* Search Bar */}
          <div
            ref={searchBarRef}
            className={`search-bar ${showMobileSearchBar ? "active" : ""}`}
            onClick={(e) => {
              handleSearchicon(e);
              e.stopPropagation();
            }}
          >
            {(showMobileSearchBar || window.innerWidth > 768) && (
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholders[placeholder]}
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);

                  if (value.trim().length <= 1) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                    return;
                  }

                  // 1️⃣ Backend suggestions
                  fetchDynamicSuggestions(value);

                  // 2️⃣ Local category + history suggestions
                  const localHistory =
                    JSON.parse(localStorage.getItem("searchHistory")) || [];

                  const matchingCategories = CATEGORIES.filter((cat) =>
                    cat.toLowerCase().includes(value.toLowerCase())
                  );

                  const matchingHistory = localHistory.filter((term) =>
                    term.toLowerCase().includes(value.toLowerCase())
                  );

                  // 3️⃣ Merge safely (DON'T overwrite)
                  setSuggestions((prev) =>
                    [
                      ...new Set([
                        ...prev,
                        ...matchingCategories,
                        ...matchingHistory,
                      ]),
                    ].slice(0, 6)
                  );

                  setShowSuggestions(true);
                }}
                autoFocus
                onKeyDown={handleKeyDown}
              />
            )}
            <div className="searchbarIcon">
              <FaSearch
                className="search-icon"
                onClick={() => {
                  console.log("Search icon clicked with:", searchInput);
                  if (searchInput.trim() !== "") {
                    handleSearchNavigate(searchInput);
                  }
                }}
              />
            </div>
          </div>
          {showSuggestions && (
            <div className="suggestions-dropdown" ref={suggestionRef}>
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      handleSearchNavigate(suggestion);
                      setSearchInput("");
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className="suggestion-item no-results">
                  No results found
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between ml-2 ">
            {/* Nav Icons */}
            <div className="nav-icons">
              {/* Profile Dropdown */}
              <div ref={profileRef}>
                <ProfileMenu
                  userFirstName={userFirstName}
                  currentUser={currentUser}
                  showProfileDropdown={showProfileDropdown}
                  setShowProfileDropdown={setShowProfileDropdown}
                  handleLoginClick={handleLoginClick}
                  handleSignupClick={handleSignupClick}
                  handleLogout={handleLogout}
                  navigate={navigate}
                  setShowEllipsisDropdown={setShowEllipsisDropdown}
                  setShowVendorDropdown={setShowVendorDropdown}
                />
              </div>

              {/* Become Vendor */}
              <div ref={vendorRef}>
                <VendorMenu
                  VendorFirstName={VendorFirstName}
                  userFirstName={userFirstName}
                  showVendorDropdown={showVendorDropdown}
                  setShowVendorDropdown={setShowVendorDropdown}
                  setShowProfileDropdown={setShowProfileDropdown}
                  setShowEllipsisDropdown={setShowEllipsisDropdown}
                  navigate={navigate}
                  onOpenVendorLogin={onOpenVendorLogin}
                  vendorLogout={vendorLogout}
                />
              </div>
              {/* cart */}
              <CartButton
                cartCount={user.cartCount}
                handleAddToCart={handleAddToCart}
              />
            </div>
            {/* Three Dots Dropdown */}
            <div ref={ellipsisRef}>
              <ThreeDot
                showEllipsisDropdown={showEllipsisDropdown}
                setShowEllipsisDropdown={setShowEllipsisDropdown}
                setShowVendorDropdown={setShowVendorDropdown}
                setShowProfileDropdown={setShowProfileDropdown}
              />
            </div>
          </div>
        </div>
      </div>
      {showMobileSearchBar && window.innerWidth <= 768 && (
        <div
          ref={mobileSearchRef}
          className="mobile-search-bar-container active"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholders[placeholder]}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

Navbar.propTypes = {
  onOpenLogin: PropTypes.func.isRequired,
  onOpenRegister: PropTypes.func.isRequired,
  onOpenVendorLogin: PropTypes.func.isRequired,
};

export default Navbar;
