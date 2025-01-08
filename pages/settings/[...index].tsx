import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { settings } from "../../settings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const router = useRouter();

  const tabs = [
    { id: "general", label: "General" },
    { id: "calenders", label: "Calenders" },
    { id: "conferencing", label: "Conferencing" },
    { id: "appearance", label: "Appearance" },
  ];

  // Sync URL with state
  useEffect(() => {
    if (!router.isReady) return; // Wait for router to be ready

    const { type } = router.query;

    // Check if `type` matches any valid tab ID
    const matchedTab = tabs.find((tab) => tab.id === type);

    if (matchedTab) {
      setActiveTab(matchedTab.id);
    } else if (type !== undefined) {
      // Redirect to default if `type` is invalid
      router.replace("/settings/general");
    }
  }, [router.isReady, router.query]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/settings/${tabId}`);
  };

  // Get current tab data
  const currentTab = settings.find(
    (setting) => setting.url === `/settings/${activeTab}`
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
          <nav className="space-y-2">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === id
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {currentTab?.name} Settings
        </h2>
        <p className="text-gray-600 mb-6">
          {currentTab?.content?.description || "No description available."}
        </p>
        {currentTab?.content?.defaults ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Default Settings
            </h3>
            <ul className="space-y-3">
              {currentTab.content.defaults.map(({ name, value }) => (
                <li
                  key={name}
                  className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                >
                  <span className="text-gray-700">{name}</span>
                  <span className="text-gray-500">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">
            No default settings available for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;
