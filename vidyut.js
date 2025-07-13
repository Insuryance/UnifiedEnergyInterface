// vidyut.js

window.data.liveGen = {}; // 👈 Add this if not already present

async function fetchVidyutPravahData() {
  try {
    const proxyURL = "https://corsproxy.io/?";
    const targetURL = "https://vidyutpravah.in/StateWiseData";

    const response = await fetch(proxyURL + encodeURIComponent(targetURL));
    const json = await response.json();

    const states = json.StateWiseData;

    states.forEach(stateData => {
      const stateName = stateData.StateName.trim();
      const gen = parseFloat(stateData.CurrentGen || 0);
      window.data.liveGen[stateName] = gen;
    });

    if (window.drawComparisonChart) window.drawComparisonChart();

    console.log("✅ Vidyut Pravah data loaded");
  } catch (err) {
    console.error("❌ Failed to fetch Vidyut Pravah data:", err);
  }
}

fetchVidyutPravahData();
setInterval(fetchVidyutPravahData, 5 * 60 * 1000);

