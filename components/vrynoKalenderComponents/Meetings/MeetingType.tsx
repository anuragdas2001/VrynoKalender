import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { meetingsData } from "../../../meeting";
import { MeetingCard } from "./MeetingCard";
import {
  ChevronRight,
  CalendarArrowDown,
  CalendarArrowUp,
  CalendarCog,
  CalendarX2,
} from "lucide-react";

const MeetingType = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  const tabs = [
    { id: "upcoming", label: "Upcoming", icon: <CalendarArrowDown className="text-green-500"/> },
    { id: "pending", label: "Pending", icon: <CalendarCog className="text-orange-500"/> },
    { id: "past", label: "Past", icon: <CalendarArrowUp className="text-gray-400"/> },
    { id: "cancelled", label: "Cancelled", icon: <CalendarX2 className="text-red-500"/> },
  ];

  // Sync URL with state
  useEffect(() => {
    const { type } = router.query;
    if (type && tabs.find((tab) => tab.id === type)) {
      setActiveTab(type);
    }
  }, [router.query]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/meetings/${tabId}`);
  };

  // Get current tab label
  const currentTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label || "Upcoming";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 h-full flex-shrink-0 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-blue-600">Meeting Type</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your meeting schedules
          </p>
        </div>
        <nav className="space-y-1 px-4">
          {tabs.map(({ id, label, icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all
                ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <span>{icon}</span>
                <span className="ml-3">{label}</span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {currentTabLabel} Meetings
        </h2>

        {meetingsData[currentTabLabel]?.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {meetingsData[currentTabLabel].map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                status={currentTabLabel}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8 bg-white p-8 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">
              No {currentTabLabel} Meetings
            </h3>
            <p className="text-gray-500">
              There are no meetings in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingType;
