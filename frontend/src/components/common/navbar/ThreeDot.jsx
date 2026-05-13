// src/components/common/ThreeDot.jsx
import { useRef, useState, useEffect } from "react";
import { FaBars, FaCompass, FaMapMarkerAlt, FaCalendarAlt, FaShoppingCart, FaTimes, FaChevronRight } from "react-icons/fa";
import logoImg from "../../../assets/EventsBridgeOnlyLogo.png";
import { FcAbout, FcAssistant } from "react-icons/fc";
import { MdStorefront } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Explore",  icon: <FaCompass />,     color: "#3b82f6", bg: "#eff6ff", path: "/" },
  { label: "Venues",   icon: <FaMapMarkerAlt />, color: "#f43f5e", bg: "#fff1f2", path: "/venues" },
  { label: "Planners", icon: <FaCalendarAlt />,  color: "#22c55e", bg: "#f0fdf4", path: "/planners" },
];

const ThreeDot = ({
  showEllipsisDropdown,
  setShowEllipsisDropdown,
  setShowVendorDropdown,
  setShowProfileDropdown,
  VendorFirstName,
  cartCount,
  handleAddToCart,
  onOpenVendorLogin,
  vendorLogout,
}) => {
  const ellipsisRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  const toggle = () => {
    setShowEllipsisDropdown((prev) => {
      if (!prev) { setShowVendorDropdown(false); setShowProfileDropdown(false); }
      return !prev;
    });
  };

  const go = (path) => { navigate(path); setShowEllipsisDropdown(false); };

  const MenuItem = ({ icon, iconColor, iconBg, label, onClick, active, danger, badge }) => (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "8px 10px", borderRadius: "10px", cursor: "pointer",
        background: active ? "#fef3c7" : "#ffffff",
        border: active ? "1.5px solid #f5c518" : "1.5px solid #f0f0f0",
        marginBottom: "5px", transition: "all 0.15s ease",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f8f8f8"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? "#fef3c7" : "#ffffff"; }}
    >
      <div style={{
        width: "32px", height: "32px", borderRadius: "9px",
        background: active ? "#f5c518" : (iconBg || "#f3f4f6"),
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: "14px",
        color: active ? "#001f3f" : (iconColor || "#555"),
      }}>
        {icon}
      </div>
      <span style={{
        flex: 1, fontSize: "14px", fontWeight: 600,
        color: danger ? "#ef4444" : "#111827",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {label}
      </span>
      {badge > 0 && (
        <span style={{
          background: "#ef4444", color: "#fff", fontSize: "10px",
          fontWeight: 700, borderRadius: "999px", padding: "2px 7px",
        }}>{badge}</span>
      )}
      <FaChevronRight size={11} style={{ color: "#d1d5db", flexShrink: 0 }} />
    </div>
  );

  const SectionLabel = ({ children }) => (
    <p style={{
      fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "#9ca3af",
      padding: "2px 4px 6px", margin: 0,
    }}>{children}</p>
  );

  /* ── MOBILE: compact dropdown below navbar ── */
  const mobilePanel = (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowEllipsisDropdown(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.25)",
          zIndex: 2998,
          animation: "fadeIn 0.15s ease",
        }}
      />

      {/* Compact dropdown panel — anchored to top-right below navbar */}
      <div style={{
        position: "fixed",
        top: "94px",   /* below announcement bar (~30px) + navbar (~60px) */
        right: "12px",
        width: "230px",
        background: "#ffffff",
        borderRadius: "14px",
        zIndex: 2999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        border: "1px solid #eeeeee",
        animation: "fadeSlideDown 0.2s cubic-bezier(0.32,0.72,0,1)",
        overflow: "hidden",
      }}>

        {/* Compact header */}
        <div style={{
          background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)",
          padding: "10px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={logoImg} alt="EventsBridge" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Menu</span>
          </div>
          <div
            onClick={() => setShowEllipsisDropdown(false)}
            style={{
              width: "24px", height: "24px", borderRadius: "6px",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaTimes size={11} style={{ color: "#fff" }} />
          </div>
        </div>

        {/* Menu items */}
        <div style={{ padding: "10px 10px 12px" }}>
          <SectionLabel>Navigation</SectionLabel>
          {NAV_ITEMS.map((item) => (
            <MenuItem
              key={item.label}
              icon={item.icon}
              iconColor={item.color}
              iconBg={item.bg}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => go(item.path)}
            />
          ))}

          <div style={{ margin: "8px 0 6px", borderTop: "1px solid #f0f0f0" }} />
          <SectionLabel>Vendor</SectionLabel>
          {VendorFirstName ? (
            <>
              <MenuItem icon={<MdStorefront />} iconColor="#7c3aed" iconBg="#f5f3ff" label="My Dashboard" onClick={() => go("/vendor/dashboard")} />
              <MenuItem icon={<MdStorefront />} iconColor="#ef4444" iconBg="#fff5f5" label="Vendor Logout" danger onClick={() => { vendorLogout?.(); setShowEllipsisDropdown(false); }} />
            </>
          ) : (
            <MenuItem icon={<MdStorefront />} iconColor="#7c3aed" iconBg="#f5f3ff" label="Be a Vendor" onClick={() => { onOpenVendorLogin?.(); setShowEllipsisDropdown(false); }} />
          )}
          <MenuItem icon={<FaShoppingCart />} iconColor="#001f3f" iconBg="#f0f4ff" label="Cart" badge={cartCount} onClick={() => { handleAddToCart?.(); setShowEllipsisDropdown(false); }} />

          <div style={{ margin: "8px 0 6px", borderTop: "1px solid #f0f0f0" }} />
          <SectionLabel>More</SectionLabel>
          <MenuItem icon={<FcAbout />} iconBg="#f0f9ff" label="About Us" active={location.pathname === "/about_us"} onClick={() => go("/about_us")} />
          <MenuItem icon={<FcAssistant />} iconBg="#fff7ed" label="Help Us" active={location.pathname === "/help_us"} onClick={() => go("/help_us")} />
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );

  /* ── DESKTOP: small dropdown ── */
  const desktopDropdown = (
    <div style={{
      position: "absolute", top: "75px", right: "5px",
      background: "#e5e5de", borderRadius: "12px",
      border: "1px solid #001f3f",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      padding: "10px", width: "210px", zIndex: 2000,
    }}>
      <MenuItem icon={<FcAbout />} iconBg="#f0f9ff" label="About Us" active={location.pathname === "/about_us"} onClick={() => go("/about_us")} />
      <MenuItem icon={<FcAssistant />} iconBg="#fff7ed" label="Help Us" active={location.pathname === "/help_us"} onClick={() => go("/help_us")} />
    </div>
  );

  return (
    <div ref={ellipsisRef} className="flex items-center cursor-pointer text-[15px] font-medium ml-2 mr-2">
      <FaBars size={20} className="text-[#001f3f]" onClick={toggle} />
      {isMobile  && showEllipsisDropdown && mobilePanel}
      {!isMobile && showEllipsisDropdown && desktopDropdown}
    </div>
  );
};

export default ThreeDot;
