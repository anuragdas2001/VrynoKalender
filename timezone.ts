export const Timezone = {
  timezones: [
    {
      region: "Asia",
      zones: [
        {
          name: "Asia/Kolkata",
          offset: "+05:30",
          abbreviation: "IST",
          isDst: false,
        },
        {
          name: "Asia/Tokyo",
          offset: "+09:00",
          abbreviation: "JST",
          isDst: false,
        },
      ],
    },
    {
      region: "Europe",
      zones: [
        {
          name: "Europe/London",
          offset: "+00:00",
          abbreviation: "GMT",
          isDst: false,
        },
        {
          name: "Europe/Paris",
          offset: "+01:00",
          abbreviation: "CET",
          isDst: true,
        },
      ],
    },
    {
      region: "America",
      zones: [
        {
          name: "America/New_York",
          offset: "-05:00",
          abbreviation: "EST",
          isDst: true,
        },
        {
          name: "America/Los_Angeles",
          offset: "-08:00",
          abbreviation: "PST",
          isDst: true,
        },
      ],
    },
  ],
};
