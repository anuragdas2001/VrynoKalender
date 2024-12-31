import Button from "../Form/Button/Button";
import React from "react";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";

export default function ExpandCollapseIcon({
  setShowDetails,
  showDetails,
  kind = "icon",
  getExtendedValue,
}: {
  setShowDetails: (show: boolean) => void;
  showDetails: boolean;
  kind?: "icon" | "iconInverted";
  getExtendedValue?: (extended: boolean) => void;
}) {
  return (
    <Button
      id="open-card"
      kind={kind}
      buttonType={kind}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDetails(!showDetails);
        if (getExtendedValue) {
          getExtendedValue(showDetails);
        }
      }}
      userEventName="expand-collapse-icon-click"
    >
      {showDetails ? (
        <ChevronUpIcon size={16} />
      ) : (
        <ChevronDownIcon size={16} />
      )}
    </Button>
  );
}
