import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { settings } from "../../settings";
import {
  Settings2,
  Calendar,
  Video,
  Palette,
  ChevronRight,
  AlertCircle,
  KeyRound,
  List,
  Grid,
  CalendarIcon,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [layout, setLayout] = useState("list");
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [density, setDensity] = useState("comfortable");
  const [activeId, setActiveId] = useState<string>("0");

  const handleApplyChanges = () => {
    console.log("Applying settings:", {
      layout,
      theme,
      fontSize,
      density,
    });
  };
  const router = useRouter();

  const tabs = [
    { id: "general", label: "General", icon: <Settings2 /> },
    { id: "calenders", label: "Calenders", icon: <Calendar /> },
    { id: "conferencing", label: "Conferencing", icon: <Video /> },
    { id: "appearance", label: "Appearance", icon: <Palette /> },
    { id: "password", label: "Password", icon: <KeyRound /> },
  ];

  useEffect(() => {
    if (!router.isReady) return;

    const { type } = router.query;
    const matchedTab = tabs.find((tab) => tab.id === type);

    if (matchedTab) {
      setActiveTab(matchedTab.id);
    } else if (type !== undefined) {
      router.replace("/settings/general");
    }
  }, [router.isReady, router.query]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/settings/${tabId}`);
  };

  const currentTab = settings.find(
    (setting) => setting.url === `/settings/${activeTab}`
  );
  const handleLayoutChange = (e) => {
    setLayout(e.target.value); // Update the selected layout
  };

  // Function to handle applying the layout (could be expanded to perform actions)
  const handleApplyLayout = () => {
    console.log("Applying layout:", layout);
    // Add your logic to apply the selected layout
  };
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 h-full flex-shrink-0 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your preferences</p>
        </div>
        <nav className="space-y-1 px-4">
          {tabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all
                ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="ml-3">{item.label}</span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-start mt-6">
        <div className="mx-10 w-full bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentTab?.name} Settings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {currentTab?.content?.description ||
                  "No description available."}
              </p>
            </div>

            {/* Conditional Layout for /settings/calenders */}
            {activeTab === "calenders" ? (
              <div className="flex justify-center items-center flex-col space-y-6 py-8">
                <div className="w-full max-w-3xl rounded-md shadow-sm p-6 text-center">
                  <div className="flex justify-center items-center mb-6">
                    <div className="flex justify-center items-center bg-gray-100 rounded-full p-4">
                      <Calendar className="h-10 w-10 text-blue-500" />
                    </div>
                  </div>

                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    No Calendar Apps Connected
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    You don't have any calendar apps connected yet. Click the
                    button below to connect a calendar app.
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Connect Calendar Apps
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                {currentTab?.content?.defaults ? (
                  <div className="space-y-6">
                    {currentTab.content.defaults.map(({ name, value }) => (
                      <div
                        key={name}
                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Configure your {name.toLowerCase()} preferences
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{value}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      No settings available for this category.
                    </p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "appearance" ? (
              <div className="flex justify-center items-center flex-col  space-y-8 py-8">
                <div className="w-full ">
                  {/* Layout Selection */}
                  <div className="space-y-6 mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Layout
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { value: "list", icon: List, label: "List View" },
                        { value: "grid", icon: Grid, label: "Grid View" },
                        {
                          value: "calendar",
                          icon: CalendarIcon,
                          label: "Calendar View",
                        },
                      ].map(({ value, icon: Icon, label }) => (
                        <label
                          key={value}
                          className={`
                        flex flex-col items-center justify-center p-6 rounded-lg border
                        ${
                          layout === value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }
                        hover:shadow-lg cursor-pointer transition-all duration-200
                      `}
                        >
                          <input
                            type="radio"
                            name="layout"
                            value={value}
                            className="hidden"
                            checked={layout === value}
                            onChange={handleLayoutChange}
                          />
                          <div className="flex flex-col items-center space-y-4">
                            <Icon
                              className={`h-10 w-10 ${
                                layout === value
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-lg font-medium ${
                                layout === value
                                  ? "text-blue-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div className="space-y-6 mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Theme
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { value: "light", icon: Sun, label: "Light Mode" },
                        { value: "dark", icon: Moon, label: "Dark Mode" },
                        {
                          value: "system",
                          icon: Monitor,
                          label: "System Default",
                        },
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => setTheme(value)}
                          className={`
                          p-4 rounded-lg border ${
                            theme === value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300"
                          }
                          hover:shadow-md transition-all duration-200
                        `}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon
                              className={`h-5 w-5 ${
                                theme === value
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                theme === value
                                  ? "text-blue-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-4 mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Font Size
                    </h3>
                    <div className="flex flex-col space-y-2">
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>

                  {/* Density */}
                  <div className="space-y-4 mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Interface Density
                    </h3>
                    <div className="flex gap-4">
                      {["compact", "comfortable", "spacious"].map((value) => (
                        <button
                          key={value}
                          onClick={() => setDensity(value)}
                          className={`
                          px-4 py-2 rounded-lg border
                          ${
                            density === value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 text-gray-700"
                          }
                          hover:shadow-md transition-all duration-200 capitalize
                        `}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleApplyChanges}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
