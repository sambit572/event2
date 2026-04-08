// ProfileMenu.jsx
import { useRef } from "react";
import { CgProfile } from "react-icons/cg";
import UserProfileIcon from "./../../../pages/common/UserProfileIcon";

const ProfileMenu = ({
  userFirstName,
  currentUser,
  showProfileDropdown,
  setShowProfileDropdown,
  handleLoginClick,
  handleSignupClick,
  handleLogout,
  navigate,
  setShowVendorDropdown,
  setShowEllipsisDropdown,
}) => {
  const profileRef = useRef(null);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => {
      if (!prev) {
        setShowVendorDropdown(false);
        setShowEllipsisDropdown(false);
      }
      return !prev;
    });
  };

  return (
    <div
      ref={profileRef}
      className="relative flex items-center text-[15px] font-medium cursor-pointer"
    >
      {/* Profile trigger button */}
      <div
        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 
                   hover:bg-gradient-to-r hover:from-[#001f3f] hover:to-[#004080] hover:text-white"
      >
        <span
          className="flex items-center gap-2 max-[1024px]:text-[13px] max-[820px]:text-[12px] max-[640px]:text-[11px]"
          onClick={toggleProfileDropdown}
        >
          {!userFirstName ? (
            <>
              <CgProfile className="text-2xl text-[#001f3f] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              <span className="font-semibold hidden sm:inline md:hidden lg:inline group-hover:text-white transition-colors duration-300">
                Login
              </span>
            </>
          ) : (
            <>
              <UserProfileIcon currentUser={currentUser} />
              <span className="font-semibold hidden sm:inline group-hover:text-white transition-colors duration-300">
                {`Hi, ${userFirstName}`}
              </span>
            </>
          )}
        </span>
      </div>

      {/* Dropdown */}
      {showProfileDropdown && (
        <div
          className="absolute top-[62px] right-0 z-[2000] cursor-default"
          style={{
            width: "300px",
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "0.5px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {!userFirstName ? (
            /* ── Guest state ── */
            <div style={{ padding: "22px 18px 18px" }}>
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", color: "#999", textTransform: "uppercase", marginBottom: "12px" }}>
                My Account
              </p>
              <h4 style={{ fontSize: "17px", fontWeight: 700, color: "#0d1b2a", marginBottom: "5px" }}>Welcome</h4>
              <p style={{ fontSize: "12px", color: "#7a7a7a", marginBottom: "16px", lineHeight: 1.5 }}>
                Sign in to access your account and manage services.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={handleSignupClick}
                  style={{ width: "100%", background: "#001f3f", color: "#fff", border: "none", borderRadius: "12px", padding: "11px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Sign Up
                </button>
                <button
                  onClick={handleLoginClick}
                  style={{ width: "100%", background: "#fff", color: "#001f3f", border: "1px solid #d0d5dd", borderRadius: "12px", padding: "11px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  Login
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Gradient header ── */}
              <div style={{
                background: "linear-gradient(135deg, #001f3f 0%, #0057b7 100%)",
                padding: "18px 18px 14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                {/* Avatar */}
                <div style={{
                  width: "42px", height: "42px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid rgba(255,255,255,0.35)", flexShrink: 0,
                }}>
                  <UserProfileIcon currentUser={currentUser} />
                </div>

                {/* Name + status */}
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: 0 }}>{userFirstName}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "3px" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: 0 }}>Logged in</p>
                  </div>
                </div>

                {/* Badge */}
                <div style={{ marginLeft: "auto" }}>
                  <span style={{
                    fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.85)",
                    padding: "3px 8px", borderRadius: "20px",
                    border: "0.5px solid rgba(255,255,255,0.25)",
                  }}>
                    My Account
                  </span>
                </div>
              </div>

              {/* ── Menu items ── */}
              <div style={{ padding: "12px 12px 10px", display: "flex", flexDirection: "column", gap: "8px" }}>

                {/* My Profile - Hover effect added (background + opacity) */}
                <div
                  onClick={() => { setShowProfileDropdown(false); navigate("/profile"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: "#EBF3FF", border: "0.5px solid #B8D4F5",
                    borderRadius: "14px", padding: "11px 13px", cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.background = "#DAE9FF";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = "#EBF3FF";
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "#1a5fa8",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#0c3d78", margin: 0 }}>My Profile</p>
                    <p style={{ fontSize: "11px", color: "#4a7fb5", margin: "2px 0 0" }}>Edit name, photo & details</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7fb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* Wishlist - Hover effect added (background + opacity) */}
                <div
                  onClick={() => { setShowProfileDropdown(false); navigate("/wishlist"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: "#FFF0F4", border: "0.5px solid #F5C0D0",
                    borderRadius: "14px", padding: "11px 13px", cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.background = "#FFE4EF";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = "#FFF0F4";
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "#d63558",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#7a1a35", margin: 0 }}>Wishlist</p>
                    <p style={{ fontSize: "11px", color: "#b05070", margin: "2px 0 0" }}>Saved vendors & services</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b05070" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* Divider */}
                <div style={{ height: "0.5px", background: "#ebebeb", margin: "2px 0" }} />

                {/* Sign Out - Hover effect added (background + opacity) */}
                <div
                  onClick={handleLogout}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: "#FFF5F5", border: "0.5px solid #FECDCD",
                    borderRadius: "14px", padding: "11px 13px", cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.background = "#FFEAEA";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = "#FFF5F5";
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "#e53e3e",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#9b1c1c", margin: 0 }}>Sign Out</p>
                    <p style={{ fontSize: "11px", color: "#c05050", margin: "2px 0 0" }}>Log out of your account</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c05050" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

              </div>

              {/* Footer */}
              <div style={{ padding: "6px 16px 12px", textAlign: "center" }}>
                <p style={{ fontSize: "10px", color: "#bbb", margin: 0 }}>© 2025 · EventEase · All rights reserved</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;