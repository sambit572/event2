import React, { useState, useEffect } from "react";
import "./Footer.css";
import { Navigate, useNavigate } from "react-router-dom";
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
  ],
};

function Footer() {
  const [openSections, setOpenSections] = useState({
    contact: false,
    quick: false,
    company: false,
    privacy: false,
  });
  const [openCategory, setOpenCategory] = useState(null);

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
            src="/App Store.png"
            alt="App Store"
            className="cursor-pointer"
          />
          <img
            src="/Google_Play.png"
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
                <img src="/gmail.png" alt="Email" className="icon" />{" "}
                techsupport@eventsbridge.com
              </p>
            </a>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              {/* amrit */}
              <img src="/phone-call.png" alt="Phone" className="icon" />{" "}
              <a href="tel:phone_number">+91 9348605002</a>
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              {/* abhijit */}
              <img src="/phone-call.png" alt="Phone" className="icon" />{" "}
              <a href="tel:phone_number">+91 70089 12849</a>
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              <img src="/placeholder.png" alt="Location" className="icon" />{" "}
              Bhubaneswar, Odisha
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p className="hover:text-[#ffc107] cursor-pointer">Our Approach</p>
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
                    <span
                      onClick={navigate(`/category/${categoryName}`, {
                        state: { categoryName }, // ✅ pass full category object
                      })}
                    >
                      {categoryName}
                    </span>

                    <img
                      src={
                        openCategory === categoryName
                          ? "/up-arrow.png"
                          : "/down.png"
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
                    src={openSections.category ? "/up-arrow.png" : "/down.png"}
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
                        className="flex justify-between items-center  text-white text-base py-2 cursor-pointer border-b border-gray-800"
                      >
                        {categoryName}

                        <img
                          src={
                            openCategory === categoryName
                              ? "/up-arrow.png"
                              : "/down.png"
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

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("contact")}>
                  Contact Us
                  <img
                    src={openSections.contact ? "/up-arrow.png" : "/down.png"}
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
                    <img src="/gmail.png" className="icon" alt="" />{" "}
                    techsupport@eventsbridge.com{" "}
                  </p>
                  <p>
                    <img src="/phone-call.png" className="icon" alt="" /> +91
                    1169320147
                  </p>
                  <p>
                    <img src="/placeholder.png" className="icon" alt="" />{" "}
                    Bhubaneswar, Odisha
                  </p>
                </div>
              </div>

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("company")}>
                  Company
                  <img
                    src={openSections.company ? "/up-arrow.png" : "/down.png"}
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
                    src={openSections.quick ? "/up-arrow.png" : "/down.png"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.quick ? "show" : ""
                  }`}
                >
                  <p>Our Approach</p>
                  <p>FAQs</p>
                </div>
              </div>

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("privacy")}>
                  Legal Information
                  <img
                    src={openSections.privacy ? "/up-arrow.png" : "/down.png"}
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
            <img src="/facebook.png" alt="Facebook" className="social-icon" />
          </a>
          <a
            href="https://x.com/EVENTSBRID78581"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/twitter 1.png" alt="X" className="social-icon" />
          </a>
          <a
            href="https://www.instagram.com/eventsbridge__?igsh=MWVmNXNscWlodGVxNA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/instagram.png" alt="Instagram" className="social-icon" />
          </a>
          <a
            href="https://www.linkedin.com/company/eventsbridge-com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
          </a>
          <a
            href="mailto:Support@eventsbridge.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/gmail.png" alt="Gmail" className="social-icon" />
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/whatsapp.png" alt="Whatsapp" className="social-icon" />
          </a>
          <a
            href="https://youtube.com/@eventsbridge-k5y?si=UIIpVriO9ySmNW0R"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/youtube.png" alt="Youtube" className="social-icon" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          <span>🌐 India | English</span>
        </div>
        <div>
          <p>© Copyright 2025 EventsBridge. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
