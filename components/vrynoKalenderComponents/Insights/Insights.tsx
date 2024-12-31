import { 
    CalendarCheck, 
    CalendarPlus, 
    CalendarSync, 
    CalendarX2, 
    LineChart 
  } from "lucide-react";
  
  const Insights = () => {
    // Insights data
    const insights = [
      {
        id: 1,
        title: "Created Events",
        value: "0",
        icon: <CalendarPlus className="text-blue-500 w-8 h-8" />,
      },
      {
        id: 2,
        title: "Completed Events",
        value: "0",
        icon: <CalendarCheck className="text-green-500 w-8 h-8" />,
      },
      {
        id: 3,
        title: "Rescheduled Events",
        value: "0",
        icon: <CalendarSync className="text-purple-500 w-8 h-8" />,
      },
      {
        id: 4,
        title: "Cancelled Events",
        value: "0",
        icon: <CalendarX2 className="text-red-500 w-8 h-8" />,
      },
    ];
  
    return (
      <div className="h-screen flex flex-col justify-center items-center px-6  py-12">
        <div className="bg-white h-auto w-full max-w-screen-lg rounded-2xl p-8 shadow-lg">
          {/* Centered LineChart Icon */}
          <div className="flex justify-center mb-4">
            <LineChart className="text-blue-500 w-10 h-10" />
          </div>
          <h1 className="text-center text-xl font-semibold mb-6 text-blue-500">
            Vryno Insights
          </h1>
          <p className="text-center text-gray-600 mb-10 leading-relaxed">
            Gain valuable insights into your events and audience to make informed
            decisions and optimize your processes.
          </p>
          <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-8">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 flex items-center gap-4"
              >
                <div className="flex-shrink-0">{insight.icon}</div>
                <div className="flex flex-col items-start">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">
                    {insight.title}
                  </h2>
                  <h1 className="text-xl font-semibold text-gray-700">
                    {insight.value}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Insights;
  