document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");

  // 🌗 Theme Toggle
  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
  }
  window.toggleTheme = toggleTheme;

  // ⚡ Carbon Intensity Calculation
  function getCarbonIntensity(mix) {
    return Math.round(
      mix.coal * 10 +
      mix.solar * 0.2 +
      mix.wind * 0.1 +
      mix.hydro * 0.3
    );
  }

  // 🧠 UEI Score Calculation
  function getUEIScore(mix, ci) {
    const renewables = mix.solar + mix.wind + mix.hydro;
    return Math.max(0, Math.min(100, Math.round(100 - (ci / 10) + renewables)));
  }

  // 📊 Draw UEI Bar Chart
  function drawUEIChart() {
    const ctx = document.getElementById("ueiChart").getContext("2d");

    const labels = Object.keys(data.energyMix);
    const ueiScores = labels.map(state => {
      const mix = data.energyMix[state];
      const ci = getCarbonIntensity(mix);
      return getUEIScore(mix, ci);
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: 'UEI Score',
          data: ueiScores,
          backgroundColor: ueiScores.map(score =>
            score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'
          ),
          borderRadius: 8,
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
            }
          },
          x: {
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
            }
          }
        }
      }
    });
  }

  // 🧾 Update Dashboard (Card-based UI)
  function updateDashboard() {
    let output = `<h2 style="margin-top: 40px;">📍 State-wise UEI Overview</h2>`;

    Object.entries(data.energyMix).forEach(([state, mix]) => {
      const ci = getCarbonIntensity(mix);
      const uei = getUEIScore(mix, ci);

      output += `
        <div class="state-card">
          <h3>${state}</h3>
          <p>🌿 Carbon Intensity: <strong>${ci} gCO₂/kWh</strong></p>
          <p>📊 UEI Score: <strong style="color:${uei >= 80 ? 'green' : uei >= 60 ? 'orange' : 'red'}">${uei}/100</strong></p>
          <p>⚡ Mix – Coal: ${mix.coal}%, Solar: ${mix.solar}%, Wind: ${mix.wind}%, Hydro: ${mix.hydro}%</p>
        </div>
      `;
    });

    dashboard.innerHTML += output;
    drawUEIChart();
  }

  // 🚀 Init
  updateDashboard();
  // 🌍 Modal Controls
function openModal() {
  document.getElementById('ueiModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('ueiModal').style.display = 'none';
}
});
