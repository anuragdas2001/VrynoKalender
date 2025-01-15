import React, { useState } from "react";
import {
  Clock,
  Users,
  Calendar,
  User,
  Mail,
  UserPlus,
  Plus,
  X,
  ChevronRight,
  MessageSquare,
  MoveLeft
} from "lucide-react";
import { useRouter } from "next/router";
import Button from "../../../components/TailwindControls/Form/Button/Button";

const BookingForm = () => {
  const [guests, setGuests] = useState([{ email: "" }]);
  const router = useRouter();

  const addGuest = () => {
    setGuests([...guests, { email: "" }]);
  };

  const removeGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests);
  };

  const handleBack = () => {
    router.back();
  };
  const handleConfirmBooking = (event) =>{
    event.preventDefault();
    router.push("/bookings/confirmed")
  }
  return (
    <div className="flex flex-col lg:flex-row h-screen p-6 gap-6">
      {/* Left Side: Meeting Details */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-xl p-8 h-fit">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 font-medium mb-4 hover:text-blue-700 transition"
        >
          <MoveLeft className="w-10 h-10" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Meeting Details</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Meeting Name
            </h3>
            <p className="text-lg font-semibold text-gray-800">Team Sync</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Meeting Type
            </h3>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="text-lg font-semibold text-gray-800">One-on-One</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="text-lg font-semibold text-gray-800">30 minutes</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-lg font-semibold text-gray-800">
                Jan 15, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Booking Form */}
      <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Book a Meeting
        </h2>
        <form className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Guests Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Add Guests
              </label>
              <button
                type="button"
                onClick={addGuest}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Guest
              </button>
            </div>
            <div className="space-y-3">
              {guests.map((guest, index) => (
                <div key={index} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="guest@example.com"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeGuest(index)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="message"
            >
              Share Anything (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="message"
                rows="4"
                className="w-full pl-10 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                placeholder="Write any additional information or questions you'd like to share..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            id="801"
            onClick={handleConfirmBooking}
            userEventName="confirmbooking"
            type="button"
            customStyle="w-full bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Confirm Booking</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
BookingForm.getLayout = (page: React.ReactElement) => {
  return page;
};