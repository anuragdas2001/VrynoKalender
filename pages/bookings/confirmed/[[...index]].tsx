import React from 'react';
import { CheckCircle, Calendar, Clock, Mail } from 'lucide-react';
import Button from '../../../components/TailwindControls/Form/Button/Button';

const ConfirmedBookings = () => {
  const bookingDetails = {
    confirmationNumber: "VRK-2025-0123",
    eventName: "Business Conference Room",
    dateTime: {
      date: "January 20, 2024",
      startTime: "2:00 PM",
      endTime: "2:30 PM",
      timeZone: "IST"
    },
    email: "anurag.das@shubpy.com"
  };

  // Format the complete date and time string
  const fullDateTime = `${bookingDetails.dateTime.date}, ${bookingDetails.dateTime.startTime} - ${bookingDetails.dateTime.endTime} ${bookingDetails.dateTime.timeZone}`;

  return (
    <div className="h-screen flex justify-center flex-col items-center  px-4">
      <div className="max-w-screen-xl bg-white w-full rounded-lg shadow-lg p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Confirmation #{bookingDetails.confirmationNumber}
          </p>
        </div>

        {/* Calendar Notification */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <p className="text-blue-700">
              A calendar invitation has been sent to your email address.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Booking Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Event Name */}
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{bookingDetails.eventName}</p>
                <p className="text-sm text-gray-500">Event</p>
              </div>
            </div>

            {/* Date and Time with Timezone */}
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{fullDateTime}</p>
                <p className="text-sm text-gray-500">Date and Time</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{bookingDetails.email}</p>
                <p className="text-sm text-gray-500">Confirmation sent to</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-4">
          <Button id="701" userEventName="addtocalendar" customStyle="w-full bg-blue-600 text-white py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-700 transition-colors">
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedBookings;

// Define a custom layout
ConfirmedBookings.getLayout = (page: React.ReactElement) => {
  return page;
};