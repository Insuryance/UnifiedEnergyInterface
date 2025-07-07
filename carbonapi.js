document.addEventListener("DOMContentLoaded", () => {
  const nationalCIElement = document.getElementById("nationalCI");

  // ✅ PASTE YOUR FULL API KEY BETWEEN THE QUOTES
  const API_KEY = "jQVrkKWiwyOcD4LILLrO";

  async function fetchCarbonIntensity() {
    try {
      const response = await fetch("https://api.electricitymap.org/v3/carbon-intensity/latest?zone=IN-NO", {
        headers: {
          "auth-token": API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const json = await response.json();

      console.log("ElectricityMap API Response:", json);

      const ci = json.carbonIntensity?.value;

      if (!ci) throw new Error("Carbon Intensity not found in response.");

      nationalCIElement.innerHTML = `🌏 National Carbon Intensity: <strong>${ci} gCO₂/kWh</strong>`;
    } catch (error) {
      console.error("Error fetching carbon intensity:", error);
      nationalCIElement.innerHTML = "⚠️ Unable to fetch CI data.";
    }
  }

  fetchCarbonIntensity();
  setInterval(fetchCarbonIntensity, 5 * 60 * 1000); // refresh every 5 minutes
});
