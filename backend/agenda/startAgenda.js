import agenda from "./agenda.js";

const startAgenda = async () => {
  try {
    await agenda.start();
    console.log("✅ Agenda started and watching jobs");
  } catch (error) {
    console.error("❌ Failed to start Agenda:", error);
  }
};

export default startAgenda;

// frontend connection not there
// review link not working
// timing increase to 48h from 30s