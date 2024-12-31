import { ConnectedDataProfile } from "./DataProfile/ConnectedDataProfile";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { ConnectedModuleDataSharingRules } from "./ModuleDataSharingRules/ConnectedModuleDataSharingRules";
import { TreeNodeClass } from "./utils/TreeNodeClass";
import { IProfileData } from "../../../../../models/DataSharingModels";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";

export const DataSharingContainer = ({
  moduleDataRulesInitialValue,
  setModuleDataRulesInitialValue,
  selectedView,
  setSelectedView,
  profileDataLoading,
  rootNode,
  setRootNode,
  allParentIdOptions,
  profileData,
  setProfileData,
  setAllParentIdOptions,
  profileDataDict,
  setProfileDataDict,
  moduleDataOverallLoading,
  moduleViewPermission,
  modulesData,
  moduleDataSharingRuleData,
  setModuleDataSharingRuleData,
}: {
  moduleDataRulesInitialValue: Record<string, boolean>;
  setModuleDataRulesInitialValue: (value: Record<string, boolean>) => void;
  selectedView: "Profile" | "Organization";
  setSelectedView: (value: "Profile" | "Organization") => void;
  profileDataLoading: boolean;
  rootNode: TreeNodeClass | null;
  setRootNode: (value: TreeNodeClass | null) => void;
  allParentIdOptions: { value: string | null; label: string }[];
  profileData: IProfileData[];
  setProfileData: (value: IProfileData[]) => void;
  setAllParentIdOptions: (
    value: {
      value: string | null;
      label: string;
    }[]
  ) => void;
  profileDataDict: Record<string, IProfileData[]>;
  setProfileDataDict: (value: Record<string, IProfileData[]>) => void;
  moduleDataOverallLoading: boolean;
  moduleViewPermission: boolean;
  modulesData: IModuleMetadata[];
  moduleDataSharingRuleData: Record<string, string>;
  setModuleDataSharingRuleData: (value: Record<string, string>) => void;
}) => {
  const updateInitialValues = (keyName: string, name: string) => {
    let updatedValues: Record<string, boolean> = {};
    for (const key in moduleDataRulesInitialValue) {
      if (key.split("-")[0] === name) updatedValues[key] = false;
      else updatedValues[key] = moduleDataRulesInitialValue[key];
    }
    setModuleDataRulesInitialValue({
      ...updatedValues,
      [keyName]: true,
    });
  };

  const ViewSelector = () => (
    <div className="px-6 mt-4 flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-6 w-full">
      <div>
        <Button
          id={"data-profile-button"}
          buttonType={selectedView === "Profile" ? "pointedDownBox" : "thin"}
          onClick={() => setSelectedView("Profile")}
          paddingStyle={"py-2 px-6"}
          userEventName="dataSharing-view-profile-click"
        >
          Profile
        </Button>
      </div>
      <div>
        <Button
          id={"module-data-sharing-rule-button"}
          buttonType={
            selectedView === "Organization" ? "pointedDownBox" : "thin"
          }
          onClick={() => setSelectedView("Organization")}
          paddingStyle={"py-2 px-6"}
          userEventName="dataSharing-view-organization-click"
        >
          Module Sharing Rules
        </Button>
      </div>
    </div>
  );

  return selectedView === "Profile" ? (
    <ConnectedDataProfile
      viewSelectorComponent={ViewSelector}
      loading={profileDataLoading}
      rootNode={rootNode}
      allParentIdOptions={allParentIdOptions}
      profileData={profileData}
      setProfileData={setProfileData}
      setRootNode={setRootNode}
      setAllParentIdOptions={setAllParentIdOptions}
      profileDataDict={profileDataDict}
      setProfileDataDict={setProfileDataDict}
    />
  ) : (
    <ConnectedModuleDataSharingRules
      loading={!moduleDataOverallLoading}
      viewPermission={moduleViewPermission}
      viewSelectorComponent={ViewSelector}
      modulesData={modulesData}
      moduleDataSharingRuleData={moduleDataSharingRuleData}
      moduleDataRulesInitialValue={moduleDataRulesInitialValue}
      setModuleDataSharingRuleData={setModuleDataSharingRuleData}
      updateInitialValues={updateInitialValues}
    />
  );
};
