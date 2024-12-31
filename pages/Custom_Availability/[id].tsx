// Custom_Availability Component
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { daysOfWeek } from "../../daysofweek";
import FormTimePicker from "../../components/TailwindControls/Form/TimePicker/FormTimePicker";
import { availability } from "../../availability";

// Helper function to convert HH:mm string to Date object
const convertTimeToDate = (time) => {
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const Custom_Availability = () => {
  const params = useParams();
  const availabilityID = Number(params?.id);

  // Fetch availability name based on ID, with a fallback
  const [availabilityName, setAvailabilityName] = useState("");

  useEffect(() => {
    const availabilityItem = availability[availabilityID - 1]; // Subtract 1 to align with 0-based index
    if (availabilityItem) {
      setAvailabilityName(availabilityItem.availabilityName);
    } else {
      setAvailabilityName("Availability Not Found");
    }
  }, [availabilityID]);

  // Default times as Date objects
  const defaultTimes = daysOfWeek.reduce((acc, day) => {
    acc[`${day.key}Start`] = convertTimeToDate("09:00"); // 9:00 AM as Date object
    acc[`${day.key}End`] = convertTimeToDate("17:00"); // 5:00 PM as Date object
    return acc;
  }, {});

  if (!availabilityID) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500 font-semibold">
        Error: Invalid Route. Please provide a valid availability ID.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center p-6 items-center">
      <div className="w-full bg-white shadow-lg p-8 rounded-lg">
        <h1 className="text-xl font-bold text-center mb-4 text-blue-700">
          {availabilityName || "Loading..."}
        </h1>

        <Formik
          initialValues={defaultTimes}
          validationSchema={Yup.object(
            daysOfWeek.reduce((acc, day) => {
              acc[`${day.key}Start`] = Yup.date().required(
                "Start time is required"
              );
              acc[`${day.key}End`] = Yup.date().required(
                "End time is required"
              );
              return acc;
            }, {})
          )}
          onSubmit={(values) => {
            // Converting Date objects back to HH:mm string format for submission
            const formattedValues = Object.keys(values).reduce((acc, key) => {
              const time = values[key];
              const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
              acc[key] = formattedTime;
              return acc;
            }, {});
            console.log("Availability Submitted:", formattedValues);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              {daysOfWeek.map((day) => (
                <div key={day.key} className="mb-6">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Day Name */}
                    <h3 className="text-base font-semibold text-gray-700 text-center">
                      {day.name}
                    </h3>

                    {/* Start Time Picker */}
                    <div>
                      <FormTimePicker
                        name={`${day.key}Start`}
                        placeholder="Start Time"
                        value={values[`${day.key}Start`]}
                        onChange={(value) =>
                          setFieldValue(`${day.key}Start`, value)
                        }
                      />
                      {errors[`${day.key}Start`] &&
                        touched[`${day.key}Start`] && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors[`${day.key}Start`]}
                          </div>
                        )}
                    </div>

                    {/* End Time Picker */}
                    <div>
                      <FormTimePicker
                        name={`${day.key}End`}
                        placeholder="End Time"
                        value={values[`${day.key}End`]}
                        onChange={(value) =>
                          setFieldValue(`${day.key}End`, value)
                        }
                      />
                      {errors[`${day.key}End`] && touched[`${day.key}End`] && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors[`${day.key}End`]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
                >
                  Save Availability
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Custom_Availability;
