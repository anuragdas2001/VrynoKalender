import { CalendarDays, Clock } from "lucide-react";

export const MeetingCard = ({ meeting, status }) => {
  // Get badge style based on meeting status
  const getBadgeStyle = () => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Past":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      {/* Card Header */}
      <div className="relative p-6 pb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getBadgeStyle()} mb-3`}
        >
          {status}
        </span>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">
          {meeting.title}
        </h3>
      </div>

      {/* Card Content */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <CalendarDays className="w-5 h-5 mr-3 text-blue-500" />
            <span>{formatDate(meeting.date)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-3 text-blue-500" />
            <span>{meeting.time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {status === "Upcoming" && (
            <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
              Join Meeting
            </button>
          )}
          <button
            className={`flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium ${
              status === "Upcoming" ? "" : "w-full"
            }`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
