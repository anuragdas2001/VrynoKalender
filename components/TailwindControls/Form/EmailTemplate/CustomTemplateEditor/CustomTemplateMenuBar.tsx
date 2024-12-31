import React from "react";
import { propertyType } from "./CustomTemplateEditorWrapper";

type CustomTemplateMenuBarProps = {
  properties: propertyType[];
  currentSelectedProperty: propertyType;
  setCurrentSelectedProperty: (value: propertyType) => void;
};

export const CustomTemplateMenuBar = ({
  properties,
  currentSelectedProperty,
  setCurrentSelectedProperty,
}: CustomTemplateMenuBarProps) => {
  return (
    <div
      className={`w-full flex items-center justify-between p-4 border-b border-gray-200`}
    >
      {properties
        ?.filter((property) => property.visible !== false)
        .map((property, index) => (
          <div
            className={`w-full flex items-center justify-center `}
            key={index}
          >
            <div
              onClick={
                currentSelectedProperty === property
                  ? () =>
                      setCurrentSelectedProperty({
                        name: "normal",
                        label: "",
                        icon: <></>,
                        style: "",
                        startTag: "<p>",
                        endTag: "</p>",
                        visible: false,
                      })
                  : () => setCurrentSelectedProperty(property)
              }
              className={`${
                currentSelectedProperty === property
                  ? "text-vryno-theme-blue"
                  : "text-black"
              } hover:text-vryno-theme-light-blue cursor-pointer`}
            >
              {property.icon}
            </div>
          </div>
        ))}
    </div>
  );
};
