import React from "react";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import { VrynoLogo } from "../shared/LoginSignupContainer";
import { VrynoBlueIcon } from "../../../../components/TailwindControls/VrynoIcon";

const reasonsArrays = [
  "Discover the best leads",
  "Boost customer engagement",
  "Drive deals to closure",
  "Nurture existing customers with a smart comprehensive solution",
];

export const RegisterLeftScreen = () => {
  return (
    <>
      <div className="flex flex-col items-start w-80">
        <VrynoLogo />
        <span className="font-bold w-75 text-md mt-5.5 mb-10.5">
          Why Vryno CRM is the best CRM system for your company?
        </span>
        {reasonsArrays.map((reason, index) => (
          <div className="flex mb-11.5 w-3/4" key={index}>
            <div className="mr-2">{VrynoBlueIcon(CheckboxCircleFillIcon)}</div>
            <span className="text-sm">{reason}</span>
          </div>
        ))}
      </div>
    </>
  );
};
