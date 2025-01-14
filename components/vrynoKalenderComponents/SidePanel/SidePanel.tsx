import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { ChevronRight } from "lucide-react"; // Import Lucide's ChevronRight icon

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
    <div className="w-64 h-screen flex-shrink-0 bg-white shadow-md">
      {/* Header Section */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Service</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your preferences</p>
      </div>

      {/* Navigation Container */}
      <nav className="space-y-1 px-4">
        {sidepanel.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all ${
              activeId === item.id
                ? "bg-gray-100 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            }`}
            type="button"
            onClick={() => handleClick(item.id, item.tabName)}
          >
            {/* Icon */}
            <span className="mr-3">{item.icon}</span>
            {/* Title */}
            <span>{item.title}</span>
            {/* ChevronRight Icon */}
            <ChevronRight
              className={`ml-auto h-4 w-4 ${
                activeId === item.id ? "text-blue-600" : "text-gray-400"
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SidePanel;
