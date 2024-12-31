import React from "react";
import {
  CheckCircle2,
  Route,
  FileSpreadsheet,
  Send,
  Download,
  Mail,
  ChartBar,
} from "lucide-react";

const Routing = () => {
  const routingForm = [
    {
      title: "Create your first form",
      description:
        "With Routing Forms you can ask qualifying questions and route to the correct person or event type.",
      icon: <FileSpreadsheet size={48} className="text-orange-500" />,
    },
    {
      title: "Create your first route",
      description:
        "Route to the right person based on the answers to your form.",
      icon: <Route size={48} className="text-green-500" />,
    },
    {
      title: "Reporting",
      description: "See all incoming form data and download it as a CSV.",
      icon: <ChartBar size={48} className="text-blue-500" />,
    },
    {
      title: "Test Routing Form",
      description: "Test your routing form without submitting any data.",
      icon: <CheckCircle2 size={48} className="text-green-700" />,
    },
    {
      title: "Send Email to Owner",
      description: "Sends an email to the owner when the form is submitted.",
      icon: <Mail size={48} className="text-yellow-500" />,
    },
    {
      title: "Download responses",
      description: "Download all responses to your form in CSV format.",
      icon: <Download size={48} className="text-violet-700" />,
    },
  ];

  return (
    <div className="h-auto sm:h-screen flex flex-col justify-center items-center px-4 py-12 ">
      <div className="bg-white w-full max-w-screen-lg rounded-2xl p-8 shadow-lg">
        <h1 className="text-center text-xl text-blue-600 font-bold mb-8">
          Vryno Forms
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routingForm.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex items-center mb-4">
                {React.cloneElement(item.icon, {
                  className: `${item.icon.props.className} mb-2 mx-auto`,
                  size: 48
                })}
                <h3 className="text-xl font-bold text-gray-800 text-center w-full">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 h-12 px-6 rounded-xl text-white font-semibold">
            Create a Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Routing;