const AppsStore = () => {
  const Apps = [
    {
      name: "Google Calendar",
      icon: "https://app.cal.com/app-store/googlecalendar/icon.svg",
      description: "Sync your events effortlessly with Google Calendar.",
    },
    {
      name: "Google Meet",
      icon: "https://app.cal.com/app-store/googlevideo/logo.webp",
      description: "Schedule and join video calls with Google Meet.",
    },
    {
      name: "Zoom",
      icon: "https://app.cal.com/app-store/zoomvideo/icon.svg",
      description: "Host and join virtual meetings with Zoom.",
    },
    {
      name: "Outlook Calendar",
      icon: "https://app.cal.com/app-store/office365calendar/icon.svg",
      description: "Integrate with Outlook for seamless scheduling.",
    },
    {
      name: "Microsoft Teams",
      icon: "https://app.cal.com/app-store/office365video/icon.svg",
      description: "Collaborate and communicate with Teams.",
    },
    {
      name: "Discord",
      icon: "https://app.cal.com/app-store/discord/icon.svg",
      description: "Stay connected with communities on Discord.",
    },
    {
      name: "PayPal",
      icon: "https://app.cal.com/app-store/paypal/icon.svg",
      description: "Manage your payments and transactions with PayPal.",
    },
    {
      name: "Stripe",
      icon: "https://app.cal.com/app-store/stripepayment/icon.svg",
      description: "Process payments securely with Stripe.",
    },
    {
      name: "Zapier",
      icon: "https://app.cal.com/app-store/zapier/icon.svg",
      description: "Automate workflows across multiple apps.",
    },
    {
      name: "Salesforce",
      icon: "https://app.cal.com/app-store/salesforce/icon.png",
      description: "Enhance CRM with Salesforce integrations.",
    },
  ];

  return (
    <div className="h-auto px-4 py-8 flex justify-center items-center">
      <div className="bg-white flex flex-col justify-center items-center h-auto w-11/12 max-w-screen-lg p-8 rounded-2xl shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
          Streamline Your Ecosystem with <h1 className="text-xl text-blue-500">VrynoKalender Sync</h1>
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Easily integrate with your favorite apps and tools to make scheduling and collaboration more efficient.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {Apps.map((app, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <img
                src={app.icon}
                alt={app.name}
                className="w-16 h-16 mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {app.name}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppsStore;
