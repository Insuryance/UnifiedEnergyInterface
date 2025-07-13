// data.js

window.data = {
  energyMix: {},
  liveGen: {} // Placeholder, update later with SLDC data
};

async function fetchEmberData() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/EmberClimate/India-Data-Explorer/main/state_generation/state_generation_monthly.csv");
    const text = await res.text();
    const lines = text.trim().split("\n");

    const header = lines[0].split(",");
    const rows = lines.slice(1);

    // Automatically detect latest available month
    const dateColIndex = header.indexOf("Date");
    const dates = rows.map(r => r.split(",")[dateColIndex]);
    const latestMonth = dates.sort().reverse().find(d => d.match(/^\d{4}-\d{2}$/));

    const stateMix = {};

    rows.forEach(line => {
      const cols = line.split(",");
      const state = cols[0];
      const date = cols[1];
      const tech = cols[2];
      const gen = parseFloat(cols[3]) || 0;

      if (date !== latestMonth) return;

      if (!stateMix[state]) {
        stateMix[state] = { coal: 0, solar: 0, wind: 0, hydro: 0 };
      }

      if (tech.includes("Coal")) stateMix[state].coal += gen;
      else if (tech.includes("Solar")) stateMix[state].solar += gen;
      else if (tech.includes("Wind")) stateMix[state].wind += gen;
      else if (tech.includes("Hydro")) stateMix[state].hydro += gen;
    });

    // Convert absolute generation to %
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

    console.log("✅ Ember data loaded for", latestMonth);
    if (window.updateDashboard) window.updateDashboard();

  } catch (err) {
    console.error("❌ Failed to fetch Ember data", err);
  }
}

fetchEmberData();
