import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

interface SidePanelProps {
  sidepanel: {
    id: string;
    title: string;
    tabName: string;
    description: string;
    icon: React.ReactNode;
  }[];
  serviceName?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ sidepanel, serviceName }) => {
  const [activeId, setActiveId] = useState<string>(sidepanel[0]?.id || "0");
  const router = useRouter();
  const { id } = useParams();
  const handleClick = (id: string, tabName: string) => {
    setActiveId(id);
    router.push(`/event_types/${id}?tabName=${tabName}`);
  };

  return (
    <div className="bg-white text-black p-4 shadow-md md:h-screen fixed top-0 md:static w-full md:w-1/4">
      {/* Service name header */}
      {/* <h2 className="text-xl font-semibold mb-4 md:mb-6">{serviceName}</h2> */}

      {/* Navigation container */}
      <nav className="w-full overflow-x-auto md:overflow-x-visible">
        {/* List container */}
        <ul className="flex flex-row md:flex-col min-w-max md:min-w-0 md:w-full">
          {sidepanel.map((item) => (
            <li
              key={item.id}
              className="list-none mr-4 md:mr-0 md:mb-4 last:mr-0 last:mb-0 md:w-full"
            >
              <button
                className={`flex items-center whitespace-nowrap p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  activeId === item.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-500 hover:text-white"
                }`}
                type="button"
                onClick={() => handleClick(id, item.tabName)}
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidePanel;
