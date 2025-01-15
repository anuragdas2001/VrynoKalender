import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { daysOfWeek } from "../../daysofweek";
import FormTimePicker from "../../components/TailwindControls/Form/TimePicker/FormTimePicker";
import { availability } from "../../availability";
import { Plus, X } from "lucide-react";

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

const CustomAvailability = () => {
  const params = useParams();
  const availabilityID = Number(params?.id);

  const [availabilityName, setAvailabilityName] = useState("");

  useEffect(() => {
    const availabilityItem = availability[availabilityID - 1];
    if (availabilityItem) {
      setAvailabilityName(availabilityItem.availabilityName);
    } else {
      setAvailabilityName("Availability Not Found");
    }
  }, [availabilityID]);

  const defaultTimes = daysOfWeek.reduce((acc, day) => {
    acc[`${day.key}Start`] = convertTimeToDate("09:00");
    acc[`${day.key}End`] = convertTimeToDate("17:00");
    return acc;
  }, {});

  const [extraTimeslots, setExtraTimeslots] = useState({});

  const addTimeSlot = (dayKey) => {
    setExtraTimeslots((prev) => ({
      ...prev,
      [dayKey]: [
        ...(prev[dayKey] || []),
        { start: convertTimeToDate("09:00"), end: convertTimeToDate("17:00") },
      ],
    }));
  };

  const removeTimeSlot = (dayKey, index) => {
    setExtraTimeslots((prev) => {
      const updatedTimes = prev[dayKey].filter((_, i) => i !== index);
      return { ...prev, [dayKey]: updatedTimes };
    });
  };

  const handleAdditionalTimeChange = (dayKey, index, field, value) => {
    setExtraTimeslots((prev) => {
      const updatedTimes = [...(prev[dayKey] || [])];
      updatedTimes[index] = { ...updatedTimes[index], [field]: value };
      return { ...prev, [dayKey]: updatedTimes };
    });
  };

  if (!availabilityID) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500 font-semibold">
        Error: Invalid Route. Please provide a valid availability ID.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-16 lg:px-40 py-8 flex flex-col items-center">
      <div className="w-full bg-white shadow-lg rounded-lg mt-10 p-6 md:p-12">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
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
            const formattedValues = Object.keys(values).reduce((acc, key) => {
              const time = values[key];
              const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
              acc[key] = formattedTime;
              return acc;
            }, {});
            console.log("Availability Submitted:", formattedValues);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {daysOfWeek.map((day) => (
                <div key={day.key} className="mb-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <h3 className="w-1/5 text-base font-semibold text-gray-700 text-center">
                        {day.name}
                      </h3>

                      <div className="flex items-center gap-x-6 w-3/5">
                        {/* Default Time Slot with Increased Space */}
                        <div className="flex items-center gap-x-20">
                          <FormTimePicker
                            name={`${day.key}Start`}
                            placeholder="Start Time"
                            value={values[`${day.key}Start`]}
                            onChange={(value) =>
                              setFieldValue(`${day.key}Start`, value)
                            }
                          />
                          <span className="text-gray-500 font-semibold">-</span>
                          <FormTimePicker
                            name={`${day.key}End`}
                            placeholder="End Time"
                            value={values[`${day.key}End`]}
                            onChange={(value) =>
                              setFieldValue(`${day.key}End`, value)
                            }
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addTimeSlot(day.key)}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Extra Time Slots with Increased Space */}
                    {extraTimeslots[day.key]?.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center ml-2 w-full mt-2"
                      >
                        <div className="flex items-center gap-x-6 w-3/5">
                          <div className="flex items-center gap-x-20">
                            <FormTimePicker
                              name={`${day.key}StartAdditional-${index}`}
                              placeholder="Start Time"
                              value={slot.start}
                              onChange={(value) =>
                                handleAdditionalTimeChange(
                                  day.key,
                                  index,
                                  "start",
                                  value
                                )
                              }
                            />
                            <span className="text-gray-500 font-semibold">
                              -
                            </span>
                            <FormTimePicker
                              name={`${day.key}EndAdditional-${index}`}
                              placeholder="End Time"
                              value={slot.end}
                              onChange={(value) =>
                                handleAdditionalTimeChange(
                                  day.key,
                                  index,
                                  "end",
                                  value
                                )
                              }
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(day.key, index)}
                          className="text-red-600 hover:text-red-800 flex items-center justify-center"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-8 text-center">
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

export default CustomAvailability;
