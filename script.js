document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");

  // Function to fetch and update dashboard
  async function updateDashboard() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();

      dashboard.innerHTML = `
        <h2>📊 Live Grid Status</h2>
        <p>⚡ Grid Frequency: <strong>${data.gridFrequency.toFixed(2)} Hz</strong></p>
        <p>🔌 Demand: <strong>${data.demandMW.toLocaleString()} MW</strong></p>
        <p>🌿 Carbon Intensity: <strong>${data.carbonIntensity} gCO₂/kWh</strong></p>
        <h3>🧩 UEI Scores (States)</h3>
        <ul>
          ${Object.entries(data.ueiScores).map(([state, score]) => `<li>${state}: <strong>${score}/100</strong></li>`).join('')}
        </ul>
      `;
    } catch (error) {
      dashboard.innerHTML = `<p style="color:red;">Error loading data.</p>`;
      console.error('Error fetching data:', error);
    }
  }

  // Initial load
  updateDashboard();

  // Refresh data every 5 minutes (300000 ms)
  setInterval(updateDashboard, 300000);
});
