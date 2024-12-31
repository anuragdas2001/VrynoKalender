import { Smartphone, Workflow, Mail } from "lucide-react";
const WorkFlows = () => {
  // Workflow array of objects
  const workflows = [
    {
      id: 1,
      title: "Send SMS reminder 24 hours before event starts to attendee",
      icon: <Smartphone className="text-blue-500" />,
    },
    {
      id: 2,
      title: "Send custom SMS when event is rescheduled to attendee",
      icon: <Smartphone className="text-blue-500" />,
    },
    {
      id: 3,
      title: "Send custom email when new event is booked to host",
      icon: <Mail className="text-blue-500" />,
    },
    {
      id: 4,
      title: "Send email reminder 1 hour before event starts to attendee",
      icon: <Mail className="text-blue-500" />,
    },
    {
      id: 5,
      title: "Send custom email when event is rescheduled to host",
      icon: <Mail className="text-blue-500" />,
    },
    {
      id: 6,
      title: "Send custom SMS when new event is booked to host",
      icon: <Smartphone className="text-blue-500" />,
    },
  ];

  return (
    <div className="h-auto sm:h-screen flex flex-col justify-center items-center px-4 ">
      <div className="bg-white h-auto w-full max-w-screen-lg rounded-2xl p-8 shadow-lg">
        {/* Centered Workflow Icon */}
        <div className="flex justify-center mb-4">
          <Workflow className="text-blue-500 w-12 h-12" />
        </div>
        <h1 className="text-center text-xl font-semibold mb-6 text-blue-500">
          Vryno Workflows
        </h1>
        <p className="text-center text-gray-600 mb-10 leading-relaxed">
          Workflows enable simple automation to send notifications & reminders,
          enabling you to build processes around your events.
        </p>
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 flex items-center gap-4"
            >
              <div className="flex-shrink-0">{workflow.icon}</div>
              <p className="text-gray-700">{workflow.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button className="bg-blue-600 h-16 w-40 rounded-xl text-white">
                Create a Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkFlows;
