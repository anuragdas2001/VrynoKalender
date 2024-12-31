import { Users } from "lucide-react";
import { Presentation } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { UserPlus } from "lucide-react";
import { Video } from "lucide-react";
import { Mail } from "lucide-react";

const Team = () => {
  const teams = [
    {
      name: "Collective Scheduling",
      icon: <Presentation color="blue" />,
      description: "Make it easy to book your team when everyone is available.",
    },
    {
      name: "Round Robin",
      icon: <RotateCcw color="orange" />,
      description:
        "Find the best person available and cycle through your team.",
    },
    {
      name: "Fixed round robin",
      icon: <UserPlus color="green" />,
      description:
        "Add one fixed attendee and round robin through a number of attendees.",
    },
    {
      name: "Vryno Recordings",
      icon: <Video color="red" />,
      description:
        "Recordings are only available as part of our teams plan. Upgrade to start recording your calls",
    },
    {
      name: "Send SMS to Vryno attendee",
      icon: <Mail color="purple" />,
      description: "Easily send meeting reminders via SMS to your attendees",
    },
  ];

  return (
    <div className="h-auto m-10  flex justify-center items-center">
      <div className="bg-white flex flex-col justify-center items-center h-auto w-11/12 max-w-screen-lg p-8 rounded-2xl shadow-2xl ">
        <Users className="h-12 w-12 md:h-20 md:w-20 mb-4" color="#4386ea" />
        <h1 className="text-xl font-semibold text-blue-500 text-center mb-4">
          VrynoKalender is Better with Teams
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Collaborate and stay organized with your team using VrynoKalender.
        </p>

        <div className="w-11/12 mt-8">
          <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
            {teams.map((team, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {team.icon}
                <h2 className="text-sm md:text-lg text-center font-medium text-gray-800 mt-2 mb-2">
                  {team.name}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 text-center">
                  {team.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button className="bg-blue-600 h-16 w-40 rounded-xl text-white">
            Create a Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
