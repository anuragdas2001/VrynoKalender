import { useFormikContext } from "formik";
import { MixpanelActions } from "../../../../../Shared/MixPanel";
import { InfoMessage } from "../../../shared/components/InfoMessage";
import { ICustomField } from "../../../../../../models/ICustomField";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import FormRadioButton from "../../../../../../components/TailwindControls/Form/RadioButton/FormRadioButton";

export const BulkImportStepTwoContent = ({
  currentModuleLabel,
  handleBICriteriaUpdate,
  fieldsList,
}: {
  currentModuleLabel: string;
  handleBICriteriaUpdate: (
    fieldName: string,
    value: string | null | boolean
  ) => void;
  fieldsList: ICustomField[];
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <div
      style={{
        height: (window.innerHeight * 4) / 6,
      }}
      className="mt-6 sm:mt-10 md:mt-12 w-full h-full flex flex-col items-center justify-center px-6"
    >
      <div
        className={`w-full max-w-[600px] flex flex-col h-full rounded-xl px-6 py-4 bg-white`}
      >
        <FormRadioButton
          name={"mappingMode"}
          label="What do you want to do with the records in the file?"
          required={true}
          options={[
            {
              value: "create",
              label: `Add as new ${currentModuleLabel}`,
            },
            {
              value: "update",
              label: `Update existing ${currentModuleLabel} only`,
            },
          ]}
          onChange={(selectedOption) => {
            setFieldValue("mappingMode", selectedOption.currentTarget.value);
            handleBICriteriaUpdate(
              "mappingMode",
              selectedOption.currentTarget.value
            );
          }}
          showOptionsInRow={true}
        />
        {values["mappingMode"] == "update" ? (
          <FormDropdown
            name={"updateOn"}
            label={`Update existing ${currentModuleLabel} based on`}
            options={[
              { value: "---", label: "---" },
              ...fieldsList.map((field) => {
                return {
                  value: field.name,
                  label: field.label.en,
                };
              }),
              ,
            ]}
            onChange={(selectedOption) => {
              setFieldValue(
                "updateOn",
                selectedOption.currentTarget.value === "---"
                  ? null
                  : selectedOption.currentTarget.value
              );
              handleBICriteriaUpdate(
                "updateOn",
                selectedOption.currentTarget.value === "---"
                  ? null
                  : selectedOption.currentTarget.value
              );
            }}
            required={true}
          />
        ) : (
          <></>
        )}
        <FormDropdown
          name="skipOn"
          label={`Skip existing ${currentModuleLabel} based on`}
          options={[
            { value: "---", label: "---" },
            ...fieldsList.map((field) => {
              return {
                value: field.name,
                label: field.label.en,
              };
            }),
          ]}
          onChange={(selectedOption) => {
            setFieldValue(
              "skipOn",
              selectedOption.currentTarget.value === "---"
                ? null
                : selectedOption.currentTarget.value
            );
            handleBICriteriaUpdate(
              "skipOn",
              selectedOption.currentTarget.value === "---"
                ? null
                : selectedOption.currentTarget.value
            );
          }}
        />
        {values["mappingMode"] == "update" ? (
          <SwitchToggle
            name={"updateEmptyValues"}
            label={"Update empty values"}
            labelLocation="Left"
            onChange={() => {
              setFieldValue("updateEmptyValues", !values["updateEmptyValues"]);
              MixpanelActions.track(
                `switch-boolean-field-${"updateEmptyValues"}:toggle-click`,
                {
                  type: "switch",
                }
              );
              handleBICriteriaUpdate(
                "updateEmptyValues",
                !values["updateEmptyValues"]
              );
            }}
            value={values["updateEmptyValues"]}
            allowMargin={true}
          />
        ) : (
          <></>
        )}
        <div className={`w-full h-full flex items-end justify-end`}>
          <InfoMessage
            messageType="information"
            message="Fields are auto-mapped as long as you are following our sample csv file."
          />
        </div>
      </div>
    </div>
  );
};
