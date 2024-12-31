import React from "react";
import { useTranslation } from "next-i18next";
import { ICustomField } from "../../../../../../../models/ICustomField";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormCheckBox from "../../../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import FormMultipleValuesDropdown from "../../../../../../../components/TailwindControls/Form/MultipleValuesDropdown/FormMultipleValuesDropdown";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import { FormikValues, useFormikContext } from "formik";
import _ from "lodash";

export type ModuleCreationFormFieldsPrpos = {
  editMode: boolean;
  fieldsList?: ICustomField[];
  saveLoading: boolean;
  modulesFetched: IModuleMetadata[];
  handleSave: () => void;
  onCancel: () => void;
  moduleData: IModuleMetadata | null | undefined;
};

const ModuleCreationFormFields = ({
  editMode,
  fieldsList = [],
  saveLoading,
  modulesFetched,
  handleSave,
  onCancel,
  moduleData,
}: ModuleCreationFormFieldsPrpos) => {
  const { t } = useTranslation(["common"]);
  const { values } = useFormikContext<FormikValues>();

  const errorMessage =
    moduleData?.label?.en === values["label"]
      ? ""
      : values["label"] &&
        modulesFetched?.findIndex(
          (module) =>
            _.get(module.label, "en", "").toLowerCase() ===
            values["label"].toLowerCase()
        ) !== -1
      ? "Module name already exist"
      : "";

  return (
    <div className="w-full">
      <div className={"w-full grid gap-x-6"}>
        <FormInputBox
          name="label"
          label="Name"
          type="text"
          externalError={errorMessage}
        />
        {!editMode ? (
          <FormCheckBox
            name="createNavigationItem"
            label="Create Navigation Item"
          />
        ) : (
          <></>
        )}
        <div className={`${editMode ? "" : "hidden"}`}>
          <FormMultipleValuesDropdown
            label={`Search by in module by`}
            name="searchByFields"
            options={fieldsList
              ?.filter(
                (field) =>
                  (field.dataType === "singleline" ||
                    field.dataType === "email") &&
                  field.name !== "recordStatus"
              )
              .map((field) => {
                return {
                  label: field?.label?.en,
                  value: field?.name,
                };
              })}
            limitSelectionTo={2}
            editMode={editMode}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-3">
        <Button
          id="cancel-form"
          disabled={saveLoading}
          onClick={onCancel}
          kind="back"
          userEventName="module-creation-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          loading={saveLoading}
          disabled={saveLoading || errorMessage !== ""}
          onClick={() => {
            handleSave();
          }}
          kind="primary"
          userEventName="module-creation-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};

export default ModuleCreationFormFields;
