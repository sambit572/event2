import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import UserProfileIcon from "../../pages/common/UserProfileIcon.jsx";
import toast from "react-hot-toast";
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
import { clearUser } from "../../redux/UserSlice.js";
import { clearVendor } from "../../redux/VendorSlice.js";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  // 🔁 Define keyword groups
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
      setShowMobileSearchBar(true); // set true on desktop
      if (inputRef.current) inputRef.current.focus();
    }
  };

  // new function added
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
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const vendorLogout = async (req, res) => {
    try {
      console.log("Logging out vendor...");
      await axios.post(
        `${BACKEND_URL}/vendors/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("VendorFullName");
      localStorage.removeItem("VendorFirstName");
      localStorage.removeItem("VendorInitial");
      localStorage.removeItem("VendorCurrentlyLoggedIn");
      setVendorFirstName(null);
      dispatch(clearVendor());
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      const term = searchInput.trim().toLowerCase();

      // 🔁 Save search history in localStorage
      let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      history.unshift(term); // add to top
      history = [...new Set(history)].slice(0, 5); // remove duplicates, limit to 5
      localStorage.setItem("searchHistory", JSON.stringify(history));

      // ✅ If user searched for a known category, go to /category/categoryName
      let matchedCategory = CATEGORIES.find((cat) =>
        term.includes(cat.toLowerCase())
      );

      // Try matching related words if no direct category match
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

      setSearchInput(""); // clear input box
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
    console.log("clicked vendor button ...");
    if (!userFirstName) {
      onOpenVendorLogin(); // force user to login first
      return;
    }

    // 1. Try silent login with vendor token
    const silentRes = await attemptVendorSilentLogin();
    if (silentRes.success) {
      navigate("/dashboard");
      return;
    }

    // 2. Check email status for current user
    const response = await axios.get(`${BACKEND_URL}/user/get-email`, {
      withCredentials: true,
    });
    const emailStatus = await checkVendorEmailStatus(response.data.data.email);

    console.log("Email status from backend:", emailStatus);

    if (emailStatus.existsInVendor) {
      onOpenVendorLogin(); // already a vendor
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

  // click anywhere to close search bar

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

  //cart logic
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
        {/* Logo */}
        <div className="logo">
          <span onClick={handleHomeClick}>EVENTSBRIDGE</span>
        </div>

        <div className="search-and-nav-icons-container ">
          {/* Search Bar */}
          <div
            ref={searchBarRef}
            className={`search-bar ${showMobileSearchBar ? "active" : ""}`}
            onClick={(e) => {
              handleSearchicon(e);
              e.stopPropagation(); // Prevent event bubbling
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

                  // If input is empty or only spaces, hide suggestions
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

                // onFocus={handleInputFocus}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     setShowSuggestions(false); // ✅ closes dropdown
                //   }
                //   handleSearch(e); // ✅ keep your existing search logic
                // }}
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
                      navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
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

          {/* Nav Icons */}
          <div className="nav-icons">
            {/* Profile Dropdown */}
            <div
              className="nav-item profile-dropdown-container"
              ref={profileRef}
            >
              <div className="flex items-center gap-2 text-gray-700 cursor-pointer login">
                <span
                  className="flex items-center gap-2 max-[1024px]:flex-row max-[1024px]:text-[12px] max-[820px]:text-[11px]"
                  onClick={!userFirstName ? handleLoginClick : undefined}
                >
                  {!userFirstName ? (
                    <>
                      <CgProfile className="text-2xl" />
                      <span className="font-medium vendorNameText">Login</span>
                    </>
                  ) : (
                    <>
                      <UserProfileIcon currentUser={currentUser} />
                      <span className="font-medium vendorNameText">{`Hi, ${userFirstName}`}</span>
                    </>
                  )}
                </span>

                {/* ⬇ Always show dropdown toggle arrow */}
                <span onClick={handleToggleProfileDropdown}>
                  {showProfileDropdown ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </span>
              </div>

              {showProfileDropdown && (
                <div className="dropdown-menu profile-menu">
                  {!userFirstName ? (
                    <>
                      <h4 className="login-h4">Welcome</h4>
                      <p className="login-p">
                        To access account and manage services
                      </p>
                      <div className="dropdown-header">
                        <span className="text-[#001f3f]">New Customer?</span>
                        <button
                          className="bg-[#001f3f] hover:bg-gray-900"
                          onClick={handleSignupClick}
                        >
                          Sign Up
                        </button>
                      </div>
                      <hr />
                    </>
                  ) : (
                    <>
                      <div
                        className="flex flex-row gap-1 mb-[10px] text-[#001f3f] text-center hover:text-[#022f5d] hover:font-bold text-[15px] cursor-pointer"
                        onClick={() => navigate("/profile")}
                      >
                        <FaUser style={{ marginRight: "8px" }} />
                        My Profile
                      </div>
                      <div className="dropdown-item hover:text-[#001f3f] hover:font-bold">
                        <FaHeart
                          className="navbar_icon "
                          style={{ marginRight: "4px" }}
                        />
                        <a href="/wishlist">Wishlist</a>
                      </div>
                      <div className="dropdown-item">
                        <FaSignOutAlt
                          className="navbar_icon hover:text-[#001f3f] hover:font-bold"
                          style={{ marginRight: "4px" }}
                        />
                        <button
                          className="signOutButton hover:text-[#001f3f] hover:font-bold"
                          onClick={handleLogout}
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Become Vendor */}
            <div
              className="nav-item profile-dropdown-container"
              ref={vendorRef}
            >
              <div className="nav-items max-[1024px]:flex-col max-[1024px]:text-[12px] max-[820px]:text-[11px] cursor-pointer">
                <div className="flex items-center gap-1">
                  <FaStore
                    className="icons max-[1024px]:h-[18px] max-[1024px]:w-[18px] max-[820px]:h-[15px]"
                    onClick={handleVendorClick}
                  />
                  <span
                    className="text-[#001F3F]  font-semibold  max-[820px]:text-[11px] max-[820px]:w-max"
                    onClick={() => {
                      setShowVendorDropdown((prev) => {
                        if (!prev) {
                          setShowProfileDropdown(false);
                          setShowEllipsisDropdown(false);
                        }
                        return !prev;
                      });
                      if (!userFirstName) {
                        const toastId = toast.custom((t) => (
                          <div
                            className={`${
                              t.visible
                                ? "animate-toast-wiggle"
                                : "animate-leave"
                            } fixed top-4 right-10 z-50 mt-12`}
                          >
                            {/* Toast Box */}
                            <div className="relative bg-white border-10 border-[#001f3f] text-black px-6 py-3 rounded-xl w-fit max-w-sm">
                              {/* Triangle */}
                              <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-[10px] border-l-transparent border-r-transparent"></div>

                              {/* Toast Message */}
                              <span className="font-semibold block">
                                Please register as a user first.
                              </span>
                            </div>
                          </div>
                        ));

                        setTimeout(() => toast.dismiss(toastId), 2000);
                      } else {
                        handleVendorClick();
                      }
                    }}
                  >
                    {!VendorFirstName ? (
                      <span className="font-medium vendorNameText transition-colors">
                        Be a Vendor
                      </span>
                    ) : (
                      <>
                        <span className="font-medium vendorNameText">
                          {VendorFirstName}
                        </span>
                      </>
                    )}
                  </span>

                  <span
                    onClick={() => {
                      setShowVendorDropdown((prev) => {
                        if (!prev) {
                          setShowProfileDropdown(false);
                          setShowEllipsisDropdown(false);
                        }
                        return !prev;
                      });
                    }}
                  >
                    {" "}
                    {showVendorDropdown ? (
                      <FaChevronUp className="text-sm icons" />
                    ) : (
                      <FaChevronDown className="text-sm icons" />
                    )}
                  </span>
                </div>
              </div>

              {showVendorDropdown && (
                <div className="vendor_dropdown-menu absolute top-[75px]  right-[50px] bg-[#e5e5de] rounded-lg border border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 z-[2000] w-[278px] ">
                  <h4 className="text-lg font-semibold text-[#001F3F] text-center mb-1">
                    Welcome Vendor
                  </h4>
                  <p className="text-gray-600 text-center mb-3">
                    Access your vendor tools and profile
                  </p>

                  {/* If NOT logged in → Show Register */}
                  {!VendorFirstName && (
                    <>
                      <div className="dropdown-header">
                        <span className="text-[#001f3f] font-lg">
                          New Vendor?
                        </span>
                      </div>
                      <div className="flex flex-row gap-2 mt-2">
                        {/* Register Button */}
                        <button
                          className="w-1/2 bg-black hover:bg-gray-800 text-white rounded px-3 py-2 transition-colors"
                          onClick={() => {
                            setShowVendorDropdown(false);
                            if (!userFirstName) {
                              const toastId = toast.custom((t) => (
                                <div
                                  className={`${
                                    t.visible
                                      ? "animate-toast-wiggle"
                                      : "animate-leave"
                                  } fixed top-4 right-10 z-50 mt-12`}
                                >
                                  {/* Toast Box */}
                                  <div className="relative bg-white border-[#001f3f] text-black px-6 py-3 rounded-xl w-fit max-w-sm">
                                    {/* Triangle */}
                                    <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-[10px] border-l-transparent border-r-transparent"></div>

                                    {/* Toast Message */}
                                    <span className="font-semibold block">
                                      Please register as a user first.
                                    </span>
                                  </div>
                                </div>
                              ));

                              setTimeout(() => toast.dismiss(toastId), 2000);
                            } else {
                              navigate("/vendor/register");
                            }
                          }}
                        >
                          Register
                        </button>

                        {/* Login Button */}
                        <button
                          className="w-1/2 bg-blue-500 font-bold text-white hover:bg-blue-800 rounded px-3 py-2 transition-colors"
                          onClick={() => {
                            setShowVendorDropdown(false); // ✅ Close the dropdown

                            if (!userFirstName) {
                              const toastId = toast.custom((t) => (
                                <div
                                  className={`${
                                    t.visible
                                      ? "animate-toast-wiggle"
                                      : "animate-leave"
                                  } fixed top-4 right-10 z-50 mt-12`}
                                >
                                  {/* Toast Box */}
                                  <div className="relative bg-white border-[#001f3f] text-black px-6 py-3 rounded-xl w-fit max-w-sm">
                                    {/* Triangle */}
                                    <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-[10px] border-l-transparent border-r-transparent"></div>

                                    {/* Toast Message */}
                                    <span className="font-semibold block">
                                      Please register as a user first.
                                    </span>
                                  </div>
                                </div>
                              ));

                              setTimeout(() => toast.dismiss(toastId), 2000);
                            } else {
                              onOpenVendorLogin();
                            }

                            // ✅ Always go to login (or open modal)
                          }}
                        >
                          Login
                        </button>
                      </div>
                    </>
                  )}

                  {/* If logged in → Show Change Password + Sign Out */}
                  {VendorFirstName && (
                    <>
                      <hr className="my-2" />
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-3 rounded"
                          onClick={() => {
                            setShowVendorDropdown(false);
                            navigate("/vendor/change-password");
                          }}
                        >
                          Change Password
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-3 px-3 rounded"
                          onClick={() => {
                            setShowVendorDropdown(false);
                            vendorLogout();
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="navbarCart" onClick={handleAddToCart}>
              <div className="navbarCartIcon">
                <FaCartShopping />
              </div>
              <div className="navbarCartText">Cart</div>
            </div>
            {/* Three Dots Dropdown */}
            <div className="nav-item ellipsis-container" ref={ellipsisRef}>
              <FaEllipsisV
                className="three-dot"
                onClick={() => {
                  setShowEllipsisDropdown((prev) => {
                    if (!prev) {
                      setShowVendorDropdown(false);
                      setShowProfileDropdown(false);
                    }
                    return !prev;
                  });
                }}
                style={{ cursor: "pointer" }}
              />
              {showEllipsisDropdown && (
                <div className="dropdown-menu ellipsis-menu">
                  <div
                    className={`dropdown-item ${
                      location.pathname === "/about_us" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/about_us");
                      setShowEllipsisDropdown(!showEllipsisDropdown);
                    }}
                  >
                    <FcAbout className="navbar_icon" /> About Us
                  </div>

                  <div
                    className={`dropdown-item ${
                      location.pathname === "/help_us" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/help_us");
                      setShowEllipsisDropdown(!showEllipsisDropdown);
                    }}
                  >
                    <FcAssistant className="nav-icon" /> Help Us
                  </div>
                </div>
              )}
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
