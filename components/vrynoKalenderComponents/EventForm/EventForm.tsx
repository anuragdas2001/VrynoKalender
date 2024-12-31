import Image from "next/image";
import React from "react";
import IMAGES from "../../../images";
import Dropdown from "../../TailwindControls/Form/Dropdown/Dropdown";
import { Formik, Form } from "formik";
import Styles from "../../../styles/components/eventForm.module.css";
import Button from "../../TailwindControls/Form/Button/Button";
import FormInputBox from "../../TailwindControls/Form/InputBox/FormInputBox";
import { Event } from "../../../pages/event_types";
export const dropdownOptions = [
  // { label: "Select any", value: "Select any" },
  { label: "One on One", value: "one-on-one" },
  { label: "Group Booking", value: "group-booking" },
  { label: "Resource Booking", value: "resource-booking" },
  { label: "Collective Booking", value: "collective-booking" },
];
export const durationOptions = [
  { label: "15 Minutes", value: "15-minutes" },
  { label: "30 Minutes", value: "30-minutes" },
  { label: "1 Hour", value: "1-hour" },
];

export const staffAssignedOptions = [
  { label: "Random", value: "Random" },
  { label: "Anurag Das", value: "Anurag Das" },
  { label: "Subham Wadhwa", value: "Subham Wadhwa" },
  { label: "Inderpreet Singh", value: "Inderpreet Singh" },
];

export const preferredMeetingModeOptions = [
  { label: "Google Meet", value: "Google Meet" },
  { label: "Zoom", value: "Zoom" },
  { label: "Microsoft Teams", value: "Microsoft Teams" },
];

const EventForm = ({
  selectedEventType,
  setCreatedEvent,
  handleCancel,
  createdEvent,
  setIsEventFormVisible,
}: any) => {
  
   
  const handleSave = (values: any) => {
    const selectedMeetingMode = preferredMeetingModeOptions.find(
      (option) => option.value === values.meetingMode
    )?.label;

    const newEvent: Event = {
      id: Date.now(),
      Workspace: values.workspace,
      Service: values.serviceName,
      Duration: values.duration,
      PreferredMeetingMode: selectedMeetingMode || "",
      StaffAssigned: values.staffAssigned,
    };

    setCreatedEvent([...createdEvent, newEvent]);
    setIsEventFormVisible(false);
  };

  console.log(
    "Event Type",
    selectedEventType,
    "IsFormVisible",
    setIsEventFormVisible
  );
  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-screen h-screen z-[900] bg-[#00000088]">
      <div
        className={`w-6/12 mt-4 mx-auto rounded-md flex flex-col gap-4 ${Styles.customGradient}`}
      >
        <div className="bg-white flex justify-between items-center py-3 px-6 rounded-tl-md rounded-tr-md">
          <h1 className="flex justify-center items-center gap-3">
            <Image
              src={IMAGES.ADD}
              alt="add"
              width={30}
              height={30}
              className="bg-[#2f98ff] p-1 rounded-sm"
            />
            New Meeting
          </h1>
          <Image
            src={IMAGES.CLOSE}
            alt="close"
            width={20}
            height={20}
            objectFit="contain"
            className="cursor-pointer"
            onClick={handleCancel}
          />
        </div>

        <Formik
          initialValues={{
            workspace: selectedEventType || "Helo",
            serviceName: "",
            duration: "",
            meetingMode: "",
            staffAssigned: "",
          }}
          onSubmit={(values) => handleSave(values)}
        >
          {({ initialValues, values, setFieldValue }) => (
            <Form className="w-4/5 mx-auto overflow-y-auto">
              {/* Workspace Field */}
              <div className="w-full flex justify-start items-center gap-14">
                <label className="w-44 mt-2 flex justify-start items-center gap-1">
                  Workspace
                  <Image
                    src={IMAGES.MANDATORY}
                    alt="required"
                    width={5}
                    height={5}
                  />
                </label>
                <div className="w-80">
                  <Dropdown
                    name="workspace"
                    value={initialValues.workspace}
                    val={initialValues.workspace}
                    onChange={(e) => setFieldValue("workspace", e.target.value)}
                    options={dropdownOptions}
                  />
                </div>
              </div>

              {/* Staff Assigned Field */}
              <div className="w-full flex justify-start items-center gap-14 mt-4">
                <label className="w-44 mt-2 flex justify-start items-center gap-1">
                  Staff Assigned
                  <Image
                    src={IMAGES.MANDATORY}
                    alt="required"
                    width={5}
                    height={5}
                  />
                </label>
                <div className="w-80">
                  <Dropdown
                    name="staffAssigned"
                    value={values.staffAssigned}
                    onChange={(e) =>
                      setFieldValue("staffAssigned", e.target.value)
                    }
                    options={staffAssignedOptions}
                  />
                </div>
              </div>

              {/* Service Name Field */}
              <div className="w-full flex justify-start items-center gap-14 mt-4">
                <label className="w-44 mt-2 flex justify-start items-center gap-1">
                  Service Name
                  <Image
                    src={IMAGES.MANDATORY}
                    alt="required"
                    width={5}
                    height={5}
                  />
                </label>
                <div className="w-80">
                  <FormInputBox
                    type="text"
                    name="serviceName"
                    placeholder="Enter service name"
                  />
                </div>
              </div>

              {/* Duration Field */}
              <div className="w-full flex justify-start items-center gap-14 mt-4">
                <label className="w-44 mt-2 flex justify-start items-center gap-1">
                  Duration
                  <Image
                    src={IMAGES.MANDATORY}
                    alt="required"
                    width={5}
                    height={5}
                  />
                </label>
                <div className="w-80">
                  <Dropdown
                    name="duration"
                    value={values.duration}
                    onChange={(e) => setFieldValue("duration", e.target.value)}
                    options={durationOptions}
                  />
                </div>
              </div>

              {/* Preferred Meeting Mode Field */}
              <div className="w-full flex justify-start items-center gap-14 mt-4">
                <label className="w-44 mt-2 flex justify-start items-center gap-1">
                  Preferred Meeting Mode
                  <Image
                    src={IMAGES.MANDATORY}
                    alt="required"
                    width={5}
                    height={5}
                  />
                </label>
                <div className="w-80">
                  <Dropdown
                    name="meetingMode"
                    value={values.meetingMode}
                    onChange={(e) =>
                      setFieldValue("meetingMode", e.target.value)
                    }
                    options={preferredMeetingModeOptions}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="p-5 flex justify-center items-center gap-5">
                <Button
                  id="101"
                  type="submit"
                  name="save"
                  userEventName="onsubmit"
                >
                  Save
                </Button>
                <Button
                  id="102"
                  type="button"
                  name="cancel"
                  kind="secondary"
                  userEventName="onclick"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};


export default EventForm;
