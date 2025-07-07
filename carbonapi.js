document.addEventListener("DOMContentLoaded", () => {
  const nationalCIElement = document.getElementById("nationalCI");

  // Replace this with your actual key
  const API_KEY = "jQVrkKWiwyOcD4LILLrO";

  async function fetchCarbonIntensity() {
    try {
      const res = await fetch("https://api.electricitymap.org/v3/carbon-intensity/latest?zone=IN", {
        headers: {
          "auth-token": API_KEY
        }
      });

      const json = await res.json();
      const ci = json.data.carbonIntensity;

      nationalCIElement.innerHTML = `🌏 National Carbon Intensity: <strong>${ci} gCO₂/kWh</strong>`;
    } catch (err) {
      console.error("Error fetching carbon intensity:", err);
      nationalCIElement.innerHTML = "⚠️ Unable to fetch CI data.";
    }
  }

  fetchCarbonIntensity();
  setInterval(fetchCarbonIntensity, 5 * 60 * 1000); // refresh every 5 min
});
