import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDetails.css";

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

const UserDetails = () => {
  const [userName, setUserName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    document.body.style.background = "linear-gradient(45deg ,#ffffff,#ffffff)";

    return () => {
      // Reset to default or transparent when this page is left
      document.body.style.background = "";
    };
  }, []);

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
      // Reset district and city when state changes
      setFormData((prevData) => ({
        ...prevData,
        state: value,
        district: "",
        city: "",
      }));
    } else if (name === "district") {
      // Reset city when district changes
      setFormData((prevData) => ({
        ...prevData,
        district: value,
        city: "",
      }));
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
      Object.values(formData).every((value) => value.trim() !== "");

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

  const handleUseCurrentAddress = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    // Check if API key is available
    if (!import.meta.env.VITE_GOOGLE_API_KEY) {
      alert("Google API key is not configured.");
      console.error("VITE_GOOGLE_API_KEY is not set in environment variables");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        //Google API
        try {
          console.log("trying to fetch Google API");
          const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
              params: {
                latlng: `${latitude},${longitude}`,
                key: import.meta.env.VITE_GOOGLE_API_KEY,
              },
            }
          );
          console.log("Data fetched from API : ", data);

          if (data.status === "OK") {
            const addressComponents = data.results[0].address_components;

            let address = "",
              state = "",
              district = "",
              city = "",
              pincode = "";

            for (let comp of addressComponents) {
              const types = comp.types;

              if (
                types.includes("premise") ||
                types.includes("route") ||
                types.includes("sublocality")
              ) {
                address += comp.long_name + " ";
              }
              if (types.includes("locality")) {
                city = comp.long_name;
              }
              if (types.includes("administrative_area_level_2")) {
                district = comp.long_name;
              }
              if (types.includes("administrative_area_level_1")) {
                state = comp.long_name;
              }
              if (types.includes("postal_code")) {
                pincode = comp.long_name;
              }
            }

            setFormData((prevData) => ({
              ...prevData,
              address: address.trim(),
              city,
              district,
              state,
              pincode,
            }));
          } else {
            alert("Could not get address. Try again.");
          }
        } catch (err) {
          console.error("Geocode error", err);
          alert("Error fetching location");
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        alert("Permission denied or failed to fetch location.");
      }
    );
  };

  return (
    <div className="  user-details-page">
      <div className="user-details-container">
        <h3 className="form-title">Fill Out Your Event Details</h3>
        <form className="user-form" onSubmit={handleSave}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              name="userName"
              value={userName}
              onChange={handleChange}
              required
            />
            <label>User Name</label>
          </div>

          <div className="location-group">
            <div className="form-group small">
              <input
                type="tel"
                className="form-input"
                placeholder=" "
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <label>Phone Number</label>
            </div>

            <div className="form-group small">
              <input
                type="tel"
                className="form-input"
                placeholder=" "
                name="altPhone"
                value={formData.altPhone}
                onChange={handleChange}
                required
              />
              <label>Alternate Number</label>
            </div>
          </div>

          <div className="date-group">
            <div className="form-group small">
              <input
                type="date"
                className="form-input"
                placeholder=" "
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <label>Start Date</label>
            </div>

            <div className="form-group small">
              <input
                type="date"
                className="form-input"
                placeholder=" "
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              <label>End Date</label>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label>Event Address</label>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUseCurrentAddress}
                className="absolute right-[2%] top-[50%] -translate-y-1/2 bg-amber-300 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-sm"
                title="Use Current Location"
              >
                📍
              </button>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              required
            />
            <label>Landmark</label>
          </div>

          <div className="location-group">
            <div className="form-group small">
              <select
                className="form-input"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">State</option>
                <option value="Odisha">Odisha</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="TamilNadu">Tamil Nadu</option>
                <option value="UttarPradesh">Uttar Pradesh</option>
              </select>

              <label>State</label>
            </div>

            <div className="form-group small">
              <select
                className="form-input"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.state} // Disable if no state selected
              >
                <option value="">District</option>
                {stateDistricts[formData.state]?.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <label>District</label>
            </div>

            <div className="form-group small">
              <select
                class="form-input"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={!formData.district} // Disable if no district selected
              >
                <option value="">City</option>
                {districtCities[formData.district]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <label>City</label>
            </div>

            <div className="form-group small">
              <input
                type="text"
                className="form-input"
                placeholder=" "
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
              <label>Pincode</label>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn save-btn">
              Save
            </button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {showPopup && (
            <div className="popup-inside">
              <strong>{userName},</strong>
              <br />
              <p>Your User Details Saved Successfully!</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
