import { ChangeEvent } from "react";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { IRole } from "../../../../../models/shared";
import { UserRoleChecklist } from "./UserRoleChecklist";
import { TFunction } from "i18next";

export const BasicUserInfoForm = ({
  roles,
  roleIds,
  handleCheckboxSelect,
  editMode,
  editModeValue,
  profileIdOptions,
  t,
}: {
  roles: IRole[];
  roleIds: string[];
  handleCheckboxSelect: (value: ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
  editModeValue: boolean;
  profileIdOptions: { value: string | null; label: string }[];
  t: TFunction<("settings" | "common")[], undefined, ("settings" | "common")[]>;
}) => {
  const options = roles?.map((obj: IRole) => {
    return { label: obj.role, value: obj.id };
  });

  return (
    <>
      <div className="flex gap-x-4 w-full flex-wrap md:flex-nowrap">
        <FormInputBox
          name="firstName"
          label={t("first-name-label")}
          type="text"
          required={editMode ? false : true}
          wFull={true}
          disabled={editModeValue}
        />
        <FormInputBox
          name="lastName"
          label={t("last-name-label")}
          type="text"
          required={editMode ? false : true}
          wFull={true}
          disabled={editModeValue}
        />
        <FormInputBox
          name="email"
          label={t("common:email-label")}
          type="text"
          required={editMode ? false : true}
          wFull={true}
          disabled={editModeValue}
        />
      </div>
      <UserRoleChecklist
        handleCheckboxSelect={handleCheckboxSelect}
        options={options.length > 0 ? options : []}
        roleIds={roleIds}
      />
      <FormDropdown
        name="profileId"
        label="Profile"
        options={profileIdOptions}
        disabled={false}
      />
    </>
  );
};
