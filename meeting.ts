import {
  CalendarArrowDown,
  CalendarArrowUp,
  CalendarCog,
  CalendarX2,
  ClockAlert,
  ClockArrowUp,
} from "lucide-react";
export const meetingsData = {
  Upcoming: [
    {
      id: 1,
      title: "Team Sync",
      date: "2024-12-15",
      time: "10:00 AM",
      icon: CalendarArrowDown,
    },
    {
      id: 2,
      title: "Project Kickoff",
      date: "2024-12-20",
      time: "3:00 PM",
      icon: CalendarArrowDown,
    },
  ],
  Pending: [
    {
      id: 1,
      title: "Vryno CRM",
      date: "2024-12-15",
      time: "10:00 AM",
      icon: CalendarCog,
    },
  ],
  Past: [
    {
      id: 5,
      title: "Retrospective",
      date: "2024-12-05",
      time: "4:00 PM",
      icon: CalendarArrowUp,
    },
    {
      id: 6,
      title: "Client Presentation",
      date: "2024-12-01",
      time: "1:00 PM",
      icon: CalendarArrowUp,
    },
  ],
  Cancelled: [
    {
      id: 7,
      title: "Budget Review",
      date: "2024-12-10",
      time: "11:00 AM",
      icon: CalendarX2,
    },
    {
      id: 8,
      title: "Strategy Meeting",
      date: "2024-12-08",
      time: "2:00 PM",
      icon: CalendarX2,
    },
  ],
};
