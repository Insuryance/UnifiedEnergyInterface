document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");

  // Theme toggle
  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
  }
  window.toggleTheme = toggleTheme;

  // Calculate carbon intensity from mix
  function getCarbonIntensity(mix) {
    return Math.round(
      mix.coal * 10 +
      mix.solar * 0.2 +
      mix.wind * 0.1 +
      mix.hydro * 0.3
    );
  }

  // Calculate UEI score
  function getUEIScore(mix, ci) {
    const renewables = mix.solar + mix.wind + mix.hydro;
    return Math.max(0, Math.min(100, Math.round(100 - (ci / 10) + renewables)));
  }

  // Draw UEI Bar Chart
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

  // Update dashboard display
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
    drawUEIChart();
  }
  // Load everything
  updateDashboard();
  const tooltip = document.getElementById('tooltip');

document.getElementById('svgMap').addEventListener('load', () => {
  const svgDoc = document.getElementById('svgMap').contentDocument;

  Object.keys(data.energyMix).forEach(state => {
    const element = svgDoc.getElementById(state);
    if (element) {
      const mix = data.energyMix[state];
      const ci = getCarbonIntensity(mix);
      const uei = getUEIScore(mix, ci);

      // Color state fill based on score
      element.style.fill = uei >= 80 ? 'green' : uei >= 60 ? 'orange' : 'red';

      // Tooltip events
      element.addEventListener('mousemove', (e) => {
        tooltip.style.display = 'block';
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY + 10 + 'px';
        tooltip.innerHTML = `<strong>${state}</strong><br>UEI: ${uei}/100<br>CI: ${ci} gCO₂/kWh`;
      });
      element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    }
  });
});

});
