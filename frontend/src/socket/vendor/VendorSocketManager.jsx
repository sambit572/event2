import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "../socketClient.js";

const VendorSocketManager = () => {
  console.log("Inside <VendorSocketManager /> +++++++++++++");
  const vendorData = useSelector((state) => state.vendor.vendor);
  const isVendorLoggedIn =
    localStorage.getItem("VendorCurrentlyLoggedIn") === "true";

  useEffect(() => {
    if (!isVendorLoggedIn || !vendorData?._id) {
      console.log("Vendor not logged in or no vendor data available.");
      return;
    }

    const emitOnline = () => {
      console.log("Emitting vendor-online for:", vendorData._id);
      socket.emit("vendor-online", vendorData._id);
    };

    emitOnline(); // Emit immediately when vendor logs in
    socket.on("connect", emitOnline); // Re-emit on reconnect

    return () => {
      socket.off("connect", emitOnline);
    };
  }, [isVendorLoggedIn, vendorData?._id]);

  return null;
};

export default VendorSocketManager;
