// src/components/common/ThreeDot.jsx
import { useRef, useState, useEffect } from "react";
import { FaBars, FaCompass, FaMapMarkerAlt, FaCalendarAlt, FaShoppingCart, FaTimes, FaChevronRight } from "react-icons/fa";
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
    if (isMobile && showEllipsisDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, showEllipsisDropdown]);

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
        display: "flex", alignItems: "center", gap: "12px",
        padding: "10px 13px", borderRadius: "12px", cursor: "pointer",
        background: active ? "#fef3c7" : "#ffffff",
        border: active ? "1.5px solid #f5c518" : "1.5px solid #f0f0f0",
        marginBottom: "6px", transition: "all 0.15s ease",
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

  /* ── MOBILE: drops from top, covers 55% height ── */
  const mobilePanel = (
    <>
      {/* Backdrop — covers the bottom 45% */}
      <div
        onClick={() => setShowEllipsisDropdown(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(1.5px)",
          zIndex: 2998,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Panel — anchored to top, 55vh tall */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "55vh",
        background: "#f7f7f2",
        borderRadius: "0 0 24px 24px",
        zIndex: 2999,
        display: "flex", flexDirection: "column",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        animation: "slideDown 0.28s cubic-bezier(0.32,0.72,0,1)",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)",
          padding: "48px 20px 14px", /* top padding accounts for announcement bar + navbar */
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "7px",
              background: "#f5c518",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 900, color: "#001f3f",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>EB</div>
            <span style={{
              color: "#fff", fontWeight: 700, fontSize: "15px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Menu</span>
          </div>
          <div
            onClick={() => setShowEllipsisDropdown(false)}
            style={{
              width: "28px", height: "28px", borderRadius: "7px",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaTimes size={13} style={{ color: "#fff" }} />
          </div>
        </div>

        {/* Scrollable menu items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 20px" }}>

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

          <div style={{ margin: "10px 0 8px", borderTop: "1px solid #e5e5e5" }} />
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

          <div style={{ margin: "10px 0 8px", borderTop: "1px solid #e5e5e5" }} />
          <SectionLabel>More</SectionLabel>
          <MenuItem icon={<FcAbout />} iconBg="#f0f9ff" label="About Us" active={location.pathname === "/about_us"} onClick={() => go("/about_us")} />
          <MenuItem icon={<FcAssistant />} iconBg="#fff7ed" label="Help Us" active={location.pathname === "/help_us"} onClick={() => go("/help_us")} />
        </div>

        {/* Bottom pill handle */}
        <div style={{ padding: "8px 0 12px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{
            width: "40px", height: "4px", borderRadius: "99px",
            background: "#d1d5db",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to   { transform: translateY(0); }
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
