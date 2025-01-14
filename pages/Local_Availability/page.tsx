import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Clock, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMemo } from "react";
import TimePicker from "../../components/TailwindControls/Form/TimePicker/TimePicker";
// Custom Time Picker Component
import { daysOfWeek } from "../../daysofweek";
import WeeklySchedule from "../../components/vrynoKalenderComponents/WeeklySchedule/WeeklySchedule";
// Availability data
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

const Local_Availability = ({ availabilityID }: any) => {
  console.log("availabilityID", availabilityID);
  const parseAvailability = (availabilityID) => {
    const schedule = daysOfWeek.reduce((acc, day) => {
      acc[day.key] = { start: null, end: null };
      return acc;
    }, {});

    const selectedSchedule = availability.find(
      (item) => item.id === availabilityID
    );

    if (selectedSchedule) {
      selectedSchedule.workDays.forEach((day) => {
        const key = day.toLowerCase();
        schedule[key] = {
          start: selectedSchedule.timeSlots[0]?.start || null,
          end: selectedSchedule.timeSlots[0]?.end || null,
        };
      });
    }

    return schedule;
  };

  const createTimeDate = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const initialSchedule = parseAvailability(availabilityID);

  const initialValues = useMemo(() => {
    return daysOfWeek.reduce((acc, day) => {
      acc[`${day.key}Start`] = createTimeDate(initialSchedule[day.key]?.start);
      acc[`${day.key}End`] = createTimeDate(initialSchedule[day.key]?.end);
      return acc;
    }, {});
  }, [availabilityID]);

  const validationSchema = Yup.object().shape(
    daysOfWeek.reduce((acc, day) => {
      acc[`${day.key}Start`] = Yup.date().nullable();
      acc[`${day.key}End`] = Yup.date()
        .nullable()
        .min(
          Yup.ref(`${day.key}Start`),
          `End time must be after start time for ${day.name}`
        );
      return acc;
    }, {})
  );

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Availability Schedule Submitted:", values);
    setSubmitting(false);
  };
  // console.log("initialSchedule", initialSchedule);
  // console.log("initialValues", initialValues);
  return (
    <div className="min-h-screen  ">
      <div className=" w-full mx-auto  ">
        <div className="p-6 sm:p-10">
          <div className="flex items-center mb-8 space-x-4">
            <Clock className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              {"Weekly Availability"}
            </h1>
          </div>
          <Formik
            key={availabilityID}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <WeeklySchedule
                  availabilityID={availabilityID}
                  errors={errors}
                  touched={touched}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Local_Availability;
