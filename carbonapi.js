document.addEventListener("DOMContentLoaded", () => {
  const nationalCIElement = document.getElementById("nationalCI");

  const API_KEY = "jQVrkKWiwyOcD4LILLrO"; // ✅ your actual API key

  async function fetchCarbonIntensity() {
    try {
      const res = await fetch("https://api.electricitymap.org/v3/carbon-intensity/latest?zone=IN", {
        headers: { "auth-token": API_KEY }
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const json = await res.json();
      const ci = json.carbonIntensity.value;

      nationalCIElement.innerHTML = `🌏 National Carbon Intensity: <strong>${ci} gCO₂/kWh</strong>`;
    } catch (err) {
      console.error("Error fetching carbon intensity:", err);
      nationalCIElement.innerHTML = "⚠️ Unable to fetch CI data.";
    }
  }

  fetchCarbonIntensity();
  setInterval(fetchCarbonIntensity, 5 * 60 * 1000); // Refresh every 5 minutes
});
