const data = {
  gridFrequency: 50.03,
  demandMW: 195400,
  carbonIntensity: null, // We’ll calculate this
  ueiScores: {},

  // Add mock generation source mix
  energyMix: {
    Maharashtra: {
      coal: 60,
      solar: 20,
      wind: 10,
      hydro: 10
    },
    TamilNadu: {
      coal: 40,
      solar: 30,
      wind: 25,
      hydro: 5
    },
    Gujarat: {
      coal: 55,
      solar: 25,
      wind: 10,
      hydro: 10
    },
    Karnataka: {
      coal: 35,
      solar: 30,
      wind: 25,
      hydro: 10
    }
  }
};
