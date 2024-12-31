// The following component do not use formik context and is there to mimic the behavior of the FormDropdown component

import React from "react";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import { ClickOutsideToClose } from "../../shared/ClickOutsideToClose";

export const ButtonDropdown = ({
  dropdownIcon = true,
  options,
  label,
  onClick,
  id,
}: {
  dropdownIcon?: boolean;
  options: { value: string; label: string }[];
  label?: string;
  onClick: (data: { value: string; label: string }) => void;
  id: string;
}) => {
  const [launchMenuVisible, setLaunchMenuVisible] = React.useState(false);
  const wrapperRef = React.useRef(null);
  ClickOutsideToClose(wrapperRef, (value: boolean) =>
    setLaunchMenuVisible(value)
  );

  return (
    <div className="col-span-2 relative inline-block text-left cursor-pointer">
      <button
        onClick={() => setLaunchMenuVisible(!launchMenuVisible)}
        data-testid={`quick-add-${id}-dropdown`}
      >
        {!launchMenuVisible ? (
          <ChevronDownIcon
            size={16}
            className="text-vryno-theme-light-blue mr-2"
          />
        ) : (
          <ChevronUpIcon
            size={16}
            className="text-vryno-theme-light-blue mr-2"
          />
        )}
      </button>
      {launchMenuVisible ? (
        <div
          className="origin-top-right z-10 absolute -right-1 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          ref={wrapperRef}
        >
          {options?.map((option, index) => (
            <button
              key={index}
              data-testid={`quick-add-${id}-${option.value}`}
              className={`w-full p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover`}
              onClick={(e) => {
                e.preventDefault();
                setLaunchMenuVisible(false);
                onClick(option);
              }}
            >
              <div>{option.label}</div>
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
