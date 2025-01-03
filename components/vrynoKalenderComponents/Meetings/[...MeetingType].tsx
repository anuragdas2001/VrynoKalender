// pages/meetings/[type].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { meetingsData } from "../../../meeting";
import { MeetingCard } from "./MeetingCard";

const MeetingType = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "pending", label: "Pending" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
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
    console.log("tabId", tabId);
    setActiveTab(tabId);
    router.push(`/meetings/${tabId}`);
  };

  // Get current tab label
  const currentTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label || "Upcoming";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Meetings</h1>
          <nav className="space-y-2">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === id
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
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
