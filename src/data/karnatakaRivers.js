// src/data/karnatakaRivers.js

// This file contains topographical arrays for major Karnataka river systems.
// The coordinates MUST strictly run from Source (index 0) to Mouth/Border (last index).
// This structure is critical for the Predictive Downstream Engine to function.

export const KARNATAKA_RIVERS = [
  {
    id: "r_kaveri",
    name: "Kaveri River Main Basin",
    type: "river",
    destination: "Bay of Bengal (via TN)",
    coords: [
      [12.3833, 75.4833], // Source: Talakaveri
      [12.4333, 75.7667], // Kushalnagar
      [12.4167, 76.2833], // Srirangapatna
      [12.2833, 76.6500], // T Narsipur
      [12.2500, 77.0167], // Shivanasamudra
      [12.1833, 77.3000], // Kanakapura Border
      [11.9000, 77.6000]  // Exits to Tamil Nadu
    ]
  },
  {
    id: "r_sharavathi",
    name: "Sharavathi River",
    type: "river",
    destination: "Arabian Sea",
    coords: [
      [13.8821, 75.0500], // Source: Ambuthirtha
      [14.2255, 74.8317], // Jog Falls Sector
      [14.3000, 74.6500], // Honnavar backwaters
      [14.2750, 74.4372]  // Mouth: Arabian Sea
    ]
  },
  {
    id: "r_netravati",
    name: "Netravati River",
    type: "river",
    destination: "Arabian Sea",
    coords: [
      [13.1492, 75.3364], // Source: Kudremukh
      [12.9818, 75.1874], // Dharmasthala bend
      [12.8711, 75.0225], // Bantwal
      [12.8335, 74.8465]  // Mouth: Mangalore Arabian Sea
    ]
  },
  {
    id: "r_tungabhadra",
    name: "Tungabhadra River",
    type: "river",
    destination: "Krishna River (AP)",
    coords: [
      [13.2384, 75.2415], // Origin (Tunga/Bhadra merge region)
      [14.0500, 75.6333], // Harihar
      [14.8667, 76.0167], // Huvina Hadagali
      [15.3167, 76.4667], // Hospet / Hampi
      [15.8667, 77.2000], // Raichur Border
      [15.8833, 78.1667]  // Exits to AP / merges to Krishna
    ]
  },
  {
    // The infamous Vrishabhavathi -> Arkavathi -> Kaveri pipeline.
    // We treat this as one continuous pollution pipeline for mapping ease.
    id: "d_vrishabhavathi_arkavathi",
    name: "Bangalore Urban Drainage Pipeline (Vrishabhavathi Basin)",
    type: "drainage",
    destination: "Kaveri River",
    coords: [
      [13.0100, 77.5600], // Peenya / Source
      [12.9750, 77.5400], // Mysore Road
      [12.8900, 77.4700], // Kengeri
      [12.7500, 77.4000], // Ramnagara (Arkavathi Merge)
      [12.5000, 77.3800], // Sangama
      [12.2833, 76.6500]  // Dumps into Kaveri at T Narsipur
    ]
  }
];
