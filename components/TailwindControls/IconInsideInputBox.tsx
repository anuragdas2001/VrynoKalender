import React from "react";

export enum IconLocation {
  Left = "Left",
  Right = "Right",
}
export function IconInsideInputBox(
  icon: React.ReactElement,
  iconLocation: IconLocation,
  onIconClick = () => {},
  disabled?: boolean,
  iconBelowPercentage?: string
) {
  const isLeftIcon = iconLocation === IconLocation.Left;
  const location = isLeftIcon ? "left-0" : "right-0";
  return (
    <div
      className={`${
        iconBelowPercentage ? "" : "absolute"
      } flex rounded-tl-lg rounded-bl-lg top-0 h-full w-10 ${location}`}
    >
      <div
        className={`flex items-center justify-center rounded-tl-lg rounded-bl-lg text-lg h-full w-full ${
          isLeftIcon ? "z-10" : ""
        } ${disabled ? "text-gray-300" : "text-gray-600"}`}
      >
        {isLeftIcon ? (
          icon
        ) : (
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              if (!disabled) onIconClick();
            }}
            className={`${disabled ? "cursor-default" : ""}`}
          >
            {icon}
          </a>
        )}
      </div>
    </div>
  );
}
