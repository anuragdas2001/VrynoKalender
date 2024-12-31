import React from "react";
import { useTranslation } from "next-i18next";
import { FormikValues, useFormikContext } from "formik";
import { IEmailTemplate } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";
import { cookieUserStore } from "../../../../../../shared/CookieUserStore";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormSearchBox from "../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import FormRadioButton from "../../../../../../components/TailwindControls/Form/RadioButton/FormRadioButton";
import FormDateTimePicker from "../../../../../../components/TailwindControls/Form/DateTimePicker/FormDateTimePicker";
import EmailTemplateEditor from "../../../../../../components/TailwindControls/Form/EmailTemplate/EmailTemplateEditor";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../../shared/utils/getFieldsFromDisplayExpression";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";

export type SendEmailFormFieldsProps = {
  emailTemplates: IEmailTemplate[];
  onCancel: () => void;
  handleSave: () => void;
  selectedItems: Array<any>;
  appName: string;
  modelName: string;
  sendFrom?: string;
  recordsWithNoEmailValue?: Array<any>;
  fieldsList?: ICustomField[];
  user: User | null;
  handleSearchSelectedItems: (values: Array<any>) => void;
  savingProcess: boolean;
  currentModule?: IModuleMetadata;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
};

export const SendEmailFormFields = ({
  emailTemplates,
  onCancel,
  handleSave,
  selectedItems,
  appName,
  modelName,
  sendFrom,
  user,
  fieldsList = [],
  recordsWithNoEmailValue,
  handleSearchSelectedItems,
  currentModule,
  savingProcess = false,
  genericModels,
  allLayoutFetched,
}: SendEmailFormFieldsProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>();

  React.useEffect(() => {
    setFieldValue("sendFrom", cookieUserStore.getUserId());
    setFieldValue(
      "recordIds",
      selectedItems.length ? selectedItems.map((item) => item.id) : null
    );
  }, []);

  React.useEffect(() => {
    setFieldValue("sendFrom", sendFrom);
  }, [sendFrom]);

  const fieldDisplayExpression = getFieldsFromDisplayExpression(
    currentModule?.displayExpression
  );

  return (
    <>
      <div className={`max-h-[55vh] overflow-y-auto pr-1.5 card-scroll`}>
        <FormSearchBox
          name="recordIds"
          required={true}
          label="Send To"
          appName={"crm"}
          allowMargin={false}
          modelName={modelName}
          searchBy={
            currentModule
              ? evaluateDisplayExpression(
                  fieldDisplayExpression,
                  genericModels[currentModule?.name]?.layouts[0].config
                    .fields || []
                )
              : ["name"]
          }
          fieldDisplayExpression={
            currentModule ? fieldDisplayExpression : ["name"]
          }
          editMode={false}
          multiple={true}
          handleItemSelect={(items) => handleSearchSelectedItems(items)}
        />
        {emailTemplates?.filter(
          (template) => template.templateModuleName === modelName
        ).length > 0 &&
          !(
            values["subject"] ||
            (values["fileKey"] && values["fileKey"] !== "<p></p>")
          ) && (
            <>
              <FormDropdown
                name="templateId"
                label={"Select Template"}
                disabled={
                  values[`subject`] ||
                  (values["fileKey"] && values["fileKey"] !== "<p></p>")
                }
                options={[{ label: "None", value: "null" }].concat(
                  emailTemplates
                    ?.filter(
                      (template) => template.templateModuleName === modelName
                    )
                    ?.map((template) => {
                      return { label: template.name, value: template.id };
                    })
                )}
                onChange={(selectedOption: any) => {
                  setFieldValue(
                    "templateId",
                    selectedOption.currentTarget.value
                  );
                }}
              />
              {(!values["templateId"] || values["templateId"] === "null") && (
                <hr className="center-lineThrough" data-content={`OR`} />
              )}
            </>
          )}
        {(!values["templateId"] || values["templateId"] === "null") && (
          <FormInputBox
            name="subject"
            label="Mail Subject"
            required={true}
            disabled={values["templateId"] && values["templateId"] !== "null"}
          />
        )}
        {(!values["templateId"] || values["templateId"] === "null") && (
          <EmailTemplateEditor
            name="fileKey"
            label={
              emailTemplates?.filter(
                (template) => template.templateModuleName === modelName
              )?.length <= 0
                ? "Mail Body"
                : ""
            }
            data={(values as any)["fileKey"]}
            showFieldNote={modelName === "moduleTemplate" ? true : false}
            allowFileAttachments={modelName === "moduleTemplate" ? false : true}
            allowReverseLookups={modelName === "moduleTemplate" ? true : false}
            handleEditorChange={(value) => {
              setFieldValue("fileKey", value);
            }}
            isHtml={true}
            hideFonts={true}
            hideTable={true}
            user={user}
            modulesFetched={!currentModule ? [] : [currentModule]}
            appName={appName}
            currentModule={currentModule ? currentModule : undefined}
            moduleSelectorOptions={
              currentModule
                ? [currentModule]?.map((module) => {
                    return { value: module?.name, label: module?.label?.en };
                  })
                : []
            }
            fieldSelectorFieldList={fieldsList}
            uploadToUrl="public"
            disabled={values[`templateId`] && values["templateId"] !== "null"}
            editMode={false}
            modelName={"emailTemplate"}
            loading={false}
            limitHeight={true}
            showHtmlEditor={false}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            editorToggleButtonVisible={false}
            required={true}
          />
        )}
        <div className="hidden">
          <FormInputBox
            name="sendFrom"
            required={true}
            label="Send From"
            disabled={true}
          />
        </div>
        <div className="grid grid-cols-2 w-full gap-x-4">
          <FormRadioButton
            name="emailType"
            label="Send Options"
            required={true}
            options={[
              { value: "immediate", label: "Send Immediately" },
              { value: "scheduled", label: "Send Later" },
            ]}
            onChange={(e) => {
              handleChange(e);
              setFieldValue("scheduledDatetime", "");
            }}
          />
          {(values as any)["emailType"] === "scheduled" && (
            <FormDateTimePicker
              name="scheduledDatetime"
              required={true}
              label={"Select Date & Time"}
              type="datetime"
              modelName={modelName}
              user={user ?? undefined}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          onClick={() => onCancel()}
          kind="back"
          disabled={savingProcess}
          userEventName="massEmail-job-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          onClick={() => handleSave()}
          loading={savingProcess}
          kind="primary"
          disabled={
            savingProcess
              ? true
              : values["templateId"] && values["templateId"] !== "null"
              ? false
              : !values["templateId"] &&
                (!values["subject"] ||
                  !values["fileKey"] ||
                  values["fileKey"] === "<p></p>")
              ? true
              : values["templateId"] &&
                values["templateId"] === "null" &&
                (!values["subject"] ||
                  !values["fileKey"] ||
                  values["fileKey"] === "<p></p>")
              ? true
              : false
          }
          userEventName="massEmail-job-save:submit-click"
        >
          {recordsWithNoEmailValue && recordsWithNoEmailValue?.length > 0
            ? t("Done")
            : t("common:Send")}
        </Button>
      </div>
    </>
  );
};
