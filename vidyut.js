// vidyut.js

async function fetchVidyutPravahData() {
  try {
    const proxyURL = "https://corsproxy.io/?";
    const targetURL = "https://vidyutpravah.in/StateWiseData";

    const response = await fetch(proxyURL + encodeURIComponent(targetURL));
    const json = await response.json();

    const states = json.StateWiseData;

    // Process each state
    states.forEach(stateData => {
      const stateName = stateData.StateName.trim();
      const gen = parseFloat(stateData.CurrentGen || 0);

      // Update dashboard cards with generation info
      const el = document.getElementById(`details-${stateName}`);
      if (el) {
        const para = document.createElement("p");
        para.innerHTML = `⚡ Live Generation: <strong>${gen} MW</strong>`;
        el.appendChild(para);
      }
    });

    console.log("✅ Vidyut Pravah data loaded");
  } catch (err) {
    console.error("❌ Failed to fetch Vidyut Pravah data:", err);
  }
}

// Auto-refresh every 5 min
fetchVidyutPravahData();
setInterval(fetchVidyutPravahData, 5 * 60 * 1000);
