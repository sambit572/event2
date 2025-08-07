import React, { useEffect, useState } from "react";
import axios from "axios";
// The import for "./UserDetails.css" is no longer needed.

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
    "Berhampur",
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

// A reusable component for the floating label input fields
const FormField = ({ id, label, children }) => (
  <div className="relative mt-2.5">
    {React.cloneElement(children, {
      id: id,
      className: `peer w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base text-gray-800 font-medium transition-all duration-300 ease-in-out placeholder-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none`,
      placeholder: label,
    })}
    <label
      htmlFor={id}
      className="absolute left-2.5 -top-2.5 px-1 bg-white text-xs text-indigo-500 font-medium tracking-wider capitalize transition-all duration-300 ease-in-out pointer-events-none
                 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4
                 peer-focus:-top-2.5 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-indigo-500"
    >
      {label}
    </label>
  </div>
);

const UserDetails = () => {
  const [userName, setUserName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    altPhone: "",
    startDate: "",
    endDate: "",
    address: "",
    landmark: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    country: "",
  });

  // Matching functions remain the same
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

  const LocationDebugger = () => {
    const [debugInfo, setDebugInfo] = useState(null);
    const testLocationAPI = async () => {
      if (!navigator.geolocation) {
        setDebugInfo("Geolocation not supported");
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
            setDebugInfo({
              coordinates: { latitude, longitude },
              apiResponse: data,
              formattedAddress: data.results?.[0]?.formatted_address,
              components: data.results?.[0]?.address_components,
            });
          } catch (error) {
            setDebugInfo({ error: error.message });
          }
        },
        (error) => setDebugInfo({ geolocationError: error.message })
      );
    };

    return (
      <div className="p-4 mx-0 my-5 bg-red-100 border-2 border-red-400 rounded-lg">
        <h4 className="mb-2.5 text-red-600 font-bold">
          🔍 DEBUG TOOL (Remove after testing)
        </h4>
        <button
          onClick={testLocationAPI}
          className="px-5 py-2.5 text-sm text-white bg-blue-600 border-0 rounded cursor-pointer"
        >
          Test Location API
        </button>
        {debugInfo && (
          <div className="mt-4">
            <h5 className="font-semibold text-gray-800">Debug Results:</h5>
            <pre className="p-3 mt-2 overflow-auto text-xs bg-white border border-gray-300 rounded-sm max-h-96 whitespace-pre-wrap">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  // Handlers remain the same
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

  const handleSave = (e) => {
    e.preventDefault();
    const { pincode } = formData;
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      alert("Pincode must be exactly 6 digits.");
      return;
    }
    const allFieldsFilled =
      userName.trim() !== "" &&
      Object.values(formData).every((value) => String(value).trim() !== "");
    if (allFieldsFilled) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } else {
      alert("Please fill in all fields before saving.");
    }
  };

  const handleCancel = () => {
    alert("Cancelled");
  };

  // Helper to parse address components from Google Maps API
  // Helper to extract a component by type
  const getComponent = (components, type, useShort = false) => {
    const comp = components.find((c) => c.types.includes(type));
    if (!comp) return "";
    return useShort ? comp.short_name : comp.long_name;
  };

  // Helper to extract sublocality (handles multiple possible types)
  const getSublocality = (components) => {
    const comp = components.find(
      (c) =>
        c.types.includes("sublocality") ||
        c.types.includes("sublocality_level_1")
    );
    return comp ? comp.long_name : "";
  };

  const parseAddressComponents = (addressComponents) => {
    return {
      premise: getComponent(addressComponents, "premise"),
      streetNumber: getComponent(addressComponents, "street_number"),
      route: getComponent(addressComponents, "route"),
      neighborhood: getComponent(addressComponents, "neighborhood"),
      sublocality: getSublocality(addressComponents),
      locality: getComponent(addressComponents, "locality"),
      district_level_2: getComponent(
        addressComponents,
        "administrative_area_level_2"
      ),
      district_level_3: getComponent(
        addressComponents,
        "administrative_area_level_3"
      ),
      state: getComponent(
        addressComponents,
        "administrative_area_level_1",
        true
      ),
      pincode: getComponent(addressComponents, "postal_code"),
      country: getComponent(addressComponents, "country"),
    };
  };

  // Helper to build address string
  const buildCompleteAddress = ({
    premise,
    streetNumber,
    route,
    neighborhood,
    sublocality,
    locality,
  }) => {
    const addressParts = new Set();
    if (premise || streetNumber) addressParts.add(premise || streetNumber);
    if (route) addressParts.add(route);
    if (neighborhood) addressParts.add(neighborhood);
    if (sublocality) addressParts.add(sublocality);
    if (locality) addressParts.add(locality);
    return [...addressParts].join(", ");
  };

  // Helper to match state, district, city
  const matchLocationFields = ({
    state,
    district_level_2,
    district_level_3,
    locality,
  }) => {
    const matchedState = findStateMatch(state);
    let matchedDistrict =
      findDistrictMatch(district_level_2, matchedState) ||
      findDistrictMatch(district_level_3, matchedState) ||
      findDistrictMatch(locality, matchedState);
    const matchedCity = findCityMatch(locality, matchedDistrict);
    return { matchedState, matchedDistrict, matchedCity };
  };

  // Helper to handle geocode API response
  const handleGeocodeResponse = (data, setFormData, setLocationMessage) => {
    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = result.address_components;
      const parsed = parseAddressComponents(addressComponents);
      const completeAddress = buildCompleteAddress(parsed);
      const { matchedState, matchedDistrict, matchedCity } =
        matchLocationFields(parsed);
      setFormData((prevData) => ({
        ...prevData,
        address: completeAddress.trim(),
        state: matchedState || "",
        district: matchedDistrict || "",
        city: matchedCity || "",
        pincode: parsed.pincode,
        country: parsed.country || "India",
      }));
      setLocationMessage("Location auto-filled. Please verify the address.");
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
  };

  // Helper to handle geolocation errors
  const handleGeolocationError = (error) => {
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
          handleGeocodeResponse(data, setFormData, setLocationMessage);
        } catch (err) {
          console.error("Geocode error:", err);
          alert(
            "Error fetching location. Please check your internet connection."
          );
        }
      },
      handleGeolocationError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <div className="font-sans">
      <div className="max-w-2xl p-8 mx-auto my-16 text-gray-800 bg-[#c0bcbc] rounded-2xl border-[3px] border-[#001F3F] shadow-[0_8px_32px_rgba(31,38,135,0.2)] backdrop-blur-lg">
        <LocationDebugger />
        <h3 className="-mt-2.5 mb-3 text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-[#004989] to-[#001F3F] bg-clip-text text-transparent">
          Fill Out Your Event Details
        </h3>

        <form className="flex flex-col gap-5" onSubmit={handleSave}>
          <FormField id="userName" label="User Name">
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={handleChange}
              required
            />
          </FormField>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
              <FormField id="phone" label="Phone Number">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormField>
            </div>
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
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
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
              <FormField id="startDate" label="Start Date">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </FormField>
            </div>
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
              <FormField id="endDate" label="End Date">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </FormField>
            </div>
          </div>

          <div className="relative mt-2.5">
            <div className="relative">
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="peer w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base text-gray-800 font-medium transition-all duration-300 ease-in-out placeholder-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
                placeholder="Event Address"
              />
              <label
                htmlFor="address"
                className="absolute left-2.5 -top-2.5 px-1 bg-white text-xs text-indigo-500 font-medium tracking-wider capitalize transition-all duration-300 ease-in-out pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-indigo-500"
              >
                Event Address
              </label>
              <button
                type="button"
                onClick={handleUseCurrentAddress}
                className="absolute right-[2%] top-2 bg-amber-300 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-sm"
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

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
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
            </div>
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
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
            </div>
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
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
            </div>
            <div className="flex-1 basis-full sm:basis-[calc(50%-8px)]">
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
          </div>

          <div className="flex flex-col justify-center gap-3.5 mt-2.5 sm:flex-row">
            <button
              type="submit"
              className="w-full px-5 py-3 text-base font-semibold tracking-wider text-white uppercase transition-transform duration-200 ease-in-out bg-green-600 rounded-lg cursor-pointer hover:shadow-lg sm:w-36"
            >
              Save
            </button>
            <button
              type="button"
              className="w-full px-5 py-3 text-base font-semibold tracking-wider text-white uppercase transition-transform duration-200 ease-in-out bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg cursor-pointer hover:shadow-lg sm:w-36"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {showPopup && (
            <div className="px-5 py-4 mt-5 text-base text-center text-green-800 bg-gradient-to-r from-green-100 to-green-200 border-l-[6px] border-l-green-500 rounded-xl animate-fadeIn">
              <strong className="block text-lg font-bold">{userName},</strong>
              <p className="mt-1 text-sm">
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
