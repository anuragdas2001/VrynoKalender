import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "next-i18next";
import { useFormikContext } from "formik";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";

export type LinkFormFieldsProps = {
  editMode: boolean;
  saveLoading: boolean;
  handleSave: () => void;
  onCancel: () => void;
};

const LinkFormFields = ({
  editMode,
  saveLoading,
  handleSave,
  onCancel,
}: LinkFormFieldsProps) => {
  const { t } = useTranslation(["common"]);

  const { handleChange } = useFormikContext<Record<string, string>>();

  return (
    <div className="w-full">
      <div className={"w-full grid gap-x-6"}>
        <FormInputBox name="name" label="Name" type="text" required />
        <FormInputBox
          name="fileName"
          label="Enter Url"
          type="url"
          onChange={(e) => {
            handleChange(e);
          }}
          required
        />
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          disabled={saveLoading}
          onClick={onCancel}
          kind="back"
          userEventName="attachment-link-save:cancel-click"
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
          userEventName="attachment-link-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};

export default LinkFormFields;
