import React from "react";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "next-i18next";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";

export type AddEditProductTaxFormFieldsPrpos = {
  editMode: boolean;
  saveLoading: boolean;
  handleSave: () => void;
  onCancel: () => void;
};

const AddEditProductTaxFormFields = ({
  editMode,
  saveLoading,
  handleSave,
  onCancel,
}: AddEditProductTaxFormFieldsPrpos) => {
  const { t } = useTranslation(["common"]);

  return (
    <div className="w-full">
      <div className="grid w-full gap-x-4 mt-3">
        <FormInputBox name="name" label="Name" required={true} />
        <FormInputBox
          name="value"
          label="Value"
          type="number"
          precision={2}
          required={true}
        />
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-3">
        <Button
          userEventName="cancel product tax form"
          id="cancel-form"
          disabled={saveLoading}
          onClick={onCancel}
          kind="back"
        >
          {t("common:cancel")}
        </Button>
        <Button
          userEventName="save product tax form"
          id="save-form"
          loading={saveLoading}
          disabled={saveLoading}
          onClick={() => handleSave()}
          kind="primary"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};

export default AddEditProductTaxFormFields;
