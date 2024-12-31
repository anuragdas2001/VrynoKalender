import { pascalCase } from "change-case";
import GenericHeaderCardContainerTransparentBackground from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainerTransparentDropdown";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { BlockedPermissionModules } from "../../../../../shared/constants";
import { PermissionList } from "./PermissionList";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { SettingsHeader } from "../../SettingsHeader";
import React from "react";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import { useWindowSize } from "../../../crm/shared/utils/useWindowSize";
import { IModulePermissions, IPermissionList } from "./Permissions";

export const ConnectedPermissionList = ({
  moduleList,
  modulePermissions,
  handleToggle,
  permissionList,
  handleChecked,
  toggleLoader,
  onServiceChange,
  currentRoleKey,
  additionalParts,
  fetchedAllPermission,
}: {
  moduleList: IModuleMetadata[];
  modulePermissions: IModulePermissions[] | null;
  handleToggle: (e: boolean, data: IModuleMetadata) => void;
  permissionList: IPermissionList[];
  handleChecked: (
    id: string | null,
    checked: boolean,
    modelName: string,
    action: string,
    permissionKey: string,
    record: IModuleMetadata
  ) => void;
  toggleLoader: boolean;
  onServiceChange: (serviceName: string) => void;
  currentRoleKey: string;
  additionalParts: string[];
  fetchedAllPermission: number;
}) => {
  const heightRef = React.useRef(null);
  const [width] = useWindowSize();
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef);
    }
  }, [width]);

  return (
    <>
      <SettingsHeader
        heading={"Role Permissions"}
        showButton={false}
        subHeading={
          additionalParts?.length === 4
            ? additionalParts[2].split("-").join(" ")
            : `${currentRoleKey.split("-").join(" ")}`
        }
      />

      <div className="px-6 pt-6 overflow-y-auto" ref={heightRef}>
        {/* <div className="flex w-full gap-x-6 max-w-sm mb-4">
          <Button
            id={"crm-service-button"}
            kind={
              additionalParts?.length >= 1 && additionalParts[1] === "crm"
                ? "next"
                : "secondary"
            }
            buttonType={
              additionalParts?.length >= 1 && additionalParts[1] === "crm"
                ? "pointedDownBox"
                : "thin"
            }
            onClick={(e) => {
              e.preventDefault();
              onServiceChange("crm");
            }}
            userEventName="permissions-crm:tab-click"
          >
            CRM
          </Button>
           <Button
            id={"workflow-service-button"}
            kind={
              additionalParts?.length >= 1 && additionalParts[1] === "workflow"
                ? "next"
                : "secondary"
            }
            buttonType={
              additionalParts?.length >= 1 && additionalParts[1] === "workflow"
                ? "pointedDownBox"
                : "thin"
            }
            onClick={(e) => {
              e.preventDefault();
              onServiceChange("workflow");
            }}
            userEventName="permissions-workflow:tab-click"
          >
            Workflow
          </Button>
          <Button
            id={"notify-service-button"}
            kind={
              additionalParts?.length >= 1 && additionalParts[1] === "notify"
                ? "next"
                : "secondary"
            }
            buttonType={
              additionalParts?.length >= 1 && additionalParts[1] === "notify"
                ? "pointedDownBox"
                : "thin"
            }
            onClick={(e) => {
              e.preventDefault();
              onServiceChange("notify");
            }}
            userEventName="permissions-notify:tab-click"
          >
            Notify
          </Button> 
        </div>*/}

        <div className="pt-4 px-4 pb-1 bg-white rounded-xl">
          {fetchedAllPermission !== 2 ? (
            <ItemsLoader currentView={"List"} loadingItemCount={4} />
          ) : moduleList?.length && modulePermissions?.length ? (
            <>
              {moduleList.map((item, index) => {
                if (
                  (additionalParts[1] !== "crm" &&
                    !BlockedPermissionModules.includes(item.name) &&
                    item.name !== "module") ||
                  (additionalParts[1] === "crm" &&
                    !BlockedPermissionModules.includes(item.name))
                ) {
                  return (
                    <GenericHeaderCardContainerTransparentBackground
                      cardHeading={item?.label?.en || pascalCase(item.name)}
                      extended={false}
                      key={`${item.name}_${index}`}
                      paddingY={"py-3"}
                    >
                      <>
                        {modulePermissions.map((val, index: number) => {
                          if (item.name === val.module)
                            return (
                              <PermissionList
                                key={`permission-${module}-key-${index}`}
                                moduleListData={item}
                                modulePermissionData={val}
                                handleToggle={handleToggle}
                                permissionList={permissionList}
                                handleChecked={handleChecked}
                                toggleLoader={toggleLoader}
                              />
                            );
                          return <span key={index}></span>;
                        })}
                      </>
                    </GenericHeaderCardContainerTransparentBackground>
                  );
                }
              })}
            </>
          ) : (
            <div className="text-sm pt-11 pb-14 text-center">
              <p>Something went wrong. Please contact admin.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
