import { useState } from "react";
import { meetingsData } from "../../../meeting";
const Meeting = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");



  return (
    <div className="flex justify-center items-center h-screen p-6 bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="h-5/6 w-full max-w-5xl bg-white shadow-2xl rounded-lg p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Meetings</h1>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-6 sm:gap-12 mb-6">
          {["Upcoming", "Pending", "Past"].map((tab) => (
            <button
              key={tab}
              className={`font-semibold px-4 sm:px-2 py-2 rounded-md transition-all ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } text-sm sm:text-base lg:text-md`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold tracking-wider uppercase">Title</th>
                <th className="px-6 py-4 text-sm font-semibold tracking-wider uppercase">Date</th>
                <th className="px-6 py-4 text-sm font-semibold tracking-wider uppercase">Time</th>
              </tr>
            </thead>
            <tbody>
              {meetingsData[activeTab].length > 0 ? (
                meetingsData[activeTab].map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700">{meeting.title}</td>
                    <td className="px-6 py-4 text-gray-700">{meeting.date}</td>
                    <td className="px-6 py-4 text-gray-700">{meeting.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan="3">
                    No meetings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
