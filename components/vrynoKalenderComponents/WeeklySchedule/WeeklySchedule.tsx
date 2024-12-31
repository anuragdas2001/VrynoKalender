import React, { useEffect } from "react";
import { Field } from "formik";
import TimePicker from "../../TailwindControls/Form/TimePicker/TimePicker";
import { daysOfWeek } from "../../../daysofweek";
import dayjs from "dayjs";
import FormTimePicker from "../../TailwindControls/Form/TimePicker/FormTimePicker";
const WeeklySchedule = ({ availabilityID, errors, touched, setFieldValue }) => {
  // Define your availability list
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

  // Find the selected availability based on the passed ID
  const selectedAvailability = availability.find(
    (av) => av.id === availabilityID
  );

  // Ensure there's an availability object
  if (!selectedAvailability) {
    return null;
  }

  // Debug: Log selected availability
  //   console.log('Selected Availability:', selectedAvailability);

  // Iterate over each day of the week and map it to the time slots
  return (
    <div className="space-y-6">
      {daysOfWeek.map((day) => {
        // Check if the day is in the selected availability's workDays
        const isWorkingDay = selectedAvailability.workDays.includes(day.name);

        // Find the timeSlots for the current day if it's a working day
        const timeSlot = isWorkingDay
          ? selectedAvailability.timeSlots[0] // Assuming one timeslot per availability object
          : null;

        // Debug: Log the timeSlot for the day
        // console.log(`TimeSlot for ${day.name}:`, timeSlot);

        return (
          <div
            key={day.key}
            className="grid grid-cols-3 gap-4 items-center  rounded-lg"
          >
            <h4 className="text-md font-semibold text-gray-700">{day.name}</h4>

            <div>
              {/* <Field
                id={`${day.key}Start`}
                key={`${day.key}Start`}
                name={`${day.key}Start`}
                component={TimePicker}
                placeholder="Start Time"
                value={timeSlot ? timeSlot.start : "12:00am"}
                // Optionally use setFieldValue to directly update Formik field value
                onChange={(value) => {
                  console.log("Onchange Value",value);
                  setFieldValue(`${day.key}Start`, value);
                }}
              /> */}
              {/* <TimePicker  name={day.key}/> */}
              <FormTimePicker
                key={`${day.key}Start`}
                name={`${day.key}Start`}
                placeholder="Start Time"
                value={timeSlot ? timeSlot.start : "12:00am"}
                // Optionally use setFieldValue to directly update Formik field value
                onChange={(value) => {
                  console.log("Onchange Value", value);
                  setFieldValue(`${day.key}Start`, value);
                }}
              />
              {errors[`${day.key}Start`] && touched[`${day.key}Start`] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[`${day.key}Start`]}
                </div>
              )}
            </div>

            <div>
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
        );
      })}
    </div>
  );
};

export default WeeklySchedule;
