import axios from "axios";

const API_KEY = process.env.CALENDARIFIC_API_KEY;

const fetchFestivalDates = async (year = new Date().getFullYear()) => {
  // 🔒 Validate the year
  if (isNaN(year) || year < 1900 || year > 2100) {
    console.warn(
      "⚠️ Invalid year passed to fetch Festival Dates. Use current year instead."
    );
    year = new Date().getFullYear();
  }

  const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=IN&year=${year}`;

  try {
    const { data } = await axios.get(url);

    const festivals = data?.response?.holidays
      ?.filter(
        (festival) =>
          festival.type.includes("religious") ||
          festival.type.includes("observance")
      )
      .map((festival) => ({
        name: festival.name,
        date: festival.date.iso,
        description: festival.description,
        type: festival.type.join(", "),
      }));
      
    // FOR TESTING ONLY
    festivals.push({
      name: "Test Festival",
      date: new Date().toISOString().split("T")[0],
      description: "This is a test festival to trigger email.",
      type: "test",
    });

    return festivals;
  } catch (err) {
    console.error("❌ Error fetching from Calendarific:", err.message);
    return [];
  }
};

export default fetchFestivalDates;
