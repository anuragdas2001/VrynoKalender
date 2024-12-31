import React from "react";
import { Formik } from "formik";
import { IEmailTemplate } from "../../../../../../models/shared";
import { SendEmailFormFields } from "./SendEmailFormFields";
import * as Yup from "yup";
import WarningFillIcon from "remixicon-react/ErrorWarningFillIcon";
import moment from "moment";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";

let initialValues = {
  templateId: "",
  emailType: "",
  scheduledDatetime: null,
  recordIds: [],
  sendFrom: "",
  fileKey: "",
  attachmentFileKeys: "",
  subject: "",
};

export type SendEmailFormProps = {
  emailTemplates: IEmailTemplate[];
  onCancel: () => void;
  selectedItems: Array<any>;
  appName: string;
  modelName: string;
  sendFrom?: string;
  handleSave: (value: any) => void;
  recordsWithNoEmailValue?: Array<any>;
  user: User | null;
  handleRecordsWithNoEmailValue: (items: Array<any>) => void;
  savingProcess: boolean;
  currentModule?: IModuleMetadata;
  fieldsList?: ICustomField[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
};

let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const EmailErrorMessageComponent = ({ message }: { message: string }) => (
  <span className="w-full text-xsm flex items-center justify-center p-2 bg-gray-100 rounded-lg my-2">
    <WarningFillIcon className="mr-2 text-red-300" />
    {message}
  </span>
);

export const SendEmailForm = ({
  emailTemplates,
  onCancel,
  selectedItems,
  appName,
  modelName,
  sendFrom,
  user,
  handleSave,
  recordsWithNoEmailValue,
  currentModule,
  fieldsList = [],
  handleRecordsWithNoEmailValue = () => {},
  savingProcess = false,
  genericModels,
  allLayoutFetched,
}: SendEmailFormProps) => {
  const validationSchema = Yup.object().shape({
    recordIds: Yup.array()
      .of(Yup.string())
      .min(1, "Please add atleast one user")
      .required("Please add atleast one user")
      .nullable(),
    templateId: Yup.string().nullable(),
    scheduledDatetime: Yup.date().min(
      moment(yesterday).toISOString(),
      "You cannot schedule mail for past date."
    ),
  });

  const hasMaskedEmailField = fieldsList.some(
    (field) => field.dataType === "email" && field.visible && field.isMasked
  );

  return (
    <>
      {recordsWithNoEmailValue && recordsWithNoEmailValue?.length > 0 && (
        <EmailErrorMessageComponent
          message={`We are unable to send email ${
            selectedItems.length > 1
              ? "to some records, they don't"
              : ", it does not"
          } contain email.`}
        />
      )}
      {hasMaskedEmailField && (
        <EmailErrorMessageComponent message="We've detected a masked email field. Potential issues with job execution may occur." />
      )}
      <Formik
        initialValues={{ ...initialValues }}
        onSubmit={(values) => handleSave(values)}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <SendEmailFormFields
            emailTemplates={emailTemplates}
            onCancel={onCancel}
            handleSave={() => handleSubmit()}
            selectedItems={selectedItems}
            appName={appName}
            modelName={modelName}
            sendFrom={sendFrom}
            fieldsList={fieldsList}
            currentModule={currentModule}
            user={user}
            recordsWithNoEmailValue={recordsWithNoEmailValue}
            handleSearchSelectedItems={(items) =>
              handleRecordsWithNoEmailValue(items)
            }
            savingProcess={savingProcess}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
          />
        )}
      </Formik>
    </>
  );
};
