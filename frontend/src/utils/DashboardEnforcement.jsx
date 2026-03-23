import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function DashboardEnforcement({ children, onOpenVendorLogin }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 🔑 Get current path

  useEffect(() => {
    const checkVendorStatus = async () => {
      console.log("🔍 Checking vendor registration status...");

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/currentStep-status`,
          {
            withCredentials: true,
            params: {
              currentPath: location.pathname, // ⬅️ send current route
            },
          }
        );

        console.log("✅ Vendor status response:", data);

        if (data.incomplete) {
          console.warn(
            `⚠️ Vendor registration incomplete. Redirecting to: ${data.redirectTo}`
          );
          navigate(data.redirectTo);
        } else {
          console.log("🎉 Vendor registration complete. Access granted.");
          setAllowed(true);
        }
      } catch (error) {
        console.error("❌ Error during vendor status check:", error);
        onOpenVendorLogin();
        navigate("/");
      } finally {
        console.log("🔁 Finished vendor status check");
        setLoading(false);
      }
    };

    checkVendorStatus();
  }, [navigate, location]);

  if (loading) {
    console.log("⏳ Loading state active...");
    return <div>Loading dashboard...</div>;
  }

  console.log("🟢 Rendering dashboard content...");
  return allowed ? <>{children}</> : null;
}

export default DashboardEnforcement;
