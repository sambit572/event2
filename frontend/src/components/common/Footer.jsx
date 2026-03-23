import React, { useState, useEffect } from "react";
import "./Footer.css";
import { Navigate, useNavigate } from "react-router-dom";
import startup48 from "../../assets/home/startup-india-48.webp";
import startup64 from "../../assets/home/startup-india-64.webp";
import startup96 from "../../assets/home/startup-india-96.webp";
import startup128 from "../../assets/home/startup-india-128.webp";
import startup256 from "../../assets/home/startup-india-256.webp";
import wa40 from "/whatsapp-40.webp";
import wa80 from "/whatsapp-80.webp";
import insta40 from "/instagram-40.webp";
import insta80 from "/instagram-80.webp";

export const categoriesData = {
  "DJ Services & Brash Band": [
    "Wedding DJ",
    "Corporate Event DJ",
    "Private Party DJ",
  ],
  "Music Concert & Orchestra": [
    "Live Band Performance",
    "Qawwali Night",
    "Celebrity Concert",
  ],
  "Decor & Tenthouse": [
    "Wedding Decor & Tent",
    "Birthday Party Decor",
    "Reception Decor",
    "Engagement Decor",
  ],
  "Photo & Videography": [
    "Wedding Photography & Videography",
    "Pre-Wedding Shoot",
    "Birthday",
    "Event Coverage",
  ],
  "Food & Catering": [
    "Wedding Catering",
    "Birthday Party Catering",
    "Corporate Catering",
  ],
  "Banquet Hall & Mandap": [
    "Wedding Banquet Hall",
    "Ring Ceremony",
    "Birthday",
    "Anniversary",
  ],
  "Classical Music & Dance": [
    "Classical Vocal Performance",
    "Instrumental Performance",
    "Bharatanatyam Dance",
  ],
  "Islamic Maulbi": [
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
    "Wedding Ceremony",
    "Puja Ceremony",
    "Housewarming",
    "Naming Ceremony",
    "Shraddh Ceremony",
    "Special Event",
  ],
  "Beauty Makeover": ["Bridal Makeup", "Unisex", "Mehendi Artist"],
  "Floral Decor": [
    "Wedding Decor",
    "Stage & Backdrop Floral Decor",
    "Birthday Party Decor",
  ],
  "Ceremonial Ride": ["Bridal Car", "Luxury Car", "Classic Car"],
  Fireworks: ["Wedding Fireworks", "Indoor Fireworks", "Outdoor Fireworks"],
  "Card Design & Printing": [
    "Wedding Invitations",
    "Birthday Party Invitations",
    "Corporate Cards",
  ],
  "Magic Shows": [
    "Children’s Magic Shows",
    "Stage Magic Shows",
    "Close-Up Magic",
  ],
  "Event Management Company": [
    "Wedding Full-Service Planner",
    "Corporate Event Management",
    "Birthday Party Planner",
  ],
  "Balloon Decor": [
    "Birthday Balloon Decoration",
    "Theme-Based Balloon Decoration",
    "Baby Shower Balloon Decoration",
  ]
};

export const locationData = {
  Bhubaneswar: ["Saheed Nagar"],
  Cuttack: ["Badambadi"],
  Rourkela: ["Chhend Colony"],
  "Berhampur (Brahmapur)": ["Gandhinagar"],
  Sambalpur: ["Bareipali"],
  Puri: ["Swargadwar"],
  Balasore: ["Chandipur"],
  Bhadrak: ["Charampa"],
  "Balangir (Bolangir)": ["Titilagarh"],
  Angul: ["Nalco Nagar"],
  Bargarh: ["Attabira"],
  Jeypore: ["Vivekananda Marg"],
  Baripada: ["Bhanjpur"],
  Dhenkanal: ["Kunjakanta"],
  "Keonjhar (Kendujhar)": ["Naranpur"],
  Jharsuguda: ["Laikera"],
  "Jajpur / Jajpur-Town": ["Chandikhole"],
  "Jagatsinghpur / Jagatsinghpur-Town": ["Paradip"],
  Kendrapara: ["Aul"],
};

function Footer() {
  const [openSections, setOpenSections] = useState({
    contact: false,
    quick: false,
    company: false,
    privacy: false,
  });
  const [openCategory, setOpenCategory] = useState(null);
  const [openLocation, setOpenLocation] = useState(null);

  const toggleLocation = (location) => {
    setOpenLocation(openLocation === location ? null : location);
  };
  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section) => {
    if (isMobile) {
      setOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  return (
    <footer className="footer-enhanced">
      <div className="footer-top">
        <h3>Your one-stop platform for Booking Events effortlessly</h3>
        <p>EXPERIENCE EVENTSBIDGE APP ON MOBILE</p>
        <div className="app-buttons">
          <img
            decoding="async"
            loading="lazy"
            width={300} // actual width
            height={200} // actual height
            src="/App Store.webp"
            alt="App Store"
            className="cursor-pointer"
          />
          <img
            decoding="async"
            width={300} // actual width
            height={200} // actual height
            loading="lazy"
            src="/Google_Play.webp"
            alt="Google Play"
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="footer-columns-wrapper">
        <div className="footer-columns">
          <div>
            <h4>Contact</h4>
            <a
              href="mailto:Support@eventsbridge.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="hover:text-[#ffc107]">
                <img
                  decoding="async"
                  loading="lazy"
                  src="/gmail-40.webp"
                  srcSet="/gmail-40.webp 1x, /gmail-80.webp 2x"
                  height={16}
                  width={16}
                  alt="Email"
                  className="icon"
                />{" "}
                techsupport@eventsbridge.com
              </p>
            </a>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              {/* amrit */}
              <img
                decoding="async"
                loading="lazy"
                src="/phone-call-32.webp"
                srcSet="/phone-call-32.webp 1x, /phone-call-64.webp 2x"
                height={16}
                width={16}
                alt="Phone"
                className="icon"
              />{" "}
              <a href="tel:phone_number">+91 9348605002</a>
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              {/* abhijit */}
              <img
                decoding="async"
                loading="lazy"
                src="/phone-call-32.webp"
                srcSet="/phone-call-32.webp 1x, /phone-call-64.webp 2x"
                height={16}
                width={16}
                alt="Phone"
                className="icon"
              />{" "}
              <a href="tel:phone_number">+91 70089 12849</a>
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              <img
                decoding="async"
                loading="lazy"
                src="/placeholder-32.webp"
                srcSet="/placeholder-32.webp 1x, /placeholder-64.webp 2x"
                height={16}
                width={16}
                alt="Location"
                className="icon"
              />{" "}
              Bhubaneswar, Odisha
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p
              onClick={() => navigate("/approach")}
              className="hover:text-[#ffc107] cursor-pointer"
            >
              Our Approach
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/faqs")}
            >
              FAQs
            </p>
          </div>
          <div>
            <h4>Legal Information</h4>
            <p
              className="hover:text-[#ffc107]"
              onClick={() => navigate("/terms-and-conditions")}
            >
              Terms and Conditions
            </p>
            <p
              className="hover:text-[#ffc107]"
              onClick={() => navigate("/refund-policy")}
            >
              Refund Policy
            </p>
            <p
              className="hover:text-[#ffc107]"
              onClick={() => navigate("/privacy-policy")}
            >
              Privacy Policy
            </p>
          </div>
          <div className="w-full">
            <h4 className="text-xl font-semibold mb-4 text-white">
              Categories
            </h4>

            {/* SCROLLABLE WRAPPER FOR ALL CATEGORIES */}
            <div className="max-h-64 overflow-y-auto [scrollbar-width:none] pr-2">
              {Object.keys(categoriesData).map((categoryName) => (
                <div key={categoryName} className="mb-3">
                  {/* Category Title */}
                  <h5
                    onClick={() => {
                      toggleCategory(categoryName);
                    }}
                    className="flex justify-between items-center cursor-pointer text-white text-base py-2 border-b border-gray-700 hover:text-yellow-400 transition"
                  >
                    {categoryName}

                    <img
                      decoding="async"
                      loading="lazy"
                      src={
                        openCategory === categoryName
                          ? "/up-arrow.webp"
                          : "/down.webp"
                      }
                      className={`w-4 h-4 bg-blue-500 rounded-lg transition-transform duration-300 ${
                        openCategory === categoryName ? "rotate-180" : ""
                      }`}
                      alt="toggle"
                    />
                  </h5>

                  {/* Sub Categories */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openCategory === categoryName
                        ? "max-h-96 mt-2"
                        : "max-h-0 mt-0"
                    }`}
                  >
                    {categoriesData[categoryName].map((sub, index) => (
                      <p
                        key={index}
                        className="text-gray-300 text-sm py-1 pl-4 hover:text-yellow-400 cursor-pointer"
                      >
                        {sub}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/about_us")}
            >
              About Us
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/reviews")}
            >
              Awards & Reviews
            </p>
            <p className="hover:text-[#ffc107]">Services</p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              Help Desk
            </p>
          </div>
          <div className="w-full">
            <h4 className="text-xl font-semibold mb-4 text-white">
              Available Locations
            </h4>

            {/* SCROLLABLE WRAPPER FOR ALL CATEGORIES */}
            <div className="max-h-64 overflow-y-auto [scrollbar-width:none] pr-2">
              {Object.keys(locationData).map((locationName) => (
                <div key={locationName} className="mb-3">
                  {/* Category Title */}
                  <h5
                    onClick={() => {
                      toggleLocation(locationName);
                    }}
                    className="flex justify-between items-center cursor-pointer text-white text-base py-2 border-b border-gray-700 hover:text-yellow-400 transition"
                  >
                    {locationName}

                    <img
                      decoding="async"
                      loading="lazy"
                      src={
                        openLocation === locationName
                          ? "/up-arrow.webp"
                          : "/down.webp"
                      }
                      className={`w-4 h-4 bg-blue-500 rounded-lg transition-transform duration-300 ${
                        openLocation === locationName ? "rotate-180" : ""
                      }`}
                      alt="toggle"
                    />
                  </h5>

                  {/* Sub Categories */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openLocation === locationName
                        ? "max-h-96 mt-2"
                        : "max-h-0 mt-0"
                    }`}
                  >
                    {locationData[locationName].map((sub, index) => (
                      <p
                        key={index}
                        className="text-gray-300 text-sm py-1 pl-4 hover:text-yellow-400 cursor-pointer"
                      >
                        {sub}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="footer-columns-mobile-wrapper">
          <div className="footer-mobile-grid">
            {/* Left Column */}
            <div className="footer-mobile-column">
              <div className="">
                {/* MAIN TOGGLE FOR MOBILE */}
                <h4
                  onClick={() => toggleSection("category")}
                  className="flex pl-2 pr-[20px] box-border justify-between items-center text-[15px] font-bold text-white py-2 cursor-pointer "
                >
                  Categories
                  <img
                    decoding="async"
                    loading="lazy"
                    src={
                      openSections.category ? "/up-arrow.webp" : "/down.webp"
                    }
                    className={`w-4 h-4 bg-blue-500 rounded-lg transition-transform duration-300 ${
                      openSections.category ? "rotate-180" : ""
                    }`}
                    alt="toggle"
                  />
                </h4>

                {/* OUTER DROPDOWN CATEGORY LIST */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections.category ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  {Object.keys(categoriesData).map((categoryName) => (
                    <div key={categoryName} className="py-2">
                      {/* CATEGORY NAME */}
                      <h5
                        onClick={() => toggleCategory(categoryName)}
                        className="flex justify-between  items-center  text-white text-base py-2 cursor-pointer border-b border-gray-800"
                      >
                        {categoryName}

                        <img
                          decoding="async"
                          loading="lazy"
                          src={
                            openCategory === categoryName
                              ? "/up-arrow.webp"
                              : "/down.webp"
                          }
                          className={`w-4 h-4 bg-green-500 rounded-lg transition-transform duration-300 ${
                            openCategory === categoryName ? "rotate-180" : ""
                          }`}
                          alt="toggle"
                        />
                      </h5>

                      {/* SUBCATEGORY LIST */}
                      <div
                        className={`overflow-hidden transition-all duration-300 pl-4 ${
                          openCategory === categoryName
                            ? "max-h-[600px] py-1"
                            : "max-h-0"
                        }`}
                      >
                        {categoriesData[categoryName].map((sub, index) => (
                          <p
                            key={index}
                            className="text-white text-sm py-1 hover:text-yellow-400"
                          >
                            {sub}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="">
                {/* MAIN TOGGLE FOR MOBILE */}
                <h4
                  onClick={() => toggleSection("location")}
                  className="flex pl-2 pr-[20px] box-border justify-between items-center text-[15px] font-bold text-white py-2 cursor-pointer "
                >
                  Available Locations
                  <img
                    decoding="async"
                    loading="lazy"
                    src={
                      openSections.location ? "/up-arrow.webp" : "/down.webp"
                    }
                    className={`w-4 h-4 bg-blue-500 rounded-lg transition-transform duration-300 ${
                      openSections.location ? "rotate-180" : ""
                    }`}
                    alt="toggle"
                  />
                </h4>

                {/* OUTER DROPDOWN CATEGORY LIST */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections.location ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  {Object.keys(locationData).map((locationName) => (
                    <div key={locationName} className="mb-3">
                      {/* Category Title */}
                      <h5
                        onClick={() => {
                          toggleLocation(locationName);
                        }}
                        className="flex justify-between  items-center cursor-pointer text-white text-base py-2 border-b border-gray-700 hover:text-yellow-400 transition"
                      >
                        {locationName}

                        <img
                          decoding="async"
                          loading="lazy"
                          src={
                            openLocation === locationName
                              ? "/up-arrow.webp"
                              : "/down.webp"
                          }
                          className={`w-4 h-4 bg-green-500 rounded-lg transition-transform duration-300 ${
                            openLocation === locationName ? "rotate-180" : ""
                          }`}
                          alt="toggle"
                        />
                      </h5>

                      {/* Sub Categories */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openLocation === locationName
                            ? "max-h-96 mt-2"
                            : "max-h-0 mt-0"
                        }`}
                      >
                        {locationData[locationName].map((sub, index) => (
                          <p
                            key={index}
                            className="text-gray-300 pl-12 py-1 hover:text-yellow-400 cursor-pointer"
                          >
                            {sub}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("contact")}>
                  Contact Us
                  <img
                    decoding="async"
                    loading="lazy"
                    src={openSections.contact ? "/up-arrow.webp" : "/down.webp"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.contact ? "show" : ""
                  }`}
                >
                  <p>
                    <img
                      decoding="async"
                      loading="lazy"
                      src="/gmail-40.webp"
                      srcSet="/gmail-40.webp 1x, /gmail-80.webp 2x"
                      height={16}
                      width={16}
                      className="icon"
                      alt=""
                    />{" "}
                    techsupport@eventsbridge.com{" "}
                  </p>
                  <p>
                    <img
                      decoding="async"
                      loading="lazy"
                      src="/phone-call-32.webp"
                      srcSet="/phone-call-32.webp 1x, /phone-call-64.webp 2x"
                      height={16}
                      width={16}
                      className="icon"
                      alt=""
                    />{" "}
                    +91 1169320147
                  </p>
                  <p>
                    <img
                      decoding="async"
                      loading="lazy"
                      src="/placeholder-32.webp"
                      srcSet="/placeholder-32.webp 1x, /placeholder-64.webp 2x"
                      height={16}
                      width={16}
                      className="icon"
                      alt=""
                    />{" "}
                    Bhubaneswar, Odisha
                  </p>
                </div>
              </div>

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("company")}>
                  Company
                  <img
                    decoding="async"
                    loading="lazy"
                    src={openSections.company ? "/up-arrow.webp" : "/down.webp"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.company ? "show" : ""
                  }`}
                >
                  <p>About Us</p>
                  <p>Awards & Reviews</p>
                  <p>Services</p>
                  <p>Help Desk</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="footer-mobile-column">
              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("quick")}>
                  Quick Links
                  <img
                    decoding="async"
                    loading="lazy"
                    src={openSections.quick ? "/up-arrow.webp" : "/down.webp"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.quick ? "show" : ""
                  }`}
                >
                  <p onClick={() => navigate("/approach")}>Our Approach</p>
                  <p>FAQs</p>
                </div>
              </div>

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("privacy")}>
                  Legal Information
                  <img
                    decoding="async"
                    loading="lazy"
                    src={openSections.privacy ? "/up-arrow.webp" : "/down.webp"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.privacy ? "show" : ""
                  }`}
                >
                  <p
                    className="hover:text-[#ffc107]"
                    onClick={() => navigate("/terms-and-conditions")}
                  >
                    Terms and Conditions
                  </p>
                  <p
                    className="hover:text-[#ffc107]"
                    onClick={() => navigate("/refund-policy")}
                  >
                    Refund Policy
                  </p>
                  <p
                    className="hover:text-[#ffc107]"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="social-media-column">
        <h4>Follow Us</h4>
        <div className="social-media">
          <a
            href="https://www.facebook.com/profile.php?id=61578112702655"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="facebook-40.webp"
              srcSet="facebook-40.webp 1x, facebook-80.webp 2x"
              width="40"
              height="40"
              alt="Facebook"
              loading="lazy"
              decoding="async"
              className="social-icon"
            />
          </a>
          <a
            href="https://x.com/EVENTSBRID78581"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src="/twitter 1.webp"
              alt="X"
              className="social-icon"
            />
          </a>
          <a
            href="https://www.instagram.com/eventsbridge__?igsh=MWVmNXNscWlodGVxNA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={insta40}
              srcSet={`${insta40} 40w, ${insta80} 80w`}
              sizes="35px"
              width="40"
              height="40"
              alt="Instagram"
              loading="lazy"
              decoding="async"
              className="social-icon"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/eventsbridge-com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src="/linkedin-40.webp"
              srcSet="linkedin-40.webp 1x, linkedin-80.webp 2x"
              height={40}
              width={40}
              alt="LinkedIn"
              className="social-icon"
            />
          </a>
          <a
            href="mailto:Support@eventsbridge.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src="/gmail-40.webp"
              srcSet="/gmail-40.webp 1x, /gmail-80.webp 2x"
              height={40}
              width={40}
              alt="Gmail"
              className="social-icon"
            />
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={wa40}
              srcSet={`${wa40} 40w, ${wa80} 80w`}
              sizes="35px"
              width="40"
              height="40"
              alt="Whatsapp"
              decoding="async"
              loading="lazy"
              className="social-icon"
            />
          </a>
          <a
            href="https://youtube.com/@eventsbridge-k5y?si=UIIpVriO9ySmNW0R"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src="/youtube-40.webp"
              srcSet="/youtube-40.webp 1x, /youtube-80.webp 2x"
              alt="Youtube"
              height={40}
              width={40}
              className="social-icon"
            />
          </a>
        </div>
      </div>
      <div className="border-t border-white mt-4 mb-2 pt-4 lg:relative flex flex-row sm:flex-row  md:flex-row items-start md:items-center">
        {/* Startup Logo */}
        <div className="flex flex-col text-white items-center md:items-start lg:mt-[-20px] md:mb-0  md:mr-6">
          <img
            decoding="async"
            loading="lazy"
            fetchPriority="low"
            alt="Startup Logo"
            src={startup256}
            srcSet={`
    ${startup48} 48w,
    ${startup64} 64w,
    ${startup96} 96w,
    ${startup128} 128w,
    ${startup256} 256w
  `}
            sizes="
    (max-width: 640px) 64px,
    (max-width: 1024px) 96px,
    160px
  "
            width="256"
            height="256"
            className="m-auto w-16 lg:mt-[-20px] md:w-24 lg:w-40"
          />

          <p className="mt-0 lg:mt-[-60px] text-[10px] text-center md:text-left">
            EventsBridge a startup india recognized Company
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col m-auto mt-2 sm:mt-4 md:mt-8 lg:mt-2 text-center text-[12px] md:gap-2.5 lg:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
          <div>
            <span className="text-white m-auto ">🌐 India | English</span>
          </div>
          <div>
            <p className="text-white m-0 text-[10px]">
              © Copyright 2025 EventsBridge. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
