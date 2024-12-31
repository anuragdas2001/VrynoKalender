import React from "react";
import { useRouter } from "next/router";
import { SendEmailForm } from "./SendEmailForm";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { IEmailSetting, IEmailTemplate } from "../../../../../../models/shared";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";

export type HandleEmailModalProps = {
  emailSetting: IEmailSetting | undefined;
  emailTemplates: IEmailTemplate[];
  appName: string;
  modelName: string;
  onCancel: (value: boolean) => void;
  selectedItems: Array<any>;
  recordsWithNoEmailValue?: Array<any>;
  handleSendEmail: (value: any) => void;
  handleRecordsWithNoEmailValue: (items: Array<any>) => void;
  savingProcess: boolean;
  user: User | null;
  currentModule?: IModuleMetadata;
  fieldsList: ICustomField[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
};

export const HandleEmailModal = ({
  emailSetting,
  emailTemplates,
  appName,
  modelName,
  selectedItems,
  recordsWithNoEmailValue,
  user,
  onCancel = () => {},
  handleSendEmail = () => {},
  handleRecordsWithNoEmailValue = () => {},
  savingProcess = false,
  currentModule,
  fieldsList,
  genericModels,
  allLayoutFetched,
}: HandleEmailModalProps) => {
  const router = useRouter();

  const [hasEmailFields, setHadEmailFields] = React.useState(false);
  const [emailFieldProcessed, setEmailFieldProcessed] = React.useState(false);

  React.useEffect(() => {
    if (fieldsList.length) {
      let hasEmailField = false;
      for (const field of fieldsList) {
        if (field.dataType === "email" && field.visible) {
          hasEmailField = true;
          break;
        }
      }
      setHadEmailFields(hasEmailField);
      setEmailFieldProcessed(true);
    }
  }, [fieldsList]);

  if (!emailFieldProcessed)
    return <ItemsLoader currentView={"List"} loadingItemCount={2} />;
  if (!hasEmailFields)
    return (
      <div className="py-10 text-center">
        No email fields with permission found
      </div>
    );

  return (
    <SendEmailForm
      emailTemplates={emailTemplates}
      sendFrom={emailSetting?.sendFrom}
      onCancel={() => onCancel(false)}
      selectedItems={selectedItems}
      recordsWithNoEmailValue={recordsWithNoEmailValue}
      appName={appName}
      modelName={modelName}
      fieldsList={fieldsList}
      currentModule={currentModule}
      user={user}
      handleSave={(values) => handleSendEmail(values)}
      handleRecordsWithNoEmailValue={(items) =>
        handleRecordsWithNoEmailValue(items)
      }
      savingProcess={savingProcess}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
    />
  );
};
