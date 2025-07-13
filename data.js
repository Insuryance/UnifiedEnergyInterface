window.data = {
  energyMix: {}
};

async function fetchEmberData() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/EmberClimate/India-Data-Explorer/main/state_generation/state_generation_monthly.csv");
    const text = await res.text();
    const lines = text.split("\n").slice(1); // skip header

    const latestMonth = "2024-04"; // you can update this monthly

    const stateMix = {};

    lines.forEach(line => {
      const cols = line.split(",");
      const [state, date, tech, gen] = [cols[0], cols[1], cols[2], parseFloat(cols[3] || 0)];

      if (date !== latestMonth) return;

      if (!stateMix[state]) {
        stateMix[state] = {
          coal: 0,
          solar: 0,
          wind: 0,
          hydro: 0
        };
      }

      if (tech.includes("Coal")) stateMix[state].coal += gen;
      else if (tech.includes("Solar")) stateMix[state].solar += gen;
      else if (tech.includes("Wind")) stateMix[state].wind += gen;
      else if (tech.includes("Hydro")) stateMix[state].hydro += gen;
    });

    // Convert to percentages
    Object.entries(stateMix).forEach(([state, mix]) => {
      const total = mix.coal + mix.solar + mix.wind + mix.hydro;
      if (total === 0) return;

      window.data.energyMix[state] = {
        coal: +(mix.coal / total * 100).toFixed(1),
        solar: +(mix.solar / total * 100).toFixed(1),
        wind: +(mix.wind / total * 100).toFixed(1),
        hydro: +(mix.hydro / total * 100).toFixed(1)
      };
    });

    // Trigger dashboard update
    if (window.updateDashboard) window.updateDashboard();

  } catch (err) {
    console.error("Failed to fetch Ember data", err);
  }
}

fetchEmberData();
