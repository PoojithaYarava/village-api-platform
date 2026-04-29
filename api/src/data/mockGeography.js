const states = [
  {
    id: "state_mh",
    code: "27",
    name: "Maharashtra",
    region: "West",
    districts: [
      {
        id: "district_nandurbar",
        code: "497",
        name: "Nandurbar",
        subDistricts: [
          {
            id: "sub_akkalkuwa",
            code: "03950",
            name: "Akkalkuwa",
            villages: [
              { id: "village_525002", code: "525002", name: "Manibeli" },
              { id: "village_525003", code: "525003", name: "Dhankhedi" },
              { id: "village_525004", code: "525004", name: "Chimalkhadi" },
              { id: "village_525005", code: "525005", name: "Sinduri" }
            ]
          }
        ]
      },
      {
        id: "district_pune",
        code: "521",
        name: "Pune",
        subDistricts: [
          {
            id: "sub_haveli",
            code: "04199",
            name: "Haveli",
            villages: [
              { id: "village_wagholi", code: "550901", name: "Wagholi" },
              { id: "village_kesnand", code: "550902", name: "Kesnand" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "state_ka",
    code: "29",
    name: "Karnataka",
    region: "South",
    districts: [
      {
        id: "district_bengaluru_rural",
        code: "583",
        name: "Bengaluru Rural",
        subDistricts: [
          {
            id: "sub_devanahalli",
            code: "05520",
            name: "Devanahalli",
            villages: [
              { id: "village_avathi", code: "615001", name: "Avathi" },
              { id: "village_budigere", code: "615002", name: "Budigere" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "state_up",
    code: "09",
    name: "Uttar Pradesh",
    region: "North",
    districts: [
      {
        id: "district_varanasi",
        code: "196",
        name: "Varanasi",
        subDistricts: [
          {
            id: "sub_pindra",
            code: "00921",
            name: "Pindra",
            villages: [
              { id: "village_kathiraon", code: "712301", name: "Kathiraon" },
              { id: "village_babatpur", code: "712302", name: "Babatpur" }
            ]
          }
        ]
      }
    ]
  }
];

module.exports = { states };
