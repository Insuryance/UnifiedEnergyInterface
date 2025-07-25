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

  // 📊 Draw Comparison Chart: UEI vs Live MW
  function drawComparisonChart() {
    const ctx = document.getElementById("compareChart").getContext("2d");
    if (window.compareChartInstance) window.compareChartInstance.destroy();

    const states = Object.keys(data.energyMix);

    const ueiScores = states.map(state => {
      const mix = data.energyMix[state];
      const ci = getCarbonIntensity(mix);
      return getUEIScore(mix, ci);
    });

    const liveMW = states.map(state => window.data.liveGen?.[state] || 0);

    window.compareChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: states,
        datasets: [
          {
            label: 'UEI Score',
            data: ueiScores,
            backgroundColor: 'rgba(0, 123, 255, 0.6)',
            yAxisID: 'y1',
            borderRadius: 6
          },
          {
            label: 'Live Generation (MW)',
            data: liveMW,
            type: 'line',
            borderColor: 'orange',
            backgroundColor: 'orange',
            yAxisID: 'y2',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        stacked: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y1: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 100,
            title: { display: true, text: 'UEI Score' }
          },
          y2: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: { display: true, text: 'Generation (MW)' }
          }
        }
      }
    });
  }
  window.drawComparisonChart = drawComparisonChart;

  // 🧾 Update Dashboard
  function updateDashboard() {
    let output = `<h2>📊 Live Grid Status</h2>`;

    Object.entries(data.energyMix).forEach(([state, mix]) => {
      const ci = getCarbonIntensity(mix);
      const uei = getUEIScore(mix, ci);

      output += `
        <div class="state-card ${uei >= 80 ? 'card-good' : uei >= 60 ? 'card-moderate' : 'card-bad'}" onclick="toggleDetails('${state}')">
          <h3>
            📍 ${state} 
            <span class="badge ${uei >= 80 ? 'good' : uei >= 60 ? 'moderate' : 'bad'}">
              ${uei >= 80 ? 'Excellent' : uei >= 60 ? 'Moderate' : 'Needs Improvement'}
            </span>
          </h3>
          <p>🌿 Carbon Intensity: <strong>${ci} gCO₂/kWh</strong></p>
          <p>📊 UEI Score: <strong style="color:${uei >= 80 ? 'green' : uei >= 60 ? 'orange' : 'red'}">${uei}/100</strong></p>
          <p>⚡ Mix – Coal: ${mix.coal}%, Solar: ${mix.solar}%, Wind: ${mix.wind}%, Hydro: ${mix.hydro}%</p>
          <div class="details" id="details-${state}" style="display: none;">
            <hr style="margin: 12px 0;">
            <p>💡 Insights:</p>
            <ul style="padding-left: 20px;">
              <li>${mix.coal > 50 ? "High dependence on coal ⚠️" : "Low coal usage ✅"}</li>
              <li>${mix.solar + mix.wind + mix.hydro > 50 ? "Strong renewable mix 🌱" : "Needs renewable push ⚡"}</li>
              <li>${uei >= 80 ? "Excellent energy mix 🎯" : uei >= 60 ? "Moderate performance 🟠" : "Needs improvement 🔴"}</li>
            </ul>
          </div>
        </div>
      `;
    });

    dashboard.innerHTML = output;
    drawUEIChart();
    drawComparisonChart();
  }

  // 👇 Expand/Collapse Details
  window.toggleDetails = function (state) {
    const el = document.getElementById(`details-${state}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  };

  // ⏱ Refresh Timestamp
  function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('lastUpdated').textContent = `Last updated: ${timeString}`;
  }

  // 🔁 Manual Refresh
  window.refreshData = function () {
    updateDashboard();
    updateTimestamp();
  };

  // 🔄 Auto-refresh every 60s
  setInterval(refreshData, 60000);

  // ✅ Init
  updateTimestamp();
  updateDashboard();
  window.updateDashboard = updateDashboard;
});
