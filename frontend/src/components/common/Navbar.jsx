import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import UserProfileIcon from "../../pages/common/UserProfileIcon.jsx";
import toast from "react-hot-toast";
import logo from "../../assets/serverLogo.png";
// import "../../pages/vendor/VendorLogin.jsx";
import "./Navbar.css";
import { CgProfile } from "react-icons/cg";
import {
  FaSearch,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaStore,
  FaEllipsisV,
  FaHandsHelping,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import { FcAbout, FcAssistant } from "react-icons/fc";
import axios from "axios";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import {
  attemptVendorSilentLogin,
  checkVendorEmailStatus,
} from "../../utils/VendorAuth.jsx";
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

const Navbar = ({
  onOpenLogin,
  onOpenRegister,
  onOpenVendorLogin,
  isOpen,
  setShowPasswordModal,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  // console.log("Cart count from Redux:", user.cartCount);

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

  const handleInputFocus = () => {
    const localHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (localHistory.length > 0) {
      setSuggestions(localHistory);
      setShowSuggestions(true);
    }
  };

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
    const searchText = text.toLowerCase().trim();
    navigate(`/search?query=${encodeURIComponent(text.trim())}`);
    // Check for direct alias mapping
    // const matchedCategory = RELATED_TERMS[searchText];

    // if (matchedCategory) {
    //   navigate(`/category/${matchedCategory}`);
    // } else {
    //   // Try partial match within the search text
    //   const foundCategory = Object.keys(RELATED_TERMS).find((key) =>
    //     searchText.includes(key)
    //   );

    //   if (foundCategory) {
    //     navigate(`/category/${RELATED_TERMS[foundCategory]}`);
    //   } else {
    //     // Fallback: full search results
    //     navigate(`/search-results?q=${encodeURIComponent(searchText)}`);
    //   }
    // }
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

  const handleToggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => {
      if (!prev) {
        setShowVendorDropdown(false);
        setShowEllipsisDropdown(false);
      }
      return !prev;
    });
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

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      const term = searchInput.trim().toLowerCase();
      let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      history.unshift(term);
      history = [...new Set(history)].slice(0, 5);
      localStorage.setItem("searchHistory", JSON.stringify(history));
      let matchedCategory = CATEGORIES.find((cat) =>
        term.includes(cat.toLowerCase())
      );
      if (!matchedCategory) {
        const words = term.split(/\s+/);
        for (let word of words) {
          const cleaned = word.toLowerCase();
          if (RELATED_TERMS[cleaned]) {
            matchedCategory = RELATED_TERMS[cleaned];
            break;
          }
        }
      }
      if (matchedCategory) {
        navigate(`/category/${matchedCategory.toLowerCase()}`);
      } else {
        navigate(`/search-results?query=${encodeURIComponent(term)}`);
      }
      setSearchInput("");
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

  const handleVendorClick = async () => {
    // console.log("clicked vendor button ...");
    if (!userFirstName) {
      onOpenVendorLogin();
      return;
    }
    const silentRes = await attemptVendorSilentLogin();
    if (silentRes.success) {
      navigate("/dashboard");
      return;
    }
    const response = await axios.get(`${BACKEND_URL}/user/get-email`, {
      withCredentials: true,
    });
    const emailStatus = await checkVendorEmailStatus(response.data.data.email);
    console.log("Email status from backend:", emailStatus);
    if (emailStatus.existsInVendor) {
      onOpenVendorLogin();
    } else {
      navigate("/vendor/register");
    }
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
    "e.g, dj",
    "e.g, tenthouse",
    "e.g, cultural troupe",
    "e.g, pandit",
    "e.g, photographer",
    "e.g, musical band",
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

  return (
    <div>
      <div className="navbar">
        {/* ✅ User Logout Popup */}
        {showLogoutPopup && (
          <div className="fixed top-[115px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] p-5 px-8 rounded-lg bg-white/10 backdrop-blur-[10px] border-2 border-white font-bold text-yellow-400 text-center animate-pulse">
            You are logged out successfully!
          </div>
        )}

        {/* ✅ Vendor Logout Popup */}
        {showVendorLogoutPopup && (
          <div className="fixed top-[115px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] p-5 px-8 rounded-lg bg-white/10 backdrop-blur-[10px] border-2 border-black font-bold text-black text-center animate-pulse">
            You are signed out successfully!
          </div>
        )}

        {/* Logo */}
        <div className="logo">
          {/* <img src={logo} alt="logo" /> */}
          <span onClick={handleHomeClick}>EVENTSBRIDGE</span>
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
                  if (value.trim() === "") {
                    setShowSuggestions(false);
                    return;
                  }
                  if (value.trim().length > 1) {
                    fetchDynamicSuggestions(value);
                  }
                  const localHistory =
                    JSON.parse(localStorage.getItem("searchHistory")) || [];
                  const matchingCategories = CATEGORIES.filter((cat) =>
                    cat.toLowerCase().includes(value.toLowerCase())
                  );
                  const matchingHistory = localHistory.filter((term) =>
                    term.toLowerCase().includes(value.toLowerCase())
                  );
                  const combinedSuggestions = [
                    ...new Set([...matchingCategories, ...matchingHistory]),
                  ].slice(0, 5);
                  setSuggestions(combinedSuggestions);
                  setShowSuggestions(true);
                }}
                autoFocus
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
                      setSearchInput(suggestion);
                      navigate(
                        `/search?query=${encodeURIComponent(suggestion.trim())}`
                      );
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
              <ProfileMenu
                userFirstName={userFirstName}
                currentUser={currentUser}
                showProfileDropdown={showProfileDropdown}
                setShowProfileDropdown={setShowProfileDropdown}
                handleLoginClick={handleLoginClick}
                handleSignupClick={handleSignupClick}
                handleLogout={handleLogout}
                navigate={navigate}
              />

              {/* Become Vendor */}
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
              {/* cart */}
              <CartButton
                cartCount={user.cartCount}
                handleAddToCart={handleAddToCart}
              />
            </div>
            {/* Three Dots Dropdown */}
            <ThreeDot
              showEllipsisDropdown={showEllipsisDropdown}
              setShowEllipsisDropdown={setShowEllipsisDropdown}
              setShowVendorDropdown={setShowVendorDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
            />
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
