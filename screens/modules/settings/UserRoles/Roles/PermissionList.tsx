import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { PermissionChecklist } from "./PermissionChecklist";
import { PermissionSwitch } from "./PermissionSwitch";
import { IModulePermissions, IPermissionList } from "./Permissions";

export const PermissionList = ({
  moduleListData,
  modulePermissionData,
  handleToggle,
  permissionList,
  handleChecked,
  toggleLoader,
}: {
  moduleListData: IModuleMetadata;
  modulePermissionData: IModulePermissions;
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
}) => {
  return (
    <div className="flex gap-10 font-medium text-sm pl-6">
      <div>
        <div className="mb-1">Status</div>
        <div>
          <PermissionSwitch
            moduleListData={moduleListData}
            modulePermissionData={modulePermissionData}
            handleToggle={handleToggle}
            toggleLoader={toggleLoader}
          />
        </div>
      </div>
      <div>
        <div className="mb-1">Permissions</div>
        <div>
          <PermissionChecklist
            moduleListData={moduleListData}
            modulePermissionData={modulePermissionData}
            permissionList={permissionList}
            handleChecked={handleChecked}
            toggleLoader={toggleLoader}
          />
        </div>
      </div>
    </div>
  );
};
