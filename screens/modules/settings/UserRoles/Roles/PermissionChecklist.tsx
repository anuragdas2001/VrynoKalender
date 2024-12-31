import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { BlockedPermissions } from "../../../../../shared/constants";
import { IModulePermissions, IPermissionList } from "./Permissions";

export const PermissionChecklist = ({
  modulePermissionData,
  permissionList,
  handleChecked,
  moduleListData,
  toggleLoader,
}: {
  moduleListData: IModuleMetadata;
  modulePermissionData: IModulePermissions;
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
  const moduleName = modulePermissionData.module;
  const dropdownOptionsValues = modulePermissionData.permissions.map(
    (perObj: { permissionKey: string; id: string; recordStatus: string }) => {
      const value = perObj.permissionKey?.split("-")[0];
      return {
        value: value,
        label: `${value?.[0].toUpperCase()}${value?.slice(1)}`,
        checked: perObj.recordStatus === "a" ? true : false,
        id: perObj.id,
      };
    }
  );

  let dropdownOptionsList: {
    key: string;
    label: string;
    value: string;
  }[] = [];
  for (const val of permissionList) {
    if (val.module === moduleName) {
      dropdownOptionsList = val.permissions;
    }
  }

  const handleCheckedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let notExist = true;
    const activeValue = e.target.value;
    const [action] = activeValue.split("-");
    if (dropdownOptionsValues?.length) {
      for (const val of dropdownOptionsValues) {
        if (val.value === action) {
          notExist = false;
          handleChecked(
            val.id,
            val.checked,
            moduleName,
            action,
            activeValue,
            moduleListData
          ); //permissionKey
          break;
        }
      }
    }
    if (notExist) {
      handleChecked(
        null,
        false,
        moduleName,
        action,
        activeValue,
        moduleListData
      );
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-5">
      {modulePermissionData.isVisible ? (
        dropdownOptionsList.map(
          (val: { value: string; label: string; key: string }) => {
            let checked = false;
            for (const dropdownOpt of dropdownOptionsValues) {
              if (
                dropdownOpt.value === val.value &&
                dropdownOpt.checked === true
              ) {
                checked = true;
              }
            }
            return (
              <div className="flex items-center" key={val.key}>
                <input
                  value={val.key}
                  type="checkbox"
                  id={val.key}
                  className="hover:text-emerald-400 mr-1 cursor-pointer"
                  checked={checked}
                  onChange={(e) => {
                    handleCheckedHandler(e);
                  }}
                  disabled={
                    BlockedPermissions.includes(val.key) ? true : toggleLoader
                  }
                />
                <label
                  htmlFor={val.key}
                  className={"cursor-pointer font-normal"}
                >
                  {val.label}
                </label>
              </div>
            );
          }
        )
      ) : (
        <div className="font-normal">No permission</div>
      )}
    </div>
  );
};
