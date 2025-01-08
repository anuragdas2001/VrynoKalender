import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <div className="h-20 w-full border-b-2 border-gray-300 flex flex-col justify-center">
          <h1 className="text-xl font-bold text-blue-500">Profile</h1>
          <span className="text-gray-600 font-medium">
            Manage your Vryno profile
          </span>
        </div>

        {/* Profile Picture Section */}
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
              <img
                className="h-full w-full rounded-full object-cover"
                src="https://res.cloudinary.com/dgz1duuwu/image/upload/v1719236393/nu2oa9upb9n6kwjrjyxq.jpg"
                alt="Profile"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Profile Picture
              </h2>
              <p className="text-sm text-gray-600">
                Add a professional image for your profile.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="h-10 w-40 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              Upload Avatar
            </button>
            <button className="h-10 w-40 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
              Remove
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Update Your Details
          </h2>
          <form>
            <input
              className="w-full h-12 rounded-lg p-4 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Enter your full name"
            />
            <input
              className="w-full h-12 rounded-lg p-4 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Enter your username"
            />
            <input
              className="w-full h-12 rounded-lg p-4 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Enter your email"
            />
            <textarea
              className="w-full h-40 rounded-lg p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write something about yourself"
            ></textarea>
            <button
              type="submit"
              className="w-full h-12 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 mt-4 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 border-t-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          <p className="text-sm text-gray-600 mt-2">
            Deleting your account is permanent and will remove all your data from
            our servers. This action cannot be undone.
          </p>
          <button
            className="mt-4 h-12 w-full bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete your account? This action cannot be undone."
                )
              ) {
                console.log("Account Deleted");
                // Add account deletion logic here
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;