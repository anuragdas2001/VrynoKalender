export const settings = [
  {
    id: 1,
    name: "General",
    url: "/settings/general",
    content: {
      description: "Manage general settings like your profile and preferences.",
      defaults: [
        { name: "Username", value: "John Doe" },
        { name: "Email Notifications", value: "Enabled" },
        { name: "Time Zone", value: "GMT +0" },
      ],
    },
  },
  {
    id: 2,
    name: "Calenders",
    url: "/settings/calenders",
    content: {
      description: "Manage calendar settings and sync preferences.",
      defaults: [
        { name: "Default View", value: "Week" },
        { name: "Start of the Week", value: "Monday" },
        { name: "Time Zone", value: "GMT +0" },
      ],
    },
  },
  {
    id: 3,
    name: "Conferencing",
    url: "/settings/conferencing",
    content: {
      description: "Configure video conferencing options.",
      defaults: [
        { name: "Default Platform", value: "Zoom" },
        { name: "Meeting Duration", value: "30 Minutes" },
        { name: "Waiting Room", value: "Enabled" },
      ],
    },
  },
  {
    id: 4,
    name: "Appearance",
    url: "/settings/appearance",
    content: {
      description: "Customize the appearance of the application.",
      defaults: [
        { name: "Theme", value: "Light" },
        { name: "Font Size", value: "Medium" },
        { name: "Accent Color", value: "Blue" },
      ],
    },
  },
];
