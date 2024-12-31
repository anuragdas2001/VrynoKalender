import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "next-i18next";
import { useFormikContext } from "formik";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { IRole } from "../../../../../../models/shared";

export type RoleCreationFormFieldsPrpos = {
  editMode: boolean;
  saveLoading: boolean;
  rolesData: IRole | null;
  userRoles: { label: string; value: string }[];
  handleSave: () => void;
  onCancel: () => void;
};

const RoleCreationFormFields = ({
  editMode,
  saveLoading,
  userRoles,
  rolesData,
  handleSave,
  onCancel,
}: RoleCreationFormFieldsPrpos) => {
  const { t } = useTranslation(["common"]);
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const defaultKeys = ["instance-owner", "instance-admin"];

  React.useEffect(() => {
    if (editMode && rolesData) {
      rolesData.key
        ? setFieldValue("copyFrom", rolesData.key)
        : setFieldValue(
            "copyFrom",
            userRoles?.filter((role) => role.value === "instance-user")[0]
              ?.value
          );
    }
  }, []);

  return (
    <div className="w-full">
      <div className={"w-full grid gap-x-6"}>
        <FormInputBox
          name="role"
          label="Role Name"
          type="text"
          disabled={[
            "instance-user",
            "instance-admin",
            "instance-owner",
          ].includes(rolesData?.key || "")}
        />
        {!editMode &&
          ![...defaultKeys, "instance-user"].includes(rolesData?.key || "") && (
            <FormDropdown
              name="copyFrom"
              placeholder="Please select a role"
              options={userRoles.filter(
                (obj) => !defaultKeys.includes(obj.value)
              )}
              label={t("Copy Permissions From")}
              onChange={(selectedOption) => {
                setFieldValue("copyFrom", selectedOption.currentTarget.value);
              }}
            />
          )}
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          disabled={saveLoading}
          onClick={onCancel}
          kind="back"
          userEventName="userRole-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          loading={saveLoading}
          disabled={saveLoading}
          onClick={() => {
            handleSave();
          }}
          kind="primary"
          userEventName="userRole-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};

export default RoleCreationFormFields;
