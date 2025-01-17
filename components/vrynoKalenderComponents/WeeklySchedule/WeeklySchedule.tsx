import React from "react";
import FormTimePicker from "../../TailwindControls/Form/TimePicker/FormTimePicker";
import { daysOfWeek } from "../../../daysofweek";

const WeeklySchedule = ({ availabilityID, errors, touched, setFieldValue }) => {
  const availability = [
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

  const selectedAvailability = availability.find(
    (av) => av.id === availabilityID
  );

  if (!selectedAvailability) {
    return null;
  }

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day) => {
        const isWorkingDay = selectedAvailability.workDays.includes(day.name);
        const timeSlot = isWorkingDay
          ? selectedAvailability.timeSlots[0]
          : null;

        return (
          <div
            key={day.key}
            className="flex items-center  rounded-lg"
          >
            {/* Day Name */}
            <h4 className="text-md font-semibold text-gray-700 w-1/4">
              {day.name}
            </h4>

            {/* Time Pickers with Hyphen */}
            <div className="flex items-center justify-between gap-10">
              {/* Start Time Picker */}
              <div className="w-1/3">
                <FormTimePicker
                  key={`${day.key}Start`}
                  name={`${day.key}Start`}
                  placeholder="Start Time"
                  value={timeSlot ? timeSlot.start : "12:00am"}
                  onChange={(value) => {
                    setFieldValue(`${day.key}Start`, value);
                  }}
                />
                {errors[`${day.key}Start`] && touched[`${day.key}Start`] && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors[`${day.key}Start`]}
                  </div>
                )}
              </div>

              {/* Hyphen */}
              <div className="text-gray-700 font-medium text-center">-</div>

              {/* End Time Picker */}
              <div className="w-1/3">
                <FormTimePicker
                  key={`${day.key}End`}
                  name={`${day.key}End`}
                  placeholder="End Time"
                  value={timeSlot ? timeSlot.end : ""}
                  onChange={(value) => {
                    setFieldValue(`${day.key}End`, value);
                  }}
                />
                {errors[`${day.key}End`] && touched[`${day.key}End`] && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors[`${day.key}End`]}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklySchedule;
