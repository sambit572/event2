import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constant.js";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import VendorCalendar from "../../components/common/VendorCalendar.jsx";
import { fetchBookedDates } from "./../../utils/calendarApi";
// Data objects (stateDistricts, districtCities, aliases) remain the same...
const stateDistricts = {
  Odisha: [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Debagarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghpur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundargarh",
  ],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Maharashtra: ["Mumbai Suburban", "Pune", "Nagpur"],
  Karnataka: ["Bangalore Urban", "Mysuru"],
  TamilNadu: ["Chennai", "Coimbatore"],
  UttarPradesh: ["Lucknow", "Kanpur"],
};

const districtCities = {
  Angul: ["Angul", "Talcher", "Athmallik", "Dera Colony"],
  Balangir: ["Balangir", "Patnagarh", "Titlagarh"],
  Balasore: ["Balasore", "Jaleswar", "Nilagiri", "Remuna", "Soro"],
  Bargarh: ["Bargarh", "Kantabanji", "Sohela", "Barpali"],
  Bhadrak: ["Bhadrak", "Dhamnagar", "Basudebpur", "Erei"],
  Boudh: ["Boudh"],
  Cuttack: [
    "Cuttack",
    "Choudwar",
    "Athagad",
    "Banki",
    "Charibatia",
    "Dadhapatna",
    "Kanheipur",
    "Nuapatna",
    "Ramgarh",
  ],
  Debagarh: ["Debagarh"],
  Dhenkanal: ["Dhenkanal", "Indipur", "Bhuban", "Kamakshyanagar"],
  Gajapati: ["Paralakhemundi", "Kashinagar"],
  Ganjam: [
    "Brahmapur",
    "Chhatrapur",
    "Bhanjanagar",
    "Digapahandi",
    "Surada",
    "Polasara",
    "Kabisuryanagar",
    "Hinjilicut",
    "Buguda",
    "Purusottampur",
    "Chikiti",
    "Sheragada",
    "Rambha",
  ],
  Jagatsinghpur: ["Jagatsinghpur", "Paradip"],
  Jajpur: ["Jajpur", "Byasanagar", "Brahmabarada", "Sayadpur", "Kalarangiata"],
  Jharsuguda: ["Jharsuguda", "Belpahar", "Brajarajnagar", "Bundia"],
  Kalahandi: ["Bhawanipatna", "Junagarh", "Kesinga"],
  Kandhamal: ["Phulabani", "G. Udayagiri", "Daringbadi"],
  Kendrapara: ["Kendrapara", "Pattamundai"],
  Kendujhar: ["Kendujhar", "Joda", "Champua", "Jhumpura", "Barbil", "Jajanga"],
  Khordha: [
    "Bhubaneswar",
    "Cuttack [sic]",
    "Jatani",
    "Khordha",
    "Balugaon",
    "Banapur",
    "Bolagarh",
    "Dungamal",
    "Tangi",
  ],
  Koraput: [
    "Koraput",
    "Jeypore",
    "Sunabeda",
    "Kotpad",
    "Nabarangapur",
    "Damanjodi",
  ],
  Malkangiri: ["Malkangiri"],
  Mayurbhanj: ["Baripada", "Rairangpur", "Jashipur", "Udala"],
  Nabarangpur: ["Nabarangpur", "Papadahandi", "Raikela"],
  Nayagarh: ["Nayagarh", "Chandapur", "Rajasunakhala", "Khandapada"],
  Nuapada: ["Nuapada", "Khariar", "Khariar Road"],
  Puri: ["Puri", "Konark", "Pipili", "Satpada", "Gop", "Nimapada"],
  Rayagada: ["Rayagada", "Gunupur", "Bissam Cuttack", "Tikarpada", "Chandili"],
  Sambalpur: [
    "Sambalpur",
    "Rourkela",
    "Burla",
    "Hirakud",
    "Rajgangpur",
    "Kochinda",
  ],
  Subarnapur: ["Sonepur", "Binika", "Tarbha", "Subalaya"],
  Sundargarh: [
    "Sundargarh",
    "Rourkela",
    "Biramitrapur",
    "Koida",
    "Tensa",
    "Panposh",
  ],
  Ahmedabad: [
    "Ahmedabad",
    "Cantonment",
    "Bavla",
    "Bopal",
    "Dhandhuka",
    "Dholka",
    "Sanand",
    "Viramgam",
    "Bareja",
    "Bapunagar",
    "Mirzapur",
    "Ghodasar",
    "Chandkheda",
    "Nikol",
    "Motera",
    "Isanpur",
    "Juhapura",
    "Naroda",
    "Vastral",
  ],
  Surat: ["Surat", "Navsari", "Bardoli", "Valsad", "Kadodara", "Ankleshwar"],
  Vadodara: ["Vadodara", "Padra", "Dabhoi"],
  "Mumbai Suburban": [
    "Andheri",
    "Bandra",
    "Borivali",
    "Pimpri",
    "Wakad",
    "Baner",
    "Hinjewadi",
    "Kharadi",
    "Viman Nagar",
    "Navi Mumbai",
  ],
  Pune: [
    "Pune",
    "Pimpri-Chinchwad",
    "Chinchwad",
    "Dehu Road",
    "Kirkee",
    "Lonavla",
    "Talegaon Dabhade",
    "Alandi",
    "Jejuri",
    "Bhor",
    "Baramati",
    "Daund",
    "Indapur",
    "Junnar",
    "Shirur",
    "Saswad",
    "Uruli Kanchan",
    "Pirangut",
  ],
  Nagpur: ["Nagpur", "Sitabuldi", "Hingna"],
  "Bangalore Urban": ["Bangalore", "Yelahanka", "Electronic City"],
  Mysuru: ["Mysuru", "Nanjangud", "Hunsur"],
  Chennai: ["Chennai", "Tambaram", "Anna Nagar"],
  Coimbatore: ["Coimbatore", "Pollachi", "Mettupalayam"],
  Lucknow: ["Lucknow", "Gomti Nagar", "Alambagh"],
  Kanpur: ["Kanpur", "Kalyanpur", "Kidwai Nagar"],
};

const stateAliases = {
  Odisha: ["OR", "OD", "Orissa"],
  Gujarat: ["GJ"],
  Maharashtra: ["MH"],
  Karnataka: ["KA"],
  TamilNadu: ["TN", "Tamil Nadu"],
  UttarPradesh: ["UP", "Uttar Pradesh"],
};
const districtAliases = {
  Khordha: ["Khurda"],
  Cuttack: ["Kattak"],
  "Mumbai Suburban": ["Mumbai", "Greater Mumbai"],
  "Bangalore Urban": ["Bengaluru Urban", "Bengaluru", "Bangalore"],
};
const cityAliases = {
  Bhubaneswar: ["BBSR"],
  Mumbai: ["Bombay"],
  Bangalore: ["Bengaluru"],
  Mysuru: ["Mysore"],
  Chennai: ["Madras"],
};

const FormField = ({
  id,
  label,
  children,
  useStaticLabel = false,
  placeholder = "",
}) => {
  const isSelect = children.type === "select";

  const commonInputClasses =
    "w-full px-2 py-2 rounded-xl border border-slate-400 text-base text-gray-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none";

  if (useStaticLabel) {
    return (
      <div>
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        {React.cloneElement(children, {
          id: id,
          className: commonInputClasses,
          placeholder: placeholder,
        })}
      </div>
    );
  }

  // These classes position the label inside the input/select when it's empty OR disabled
  const unfocusedClasses = isSelect
    ? "peer-invalid:text-gray-500 peer-invalid:top-3 peer-invalid:text-sm peer-invalid:left-4 peer-disabled:text-gray-500 peer-disabled:top-3 peer-disabled:text-sm peer-disabled:left-4 peer-disabled:bg-[#e9ecef]"
    : "peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:left-4";

  return (
    <div className="relative">
      {React.cloneElement(children, {
        id: id,
        className: `peer transition-all duration-300 ease-in-out placeholder-transparent disabled:bg-[#e9ecef] disabled:cursor-not-allowed ${commonInputClasses} ${
          isSelect ? "appearance-none pr-10" : ""
        }`,
        placeholder: label,
      })}
      <label
        htmlFor={id}
        className={`absolute left-2.5 -top-2.5 px-1 bg-white text-xs text-indigo-500 font-medium tracking-wider capitalize transition-all duration-300 ease-in-out pointer-events-none peer-focus:-top-2.5 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-indigo-500 ${unfocusedClasses}`}
      >
        {label}
      </label>
      {isSelect && (
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

const UserDetails = () => {
  const userId = useSelector((state) => state.user.user?._id);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const { serviceId } = useParams();

  // NEW: State for calendar logic
  const [disabledDays, setDisabledDays] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

  console.log("User from Redux:", user);

  const [formData, setFormData] = useState({
    serviceId: "",
    bookedBy: "",
    bookedById: userId,
    phone: user?.phoneNo || "",
    altPhone: "",
    startDate: "",
    endDate: "",
    address: "",
    landmark: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    setUserName((prevUserName) => {
      return prevUserName === "" ? user?.fullName || "" : prevUserName;
    });

    setFormData((prevData) => {
      const newPhone =
        prevData.phone === "" ? user?.phoneNo || "" : prevData.phone;

      return {
        ...prevData,
        bookedById: userId,
        phone: newPhone,
      };
    });
  }, [user, userId]);
  const getCombinedAvailability = useCallback(async (services) => {
    setIsLoadingAvailability(true);
    try {
      const vendorIds = [
        ...new Set(services.map((s) => s.vendor).filter(Boolean)),
      ];
      if (vendorIds.length === 0) {
        setIsLoadingAvailability(false);
        return;
      }

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const promises = vendorIds.map((vid) =>
        fetchBookedDates(vid, currentMonth, currentYear)
      );
      const results = await Promise.all(promises);

      const allBookedDates = new Set();
      results.forEach((result) => {
        result.bookedDates.forEach((dateStr) => allBookedDates.add(dateStr));
      });

      const disabledDateObjects = [...allBookedDates].map(
        (d) => new Date(d + "T12:00:00Z")
      );
      setDisabledDays(disabledDateObjects);
    } catch (error) {
      toast.error("Could not load vendor availability.");
    } finally {
      setIsLoadingAvailability(false);
    }
  }, []);
  const locationPath = useLocation();
  const from = locationPath.state?.from || "/";

  console.log("pathname", from);

  useEffect(() => {
    const fetchInitialData = async () => {
      let servicesToBook = [];
      let serviceIdsForForm = [];

      try {
        if (serviceId) {
          console.log("Fetching single service:", serviceId);

          // check this below
          const { data } = await axios.get(
            `${BACKEND_URL}/common/service/${serviceId}`
          );

          console.log("Single service response:", data);
          if (data.success && data.service) {
            servicesToBook.push(data.service);
            serviceIdsForForm = data.service._id;
          } else {
            toast.error(data.message || "Service not found.");
          }
        } else {
          console.log("Fetching cart services");

          const { data } = await axios.get(`${BACKEND_URL}/cart`, {
            withCredentials: true,
          });
          console.log("Cart response:", data);

          if (data.data) {
            servicesToBook = data.data.map((item) => item.serviceId);
            serviceIdsForForm = servicesToBook.map((s) => s._id);
          }
        }
        console.log("Final servies to book:", servicesToBook);

        if (servicesToBook.length > 0) {
          setFormData((prev) => ({ ...prev, serviceId: serviceIdsForForm }));
          getCombinedAvailability(servicesToBook);
        } else {
          toast.error("No services found to book.");
          setIsLoadingAvailability(false);
        }
      } catch (err) {
        console.log("Error in fetchInitialData:", err);

        toast.error("Failed to load service or cart data.");
        setIsLoadingAvailability(false);
      }
    };
    if (userId) fetchInitialData();
  }, [serviceId, userId, getCombinedAvailability]);

  const handleDateSelect = ({ startDate, endDate }) => {
    const formatDateToNoonUTC = (date) => {
      if (!date) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}T12:00:00.000Z`;
    };

    setFormData((prev) => ({
      ...prev,
      startDate: startDate ? formatDateToNoonUTC(startDate) : "",
      endDate: endDate ? formatDateToNoonUTC(endDate) : "",
    }));
  };

  const findStateMatch = (stateName) => {
    const stateKeys = Object.keys(stateDistricts);
    if (stateKeys.includes(stateName)) return stateName;
    for (const [state, aliases] of Object.entries(stateAliases)) {
      if (
        aliases.some(
          (alias) =>
            alias.toLowerCase() === stateName.toLowerCase() ||
            stateName.toLowerCase().includes(alias.toLowerCase())
        )
      )
        return state;
    }
    return (
      stateKeys.find(
        (key) =>
          key.toLowerCase().includes(stateName.toLowerCase()) ||
          stateName.toLowerCase().includes(key.toLowerCase())
      ) || ""
    );
  };

  const findDistrictMatch = (districtName, selectedState) => {
    if (!selectedState || !stateDistricts[selectedState]) return "";
    const districts = stateDistricts[selectedState];
    if (districts.includes(districtName)) return districtName;
    for (const [district, aliases] of Object.entries(districtAliases)) {
      if (
        districts.includes(district) &&
        aliases.some(
          (alias) => alias.toLowerCase() === districtName.toLowerCase()
        )
      )
        return district;
    }
    return (
      districts.find(
        (d) =>
          d.toLowerCase().includes(districtName.toLowerCase()) ||
          districtName.toLowerCase().includes(d.toLowerCase())
      ) || ""
    );
  };

  const findCityMatch = (cityName, selectedDistrict) => {
    if (!selectedDistrict || !districtCities[selectedDistrict]) return "";
    const cities = districtCities[selectedDistrict];
    if (cities.includes(cityName)) return cityName;
    for (const [city, aliases] of Object.entries(cityAliases)) {
      if (
        cities.includes(city) &&
        aliases.some((alias) => alias.toLowerCase() === cityName.toLowerCase())
      )
        return city;
    }
    return (
      cities.find(
        (c) =>
          c.toLowerCase().includes(cityName.toLowerCase()) ||
          cityName.toLowerCase().includes(c.toLowerCase())
      ) || ""
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode") {
      if (/^\d{0,6}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }
    if (name === "userName") {
      setUserName(value);
    } else if (name === "state") {
      setFormData((prevData) => ({
        ...prevData,
        state: value,
        district: "",
        city: "",
      }));
    } else if (name === "district") {
      setFormData((prevData) => ({ ...prevData, district: value, city: "" }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const createBookingHistory = async (userDetailsId, preparedFormData) => {
    const payload = {
      userId: userId,
      userDetailsId: userDetailsId,
      location: preparedFormData.address,
      startDate: new Date(preparedFormData.startDate),
      endDate: new Date(preparedFormData.endDate),
      amount: 0,
      reDirectTo: 1,
    };

    console.log("Creating booking history with payload:", payload);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/user-bookings/create`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        console.log("✅ Booking history created successfully:", res.data);
        return true;
      } else {
        throw new Error("Failed to create booking history");
      }
    } catch (error) {
      console.error("❌ Error creating booking history:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select a valid date range from the calendar.");
      return;
    }
    try {
      // Attach user info safely
      const preparedFormData = {
        ...formData,
        bookedById: userId,
        bookedBy: userName.trim() || "Anonymous User",
      };

      const missingFields = Object.keys(preparedFormData).filter((field) => {
        const value = preparedFormData[field];
        if (value === undefined || value === null) return true;

        if (Array.isArray(value)) return value.length === 0;

        if (typeof value === "string") return value.trim() === "";

        return false;
      });

      if (missingFields.length > 0) {
        alert(
          `Please fill in all required fields: ${missingFields.join(", ")}.`
        );
        return;
      }

      // Pincode validation
      if (!/^\d{6}$/.test(preparedFormData.pincode)) {
        alert("Pincode must be exactly 6 digits.");
        return;
      }

      // Phone validation
      let phone = preparedFormData.phone || "";
      phone = phone.trim().replace(/\s+/g, "").replace(/^\+91/, "");

      if (!/^\d{10}$/.test(phone)) {
        alert("Phone must be exactly 10 digits.");
        return;
      }

      preparedFormData.phone = phone;
      if (
        preparedFormData.altPhone &&
        !/^\d{10}$/.test(preparedFormData.altPhone)
      ) {
        alert("Alternate phone must be exactly 10 digits.");
        return;
      }

      if (preparedFormData.altPhone === preparedFormData.phone) {
        alert("Alternate phone cannot be the same as primary phone.");
        return;
      }

      // Call backend
      const response = await axios.post(
        `${BACKEND_URL}/user/save-details`,
        { formData: preparedFormData },
        { withCredentials: true }
      );

      const userDetailsId = response?.data?.data?._id;

      if (!userDetailsId) {
        throw new Error("Unexpected response from server.");
      }

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      const bookingHistory = await createBookingHistory(
        userDetailsId,
        preparedFormData
      );

      console.log("Booking history response:", bookingHistory);

      if (bookingHistory) {
        navigate(`/pop-up/${userDetailsId}`);
      }
    } catch (err) {
      console.error("Error saving details:", err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
    // alert("Cancelled");
  };

  const handleUseCurrentAddress = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    if (!import.meta.env.VITE_GOOGLE_API_KEY) {
      alert("Google API key is not configured.");
      console.error("VITE_GOOGLE_API_KEY is not set in environment variables");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
              params: {
                latlng: `${latitude},${longitude}`,
                key: import.meta.env.VITE_GOOGLE_API_KEY,
              },
            }
          );
          if (data.status === "OK" && data.results.length > 0) {
            const result = data.results[0];
            const addressComponents = result.address_components;
            let premise = "",
              streetNumber = "",
              route = "",
              neighborhood = "",
              sublocality = "";
            let locality = "",
              district_level_2 = "",
              district_level_3 = "",
              state = "";
            let pincode = "",
              country = "";
            for (let comp of addressComponents) {
              const types = comp.types;
              const longName = comp.long_name;
              const shortName = comp.short_name;
              if (types.includes("premise")) premise = longName;
              if (types.includes("street_number")) streetNumber = longName;
              if (types.includes("route")) route = longName;
              if (types.includes("neighborhood")) neighborhood = longName;
              if (
                types.includes("sublocality") ||
                types.includes("sublocality_level_1")
              )
                sublocality = longName;
              if (types.includes("locality")) locality = longName;
              if (types.includes("administrative_area_level_2"))
                district_level_2 = longName;
              if (types.includes("administrative_area_level_3"))
                district_level_3 = longName;
              if (types.includes("administrative_area_level_1"))
                state = shortName;
              if (types.includes("postal_code")) pincode = longName;
              if (types.includes("country")) country = longName;
            }
            const addressParts = new Set();
            if (premise || streetNumber)
              addressParts.add(premise || streetNumber);
            if (route) addressParts.add(route);
            if (neighborhood) addressParts.add(neighborhood);
            if (sublocality) addressParts.add(sublocality);
            if (locality) addressParts.add(locality);
            const completeAddress = [...addressParts].join(", ");
            const matchedState = findStateMatch(state);
            let matchedDistrict =
              findDistrictMatch(district_level_2, matchedState) ||
              findDistrictMatch(district_level_3, matchedState) ||
              findDistrictMatch(locality, matchedState);
            const matchedCity = findCityMatch(locality, matchedDistrict);
            setFormData((prevData) => ({
              ...prevData,
              address: completeAddress.trim(),
              state: matchedState || "",
              district: matchedDistrict || "",
              city: matchedCity || "",
              pincode: pincode,
              country: country || "India",
            }));
            setLocationMessage(
              "Location auto-filled. Please verify the address."
            );
            const matchInfo = [];
            if (!matchedState) matchInfo.push("state");
            if (!matchedDistrict) matchInfo.push("district");
            if (!matchedCity) matchInfo.push("city");
            if (matchInfo.length > 0) {
              alert(
                `Location fetched! Note: Could not auto-select ${matchInfo.join(
                  ", "
                )}. Please select manually.`
              );
            } else {
              alert("Location fetched successfully!");
            }
          } else {
            console.error("Geocoding failed:", data.status);
            alert("Could not get address. Please try again.");
          }
        } catch (err) {
          console.error("Geocode error:", err);
          alert(
            "Error fetching location. Please check your internet connection."
          );
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Failed to get location. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Unknown error occurred.";
            break;
        }
        alert(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <div className="font-sans px-4">
      <div className="max-w-2xl p-4 mx-auto my-20 text-gray-800 bg-[#fff] rounded-2xl border-[3px] border-[#001F3F] shadow-[0_8px_32px_rgba(31,38,135,0.2)] backdrop-blur-lg">
        <h3 className="mb-[-10px] text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-[#004989] to-[#001F3F] bg-clip-text text-transparent">
          Fill Out Your Event Details
        </h3>
        <div className="mx-auto mt-3.5 h-1 w-48 rounded-full bg-gradient-to-r from-[#004989] to-[#001F3F]"></div>
        <form className="flex flex-col gap-5 mt-6" onSubmit={handleSave}>
          <FormField id="userName" label="User Name">
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={handleChange}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="phone" label="Phone Number">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField id="altPhone" label="Alternate Number">
              <input
                type="tel"
                name="altPhone"
                value={formData.altPhone}
                onChange={handleChange}
                required
              />
            </FormField>
          </div>

          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="startDate"
              label="Start Date"
              useStaticLabel={true}
              placeholder="dd/mm/yyyy"
            >
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField
              id="endDate"
              label="End Date"
              useStaticLabel={true}
              placeholder="dd/mm/yyyy"
            >
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </FormField>
          </div> */}
          <div className="mt-4">
            <label className="block mb-2 text-lg font-semibold text-center text-gray-800">
              Select Event Dates
            </label>
            {isLoadingAvailability ? (
              <div className="text-center p-8 bg-gray-100 w-full rounded-lg animate-pulse">
                Checking availability for all vendors...
              </div>
            ) : (
              <VendorCalendar
                disabledDays={disabledDays}
                onDateSelect={handleDateSelect}
              />
            )}
          </div>
          {/* VVV CORRECTED ADDRESS FIELD STRUCTURE VVV */}
          <div>
            <div className="relative">
              <FormField id="address" label="Event Address">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </FormField>
              <button
                type="button"
                onClick={handleUseCurrentAddress}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-300 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-sm"
                title="Use Current Location"
              >
                📍
              </button>
            </div>
            {locationMessage && (
              <small className="block mt-1 text-blue-600">
                {locationMessage}
              </small>
            )}
          </div>

          <FormField id="landmark" label="Landmark">
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="state" label="State">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                <option value="Odisha">Odisha</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="TamilNadu">Tamil Nadu</option>
                <option value="UttarPradesh">Uttar Pradesh</option>
              </select>
            </FormField>
            <FormField id="district" label="District">
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.state}
              >
                <option value=""></option>
                {stateDistricts[formData.state]?.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="city" label="City">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={!formData.district}
              >
                <option value=""></option>
                {districtCities[formData.district]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="pincode" label="Pincode">
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </FormField>
          </div>

          {/* --- CHANGES APPLIED HERE --- */}
          <div className="flex flex-col justify-center gap-3.5 mt-2.5 md:flex-row">
            <button
              type="submit"
              className="w-full px-5 py-3 text-base font-semibold tracking-wider text-white uppercase transition-transform duration-200 ease-in-out bg-[#7f00ff] rounded-lg cursor-pointer hover:shadow-[0_6px_15px_rgba(127,0,255,0.4)] md:w-36"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="w-full px-5 py-3 font-semibold tracking-wider text-white uppercase bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg cursor-pointer hover:shadow-lg md:w-36  hover:from-red-600 hover:to-red-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {showPopup && (
            <div className="px-5 py-4 mt-5 text-base text-center text-green-800 bg-gradient-to-r from-green-100 to-green-200 border-l-[6px] border-l-green-500 rounded-xl animate-fadeIn">
              <strong className="block text-lg font-bold">{userName},</strong>
              <p className="mt-1 text-sm text-black">
                Your User Details Saved Successfully!
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default UserDetails;
