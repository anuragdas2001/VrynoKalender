import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "next-i18next";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormFilePicker from "../../../../../../components/TailwindControls/Form/FileDropper/FormFilePicker";

export type AttachmentFormFieldsProps = {
  editMode: boolean;
  saveLoading: boolean;
  handleSave: () => void;
  onCancel: () => void;
};

const AttachmentFormFields = ({
  editMode,
  saveLoading,
  handleSave,
  onCancel,
}: AttachmentFormFieldsProps) => {
  const { t } = useTranslation(["common"]);
  const [disabled, setDisabled] = React.useState(false);
  return (
    <div className="w-full">
      <div className={"w-full grid gap-x-6"}>
        <FormInputBox name="name" label="File Name" type="text" required />
        <FormFilePicker
          name="fileKey"
          label="Upload File"
          allowMultiple={false}
          modelNameToBeUsed={"attachment"}
          editMode={editMode}
          addFileNameToField={true}
          setDisabled={setDisabled}
          removedNameValue={""}
        />
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-upload-attachment"
          disabled={saveLoading || disabled}
          onClick={onCancel}
          kind="back"
          userEventName="attachment-file-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-upload-attachment"
          loading={saveLoading}
          disabled={saveLoading || disabled}
          onClick={() => {
            handleSave();
          }}
          kind="primary"
          userEventName="attachment-file-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};

export default AttachmentFormFields;
