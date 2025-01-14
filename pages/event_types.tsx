import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "../components/TailwindControls/Form/Dropdown/Dropdown";
import { Formik, Form } from "formik";
import { CalendarPlus, Copy } from "lucide-react";
import EventForm from "../components/vrynoKalenderComponents/EventForm/EventForm";
import { meetingsData } from "../meeting";
import { events } from "../event";
import Button from "../components/TailwindControls/Form/Button/Button";
import { useRouter } from "next/navigation";
import IMAGES from "../images";
export interface Event {
  id: number;
  Workspace: string;
  Service: string;
  Duration: string;
  PreferredMeetingMode: string;
  StaffAssigned: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
}

interface MeetingsData {
  Upcoming: Meeting[];
  Pending: Meeting[];
  Past: Meeting[];
}

const event_types = () => {
  const dropdownOptions = [
    { label: "Select Meeting type", value: "" },
    { label: "One on One", value: "one-on-one" },
    { label: "Group Booking", value: "group-booking" },
    { label: "Resource Booking", value: "resource-booking" },
    { label: "Collective Booking", value: "collective-booking" },
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const [createdEvent, setCreatedEvent] = useState<Event[]>([...events]);
  const [isEventFormVisible, setIsEventFormVisible] = useState(false);
  const [isCopiedMap, setIsCopiedMap] = useState<{ [id: number]: boolean }>({});

  const router = useRouter();

  const handleCreateEvent = () => {
    setIsEventFormVisible(true);
  };

  const handleCancel = () => {
    setIsEventFormVisible(false);
  };
  const handleCopyLink = async (serviceName: string, eventId: number) => {
    try {
      const formattedServiceName = serviceName
        .toLowerCase()
        .replace(/\s+/g, "-");

      const url = `http://localhost:3000/bookings/anuragdas12921/${formattedServiceName}`;
      await navigator.clipboard.writeText(url);

      // Update copied state for the specific event
      setIsCopiedMap((prev) => ({
        ...prev,
        [eventId]: true,
      }));

      // Reset the copied state for this specific event after 2 seconds
      setTimeout(() => {
        setIsCopiedMap((prev) => ({
          ...prev,
          [eventId]: false,
        }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <section className="w-full min-h-screen px-4 py-6">
      {/* Header with Create Event button */}
      <div className="max-w-7xl mx-auto flex justify-between  mb-8">
        <h1 className="text-xl font-semibold text-blue-500">Event Types</h1>

        <Button
          id="104"
          type="button"
          name="create-event"
          kind="icon"
          userEventName="Create Event"
          customStyle="h-10 w-20 bg-blue-600 text-white px-4 rounded-lg flex items-center justify-center gap-2"
          onClick={handleCreateEvent}
          title="Create Event"
        >
          <CalendarPlus />
        </Button>
      </div>
      <div className="flex justify-center gap-4 mb-6">
        <img
          className="h-10 w-10 rounded-full"
          src="https://res.cloudinary.com/dgz1duuwu/image/upload/v1719236393/nu2oa9upb9n6kwjrjyxq.jpg"
          alt=""
        />
        <div className="flex flex-col justify-center items-start">
          <div className="font-semibold text-gray-800">Anurag Das</div>
          <Link href="" className="text-blue-500 hover:underline">
            https://vrynokalender.com/anuragdas12921
          </Link>
        </div>
      </div>

      {/* Event Form Modal */}
      {isEventFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <EventForm
              selectedEventType={selectedValue}
              setCreatedEvent={setCreatedEvent}
              createdEvent={createdEvent}
              handleCancel={handleCancel}
              setIsEventFormVisible={setIsEventFormVisible}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      {createdEvent && createdEvent.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdEvent.map((eventtype) => (
              <div
                key={eventtype.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-50 rounded-full p-3 flex-shrink-0">
                    <Image
                      src={IMAGES.BOOKINGS}
                      alt="Event Icon"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex-grow">
                    <span className="text-sm text-gray-500">
                      #{eventtype.id}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">
                      {eventtype.Service || "Event Title"}
                    </h3>
                  </div>
                  <div>
                    <Button
                      id="401"
                      userEventName="copy-link"
                      customStyle=""
                      onClick={() =>
                        handleCopyLink(eventtype.Service, eventtype.id)
                      }
                    >
                      <Copy className="text-blue-500" />
                      {isCopiedMap[eventtype.id] ? "Copied!" : ""}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">
                      {eventtype.Duration || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mode</span>
                    <span className="font-medium text-gray-900">
                      {eventtype.PreferredMeetingMode || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Workspace</span>
                    <span className="font-medium text-gray-900">
                      {eventtype.Workspace || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Staff</span>
                    <span className="font-medium text-gray-900">
                      {eventtype.StaffAssigned || "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    router.push(`/event_types/${eventtype.id}?tabName=setup`)
                  }
                  className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center mt-20">
          <div className="inline-flex p-4 rounded-full bg-blue-50 mb-6">
            <Image
              src="/icons/event-types.png"
              alt="Event types"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Create your initial event types
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
            Define custom event types for recurring meetings, including product
            demos, client calls, and team sessions.
          </p>
        </div>
      )}
    </section>
  );
};

export default event_types;
