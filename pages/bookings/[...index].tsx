import React, { useRef, useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  setHours,
  setMinutes,
} from "date-fns";
import { enUS } from "date-fns/locale";
import Link from "next/link";
import { Clock, Video, Globe, ChevronRight } from "lucide-react";
import Button from "../../components/TailwindControls/Form/Button/Button";
import { timeslots } from "../../timeslot";
import { useRouter } from "next/router";
// Types
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay: boolean;
  data: {
    id: string;
    module: string;
  };
}

interface CalendarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  events: CalendarEvent[];
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const TimeSlots = () => {
  const [activeTimeSlot, setActiveTimeSlot] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const router = useRouter();
  const route1 = router.asPath.split("/")[1];
  const route2 = router.asPath.split("/")[2];
  const route3 = router.asPath.split("/")[3];
  console.log("route1", route1);
  console.log("route2", route2);
  console.log("route3", route3);
  const handleTimeSlotClick = (time: string) => {
    setActiveTimeSlot(time);
    setShowNext(true);
    console.log("Selected time:", time);
  };

  const handleNextClick = () => {
    // Handle navigation to the booking form or next step
    console.log("Proceeding with selected time:", activeTimeSlot);
    router.push(`/bookings/form/${route2}/${route3}`);

  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Time Slots{" "}
        {timeslots && timeslots.length > 0
          ? `for ${format(new Date(), "MMMM d, yyyy")}`
          : ""}
      </h3>

      {timeslots ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {timeslots.map((time) => (
              <Button
                id="601"
                userEventName="timeslot-selection"
                key={time}
                customStyle={`p-2 hover:bg-blue-50 hover:border-blue-500 rounded-xl transition-colors border ${
                  activeTimeSlot === time
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                onClick={() => handleTimeSlotClick(time)}
              >
                {time}
              </Button>
            ))}
          </div>

          {/* Next Button */}
          {showNext && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                id="next-button"
                userEventName="next-step"
                customStyle="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                onClick={handleNextClick}
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">
          Please select a date on the calendar to view available time slots.
        </p>
      )}
    </div>
  );
};

const SidePanel = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
    <div className="p-6 space-y-6">
      {/* Duration Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Duration</h3>
        </div>
        <p className="text-gray-600">15 minutes</p>
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-200" />

      {/* Meeting Type Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Video className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Meeting Type</h3>
        </div>
        <p className="text-gray-600">Zoom Meeting</p>
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-200" />

      {/* Timezone Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Timezone</h3>
        </div>
        <p className="text-gray-600">Asia/Kolkata</p>
      </div>
    </div>
  </div>
);

const Bookings: React.FC<CalendarProps> = ({
  currentView,
  onViewChange,
  onDateRangeChange,
  events,
}) => {
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.handleViewChange("month");
    }
  }, []);

  const handleRangeChange = (
    range: Date[] | { start: Date; end: Date },
    view?: View
  ) => {
    if (typeof onDateRangeChange === "function") {
      if (Array.isArray(range)) {
        onDateRangeChange({
          start: range[0],
          end: range[range.length - 1],
        });
      } else if (range && "start" in range) {
        onDateRangeChange(range);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-center flex-col items-center gap-4">
        <h1 className="text-xl font-bold text-blue-500">Bookings Calendar</h1>
        <p className="text-gray-600 mb-6">
          Plan your day and book your slot effortlessly using the VrynoKalendar.
          Click on available slots to schedule your meetings or appointments.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 w-full mx-auto">
        {/* Side Panel */}
        <div className="col-span-2">
          <SidePanel />
        </div>

        {/* Calendar and Time Slots */}
        <div className="col-span-10 grid grid-cols-12 gap-6">
          {/* Calendar */}
          <div className="col-span-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <Calendar
                ref={calendarRef}
                localizer={localizer}
                events={events}
                dayLayoutAlgorithm="no-overlap"
                views={["day", "week", "month"]}
                defaultView="month"
                startAccessor="start"
                endAccessor="end"
                className="min-h-[600px] max-w-full" // Full width for calendar
                components={{
                  event: ({ event }) => (
                    <Link
                      href={`/crm/${event.data.module}/detail/${event.data.id}`}
                      className="block w-full px-1 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                      target="_blank"
                    >
                      {event.title}
                    </Link>
                  ),
                }}
                onView={(view) => {
                  if (currentView !== view) onViewChange(view);
                }}
                onRangeChange={handleRangeChange}
                onSelectSlot={(slotInfo) => {}}
                selectable={true}
              />
            </div>
          </div>

          {/* Available Slots Section */}
          <div className="col-span-4">
            <TimeSlots />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;

// Define a custom layout
Bookings.getLayout = (page: React.ReactElement) => {
  return page;
};
