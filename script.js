document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");

  // Use data directly from data.js
  function updateDashboard() {
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
  }

  updateDashboard();

  // For demo: no periodic update yet
});
