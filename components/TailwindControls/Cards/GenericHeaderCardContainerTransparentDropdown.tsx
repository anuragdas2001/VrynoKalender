import React from "react";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import Button from "../Form/Button/Button";

export type GenericHeaderCardContainerTransparentBackgroundType = {
  id?: string;
  children?: React.ReactElement;
  cardHeading: string;
  extended?: boolean;
  paddingY?: "py-5" | "py-3";
  marginBottom?: string;
  borderTop?: boolean;
  getExtendedValue?: (extended: boolean) => void;
  headerButton?: React.ReactElement;
};

export default function GenericHeaderCardContainerTransparentBackground({
  id,
  children,
  cardHeading,
  extended = false,
  paddingY = "py-5",
  marginBottom = "mb-3",
  borderTop = false,
  getExtendedValue = (extended: boolean) => {},
  headerButton,
}: GenericHeaderCardContainerTransparentBackgroundType) {
  const [showDetails, setShowDetails] = React.useState(extended);
  return (
    <div id={id}>
      <div className={`relative ${marginBottom}`}>
        <Button
          id="generic-transparent-card-container-header"
          customStyle={`w-full bg-vryno-header-color cursor-pointer rounded-md px-6 ${paddingY}`}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDetails(!showDetails);
            if (getExtendedValue) {
              getExtendedValue(showDetails);
            }
          }}
          userEventName="generic-transparent-card-container-toggle-details-click"
        >
          <div className="flex justify-between">
            <p
              className={`font-medium text-sm`}
              data-testid={cardHeading || "card-heading"}
            >
              {cardHeading}
            </p>
            {showDetails ? (
              <span className="p-1 rounded-full bg-vryno-theme-light-blue text-white">
                <ChevronUpIcon size={16} />
              </span>
            ) : (
              <span className="p-1 rounded-full bg-vryno-theme-light-blue text-white">
                <ChevronDownIcon size={16} />
              </span>
            )}
          </div>
        </Button>
        <div className="absolute top-1.5 right-14">{headerButton}</div>
        {showDetails && (
          <div
            className={`w-full h-full bg-white mt-2 ${
              borderTop ? "border-t" : ""
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
