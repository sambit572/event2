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
    /*  festivals.push({
      name: "Test Festival",
      date: new Date().toISOString().split("T")[0],
      description: "This is a test festival to trigger email.",
      type: "test",
    }); */
    /* console.log("🧪 RUNNING IN TEST MODE: Adding a temporary festival for today.");
    festivals.push({
      name: "My Manual Test Festival",
      date: new Date().toISOString().split("T")[0], // This makes the festival for TODAY
      description: "This is a manual test to confirm email sending.",
      type: "manual-test",
    });
 */
    return festivals;
  } catch (err) {
    console.error("❌ Error fetching from Calendarific:", err.message);
    return [];
  }
};

export default fetchFestivalDates;
