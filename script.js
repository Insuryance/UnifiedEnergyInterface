document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");
dashboard.innerHTML = "<p>Coming soon: live DISCOM data, carbon intensity & UEI scorecards!</p>";
  dashboard.innerHTML = `
    <div class="loading">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <p>Loading real-time data...</p>
    </div>
  `;

  setTimeout(() => {
    dashboard.innerHTML = `
      <h2>Live Grid Status</h2>
      <p>Grid Frequency: <strong>50.02 Hz</strong></p>
      <p>Demand: <strong>192,000 MW</strong></p>
      <p>Carbon Intensity: <strong>612 gCO₂/kWh</strong></p>
      <p>UEI Score (Maharashtra): <strong>78/100</strong></p>
    `;
    
   document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");

  dashboard.innerHTML = `
    <h2>📊 Live Grid Status</h2>
    <p>⚡ Grid Frequency: <strong>50.02 Hz</strong></p>
    <p>🔌 Demand: <strong>192,000 MW</strong></p>
    <p>🌿 Carbon Intensity: <strong>612 gCO₂/kWh</strong></p>
    <p>🧩 UEI Score (Maharashtra): <strong>78/100</strong></p>
  `;
});

// Theme toggle logic
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  html.setAttribute("data-theme", current === "light" ? "dark" : "light");
}
  }, 2500); // Simulate loading delay
});
