import { useState } from "react";
import { useRouter } from "next/router";
import { availability as initialAvailability } from "../../../availability";
import { Timezone } from "../../../timezone";
import { ChevronRight, Globe, Calendar, Clock, Plus } from "lucide-react";
import Button from "../../TailwindControls/Form/Button/Button";
import FormInputBox from "../../TailwindControls/Form/InputBox/FormInputBox";
import { Form, Formik } from "formik";

const Availability = () => {
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState(initialAvailability);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const initialValues = {
    "availability-name": "",
    "timezone": ""
  };

  const handleSubmit = (values) => {
    const newAvailability = {
      id: (availabilities.length + 1).toString(),
      eventId: (availabilities.length + 1).toString(),
      availabilityName: values["availability-name"],
      timeZone: values.timezone,
      workDays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      timeSlots: [{ start: "10:00", end: "17:00" }],
      isDefault: false,
    };
    setAvailabilities([...availabilities, newAvailability]);
    setIsPopupOpen(false);
  };

  const handleCardClick = (id) => {
    router.push(`/Custom_Availability/${id}`);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold text-blue-500 mb-6">Availability</h1>
          <Button
            id="201"
            userEventName="create-availability"
            customStyle="h-10 w-20 bg-blue-500 flex justify-center flex-col items-center"
            onClick={handleOpenPopup}
          >
            <Plus />
          </Button>
        </div>
        <p className="text-blue-950 mb-6">
          Configure times when you are available for bookings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availabilities.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
              onClick={() => handleCardClick(item.id)}
            >
              <div className="px-4 py-3 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium ">
                    {item.availabilityName}
                  </h2>
                  <ChevronRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>{item.timeZone}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-10 text-blue-500" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {item.workDays.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full shadow-sm border border-blue-200"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Available Times</span>
                  </div>
                  <div className="space-y-2">
                    {item.timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-blue-700">
                          {slot.start} - {slot.end}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold text-blue-900 mb-4">
                Create New Availability
              </h2>
              <p className="text-sm text-gray-700 mb-6">
                Add your availability details here.
              </p>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                  <Form>
                    <FormInputBox
                      name="availability-name"
                      label="Name"
                      placeholder="Enter name"
                    />
                    
                    <div className="mt-4 mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={values.timezone}
                        onChange={(e) => setFieldValue('timezone', e.target.value)}
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select a timezone</option>
                        {Timezone.timezones.map((region) => (
                          <optgroup key={region.region} label={region.region}>
                            {region.zones.map((zone) => (
                              <option key={zone.name} value={zone.name}>
                                {zone.name} ({zone.abbreviation}) {zone.offset}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleClosePopup}
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;