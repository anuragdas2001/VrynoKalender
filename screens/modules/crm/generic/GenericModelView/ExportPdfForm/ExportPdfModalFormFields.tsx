import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "react-i18next";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { IEmailTemplate } from "../../../../../../models/shared";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { downloadFile } from "../../../shared/utils/downloadFile";
import { Config } from "../../../../../../shared/constants";
import { FormikValues, useFormikContext } from "formik";
import WarningFillIcon from "remixicon-react/ErrorWarningFillIcon";

type ExportPdfModalFormFieldsProps = {
  savingProcess: boolean;
  moduleTemplates: IEmailTemplate[];
  alreadyGenerated: boolean;
  currentGeneratedFile: any;
  setAlreadyGenerated: (value: boolean) => void;
  onCancel: (value: boolean) => void;
  handleSave: () => void;
  handleSaveNew: () => void;
};

export const ExportPdfModalFormFields = ({
  savingProcess,
  moduleTemplates,
  alreadyGenerated,
  currentGeneratedFile,
  setAlreadyGenerated,
  onCancel,
  handleSave,
  handleSaveNew,
}: ExportPdfModalFormFieldsProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  return (
    <>
      {alreadyGenerated && (
        <span className="w-full text-xsm flex items-center justify-center p-2 bg-gray-100 rounded-lg my-2">
          <WarningFillIcon className="mr-2 text-red-300" />
          {`There already exist a file associated to this template.`}
        </span>
      )}
      <FormInputBox name="name" label="File Name" required={true} />
      <FormDropdown
        name="templateId"
        label="Select Template"
        required={true}
        options={moduleTemplates?.map((template) => {
          return { label: template.name, value: template.id };
        })}
        onChange={(selectedOption) => {
          setFieldValue("templateId", selectedOption.currentTarget.value);
          setAlreadyGenerated(false);
        }}
      />
      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          onClick={
            alreadyGenerated
              ? () => {
                  downloadFile(
                    `${Config.metaPrivateUploadUrl()}crm/fileRegistry/${
                      currentGeneratedFile?.fileKey
                    }`,
                    values["name"]
                  );
                  onCancel(false);
                }
              : () => onCancel(false)
          }
          kind="back"
          disabled={savingProcess}
          userEventName="massEmail-job-save:cancel-click"
        >
          {alreadyGenerated ? "Download Existing" : t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          onClick={
            alreadyGenerated ? () => handleSaveNew() : () => handleSave()
          }
          loading={savingProcess}
          kind="primary"
          disabled={savingProcess}
          userEventName="massEmail-job-save:submit-click"
        >
          {alreadyGenerated ? "Generate New" : "Generate PDF"}
        </Button>
      </div>
    </>
  );
};
