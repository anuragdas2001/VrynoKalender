export const availability = [
  {
    id: "1",
    eventId: "1",
    availabilityName: "Morning Sessions",
    timeZone: "America/New_York",
    workDays: ["Monday", "Tuesday", "Wednesday"],
    timeSlots: [{ start: "09:00", end: "12:00" }],
    isDefault: true,
  },
  {
    id: "2",
    eventId: "2",
    availabilityName: "Afternoon Workshops",
    timeZone: "Europe/London",
    workDays: ["Tuesday", "Thursday", "Friday"],
    timeSlots: [{ start: "14:00", end: "17:00" }],
    isDefault: false,
  },
  {
    id: "3",
    eventId: "3",
    availabilityName: "Weekend Consultations",
    timeZone: "Asia/Kolkata",
    workDays: ["Saturday", "Sunday"],
    timeSlots: [{ start: "10:00", end: "13:00" }],
    isDefault: false,
  },
];
