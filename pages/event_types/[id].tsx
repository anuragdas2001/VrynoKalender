import { events } from "../../event";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { availability } from "../../availability";
import Local_Availability from "../Local_Availability/page";
import { Recurring } from "../../components/vrynoKalenderComponents/Recurring/Recurring";
import {
  Clock,
  Users,
  VideoIcon,
  Link,
  Calendar,
  Repeat,
  Trash2,
  MoveLeft,
  Router,
  Text,
} from "lucide-react";
import IMAGES from "../../images";
import Image from "next/image";
import Button from "../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../components/TailwindControls/Form/InputBox/FormInputBox";
import Dropdown from "../../components/TailwindControls/Form/Dropdown/Dropdown";
import { dropdownOptions } from "../../components/vrynoKalenderComponents/EventForm/EventForm";
import { staffAssignedOptions } from "../../components/vrynoKalenderComponents/EventForm/EventForm";
import { durationOptions } from "../../components/vrynoKalenderComponents/EventForm/EventForm";
import { preferredMeetingModeOptions } from "../../components/vrynoKalenderComponents/EventForm/EventForm";
import SidePanel from "../../components/vrynoKalenderComponents/SidePanel/SidePanel";
import { useRouter } from "next/navigation";
import { Copy, Save } from "lucide-react";
import { useState } from "react";
import FormTextAreaBox from "../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface Availability {
  id: string;
  eventId: string;
  availabilityName: string;
  timeZone: string;
  workDays: string[];
  timeSlots: TimeSlot[];
  isDefault: boolean;
}

const EventTypes = () => {
  const { id } = useParams();
  const router = useRouter();
  const eventId = Number(id);
  const initialEvent = events.find((event) => event.id === eventId);
  const searchParams = useSearchParams();
  const tabName = searchParams.get("tabName");
  const [availabilityID, setAvailabilityID] = useState(availability[0]?.id);
  console.log(tabName);
  const handleSave = (values) => {
    console.log("Inside handleSave", values);
  };

  const handleCancel = () => {
    console.log("Inside handleCancel");
  };

  const handleBack = () => {
    console.log("");
    router.push("/event_types");
  };

  const initialValues = {
    workspace: initialEvent?.Workspace || "",
    serviceName: initialEvent?.Service || "",
    duration: initialEvent?.Duration || "",
    meetingMode: initialEvent?.PreferredMeetingMode || "",
    staffAssigned: initialEvent?.StaffAssigned || "",
  };
  const availabilityInitalvalues = {
    availability: availability[0]?.id || "",
  };
  const sidepanel = [
    {
      id: 1,
      title: "Event Setup",
      tabName: "setup",
      description: "Basic Event Setup",
      icon: <Link />,
    },
    {
      id: 2,
      title: "Availability",
      tabName: "availability_page",
      description: "Working Hours",
      icon: <Calendar />,
    },
    {
      id: 3,
      title: "Limits",
      tabName: "limits",
      description: "How often you can be booked",
      icon: <Clock />,
    },
    {
      id: 4,
      title: "Recurring",
      tabName: "recurring",
      description: "Setup a repeating schedule",
      icon: <Repeat />,
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="flex justify-center items-center gap-5"></div>
      <div className="mx-auto  shadow-xl rounded-lg border border-gray-100 overflow-hidden">
        <div className="text-black bg-white flex items-center px-6 shadow-md">
          <button onClick={handleBack} className="h-20 w-20">
            <MoveLeft size={48} />
          </button>
          <h2 className="text-xl text-blue-500 font-semibold">
            {initialEvent?.Service}
          </h2>
          <div className="flex justify-end items-center gap-4 ml-auto">
            <Button
              id="102"
              type="button"
              name="save"
              kind="icon"
              userEventName="onclick"
              customStyle="h-10 w-30  px-4 rounded-lg"
              onClick={handleCancel}
            >
              <Save />
            </Button>
            <Button
              id="103"
              type="button"
              name="copy"
              kind="icon"
              userEventName="onclick"
              customStyle="h-10 w-14 px-4 rounded-lg"
              onClick={handleCancel}
            >
              <Copy />
            </Button>
            <Button
              id="104"
              type="button"
              name="cancel"
              kind="icon"
              userEventName="onclick"
              customStyle="h-10 w-30 text-red-400 px-4 rounded-lg"
              onClick={handleCancel}
            >
              <Trash2 />
            </Button>
          </div>
        </div>

        <div className="flex ">
          {/* SidePanel */}
          <SidePanel
            sidepanel={sidepanel}
            serviceName={initialEvent?.Service}
          />
          {/* Form Section */}
          {tabName === "setup" ? (
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => handleSave(values)}
            >
              {({ values, setFieldValue }) => (
                <Form className="flex-1 p-8 space-y-8 bg-white rounded-lg shadow-sm">
                  {/* Basic Information Group */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Basic Information
                    </h3>

                    {/* Service Name Field */}
                    <div className="w-full flex items-center gap-8 hover:bg-gray-50/50 p-4 rounded-lg transition-colors border border-gray-100">
                      <label className="w-44 flex items-center gap-2">
                        <VideoIcon size={24} color="#F5A623" className="mr-2" />
                        Title
                        <Image
                          src={IMAGES.MANDATORY}
                          alt="required"
                          width={5}
                          height={5}
                          className="ml-1"
                        />
                      </label>
                      <div className="flex-1">
                        <FormInputBox
                          type="text"
                          name="serviceName"
                          placeholder="Enter service name"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Description Field */}
                    <div className="w-full flex items-center gap-8 hover:bg-gray-50/50 p-4 rounded-lg transition-colors border border-gray-100">
                      <label className="w-44 flex items-center gap-2">
                        <Text size={24} color="#F5A623" className="mr-2" />
                        Description
                        <Image
                          src={IMAGES.MANDATORY}
                          alt="required"
                          width={5}
                          height={5}
                          className="ml-1"
                        />
                      </label>
                      <div className="flex-1">
                        <FormTextAreaBox
                          name="description"
                          placeholder="A quick video meeting"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Workspace Field */}
                    <div className="w-full flex items-center gap-8 hover:bg-gray-50/50 p-4 rounded-lg transition-colors border border-gray-100">
                      <label className="w-44 flex items-center gap-2">
                        <Clock size={24} color="#4A90E2" className="mr-2" />
                        Workspace
                        <Image
                          src={IMAGES.MANDATORY}
                          alt="required"
                          width={5}
                          height={5}
                          className="ml-1"
                        />
                      </label>
                      <div className="flex-1">
                        <FormInputBox
                          type="text"
                          name="Workspace"
                          placeholder="Enter service name"
                          value={values.workspace}
                          disabled={true}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Staff Assigned Field */}
                    <div className="w-full flex items-center gap-8 hover:bg-gray-50/50 p-4 rounded-lg transition-colors border border-gray-100">
                      <label className="w-44 flex items-center gap-2">
                        <Users size={24} color="#E94E77" className="mr-2" />
                        Staff Assigned
                        <Image
                          src={IMAGES.MANDATORY}
                          alt="required"
                          width={5}
                          height={5}
                          className="ml-1"
                        />
                      </label>
                      <div className="flex-1">
                        <Dropdown
                          name="staffAssigned"
                          value={values.staffAssigned}
                          onChange={(e) =>
                            setFieldValue("staffAssigned", e.target.value)
                          }
                          options={staffAssignedOptions}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Meeting Details Group */}
                  <div className="space-y-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Meeting Details
                    </h3>

                    {/* Duration Field */}
                    <div className="w-full flex items-center gap-8 hover:bg-gray-50/50 p-4 rounded-lg transition-colors border border-gray-100">
                      <label className="w-44 flex items-center gap-2">
                        <Clock size={24} color="#7F8C8D" className="mr-2" />
                        Duration
                        <Image
                          src={IMAGES.MANDATORY}
                          alt="required"
                          width={5}
                          height={5}
                          className="ml-1"
                        />
                      </label>
                      <div className="flex-1">
                        <Dropdown
                          name="duration"
                          value={values.duration}
                          onChange={(e) =>
                            setFieldValue("duration", e.target.value)
                          }
                          options={durationOptions}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Preferred Meeting Mode Field */}
                    <div className="w-full flex items-center gap-8 hover:bg-gray-50/50 p-4 rounded-lg transition-colors border border-gray-100">
                      <label className="w-44 flex items-center gap-2">
                        <VideoIcon size={24} color="#9B59B6" className="mr-2" />
                        Preferred Meeting Mode
                        <Image
                          src={IMAGES.MANDATORY}
                          alt="required"
                          width={5}
                          height={5}
                          className="ml-1"
                        />
                      </label>
                      <div className="flex-1">
                        <Dropdown
                          name="meetingMode"
                          value={values.meetingMode}
                          onChange={(e) =>
                            setFieldValue("meetingMode", e.target.value)
                          }
                          options={preferredMeetingModeOptions}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          ) : tabName === "availability_page" ? (
            <div className="h-screen w-full bg-white">
              <Formik
                initialValues={availabilityInitalvalues}
                onSubmit={(values) => handleSave(values)}
              >
                {({ values, setFieldValue }) => (
                  <Form className="flex-1 p-8 space-y-6">
                    <div className="w-full flex justify-start items-center gap-8  p-2  ">
                      <label className="w-44 flex justify-start items-center gap-2">
                        <Calendar size={24} color="#4A90E2" className="mr-2" />
                        Availability
                        <Image
                          src={IMAGES.MANDATORY}
                          alt="required"
                          width={5}
                          height={5}
                          className="ml-1"
                        />
                      </label>
                      <div className="w-80">
                        <Dropdown
                          name="availability"
                          value={values.availability}
                          onChange={(e) => {
                            setFieldValue("availability", e.target.value); // Set the selected availability ID
                            setAvailabilityID(e.target.value); // Update the availabilityName based on selected ID
                          }}
                          options={availability.map((item) => ({
                            label: `${item.availabilityName} ${
                              item.isDefault ? "(Default)" : ""
                            }`,
                            value: item.id,
                          }))}
                        />
                      </div>
                    </div>
                    <Local_Availability availabilityID={availabilityID} />
                  </Form>
                )}
              </Formik>
            </div>
          ) : tabName === "recurring" ? (
            <Recurring />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EventTypes;
