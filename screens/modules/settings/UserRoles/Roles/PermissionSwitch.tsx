import Switch from "react-switch";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { BlockedTogglePermission } from "../../../../../shared/constants";
import { IModulePermissions } from "./Permissions";

export const PermissionSwitch = ({
  moduleListData,
  handleToggle,
  modulePermissionData,
  toggleLoader,
}: {
  moduleListData: IModuleMetadata;
  handleToggle: (e: boolean, record: IModuleMetadata) => void;
  modulePermissionData: IModulePermissions;
  toggleLoader: boolean;
}) => {
  let visibleValue = false;
  if (moduleListData.name === modulePermissionData.module) {
    visibleValue = modulePermissionData.isVisible;
  }

  return (
    <Switch
      id={"switch-button"}
      name={"permission-switch"}
      checked={visibleValue}
      onChange={(e) => {
        handleToggle(e, moduleListData);
      }}
      onColor="#4DBE8D"
      offColor="#DBDBDB"
      width={44}
      height={23}
      handleDiameter={12}
      disabled={
        BlockedTogglePermission.includes(moduleListData.name)
          ? true
          : toggleLoader
      }
    />
  );
};
