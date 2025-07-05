document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");

  // Function to calculate carbon intensity from mix
  function getCarbonIntensity(mix) {
    return Math.round(
      mix.coal * 10 +
      mix.solar * 0.2 +
      mix.wind * 0.1 +
      mix.hydro * 0.3
    );
  }

  // Function to calculate UEI score
  function getUEIScore(mix, ci) {
    const renewables = mix.solar + mix.wind + mix.hydro;
    return Math.max(0, Math.min(100, Math.round(100 - (ci / 10) + renewables)));
  }

  function updateDashboard() {
    let output = `<h2>📊 Live Grid Status</h2>`;

    Object.entries(data.energyMix).forEach(([state, mix]) => {
      const ci = getCarbonIntensity(mix);
      const uei = getUEIScore(mix, ci);

      output += `
        <div style="margin-bottom: 24px;">
          <h3>📍 ${state}</h3>
          <p>🌿 Carbon Intensity: <strong>${ci} gCO₂/kWh</strong></p>
          <p>📊 UEI Score: <strong style="color:${uei >= 80 ? 'green' : uei >= 60 ? 'orange' : 'red'}">${uei}/100</strong></p>
          <p>⚡ Mix – Coal: ${mix.coal}%, Solar: ${mix.solar}%, Wind: ${mix.wind}%, Hydro: ${mix.hydro}%</p>
        </div>
      `;
    });

    dashboard.innerHTML = output;
  }

  updateDashboard();
});
