import Button from "../../../../components/TailwindControls/Form/Button/Button";

export const ReportTabComponent = ({
  selectedTab,
  onSelectedTab,
}: {
  selectedTab: "parameter" | "customView";
  onSelectedTab: (value: "parameter" | "customView") => void;
}) => {
  return (
    <div className="px-6 pt-5 flex gap-x-6 md:w-1/3">
      <div>
        <Button
          id={"report-parameter-tab"}
          buttonType={selectedTab === "parameter" ? "pointedDownBox" : "thin"}
          onClick={() => onSelectedTab("parameter")}
          paddingStyle={"py-2 px-6"}
          userEventName="reports-parameters:tab-click"
        >
          <p>Parameters</p>
        </Button>
      </div>
      <div>
        <Button
          id={"report-customView-tab"}
          buttonType={selectedTab === "customView" ? "pointedDownBox" : "thin"}
          onClick={() => onSelectedTab("customView")}
          paddingStyle={"py-2 px-6"}
          userEventName="reports-customView:tab-click"
        >
          <p className="whitespace-nowrap">Custom View</p>
        </Button>
      </div>
    </div>
  );
};
