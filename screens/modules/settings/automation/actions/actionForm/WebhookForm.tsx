import { useFormikContext } from "formik";
import React from "react";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormMultipleKeyValueInputBox from "../../../../../../components/TailwindControls/Form/MultipleKeyValueInputBox/FormMultipleKeyValueInputBox";

export type WebhookFormProps = {
  editMode: boolean;
  appName: string;
  modules: { value: string; label: string }[];
  webhookUrlMethods: { label: string; value: string; visible: boolean }[];
};

export const WebhookForm = ({
  editMode,
  appName,
  modules,
  webhookUrlMethods,
}: WebhookFormProps) => {
  const { values, setFieldValue, handleChange } =
    useFormikContext<Record<string, string>>();

  return (
    <>
      <FormDropdown
        required={true}
        name={`moduleName`}
        label={`Select Module`}
        options={modules}
        disabled={editMode || values["fields"]?.length > 0}
        onChange={(selectedOption) => {
          setFieldValue("moduleName", selectedOption.currentTarget.value);
        }}
      />
      <FormDropdown
        required={true}
        name={`webhookUrlMethod`}
        label={`Select Method`}
        options={webhookUrlMethods}
        onChange={(selectedOption) => {
          setFieldValue("webhookUrlMethod", selectedOption.currentTarget.value);
        }}
      />
      <div className="col-span-full">
        <FormInputBox
          required={true}
          name="webhookUrl"
          label={`URL to notify`}
          placeholder={`Example: https://www.yourdomain`}
        />
      </div>
      <div className="col-span-full">
        <FormMultipleKeyValueInputBox
          name="headers"
          type="text"
          label="Headers"
          editMode={editMode}
        />
      </div>
    </>
  );
};
