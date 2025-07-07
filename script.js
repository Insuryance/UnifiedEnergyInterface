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
  function toggleDetails(state) {
  const el = document.getElementById(`details-${state}`);
  if (el.style.display === 'none') {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}
// Modal interaction
const modal = document.getElementById("ueiModal");
const btn = document.getElementById("ueiInfoBtn");
const span = document.getElementById("closeModal");

btn.onclick = function () {
  modal.style.display = "block";
}
span.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

});
