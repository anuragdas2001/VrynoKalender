import React from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IEmailSetting, IEmailTemplate } from "../../../../../../models/shared";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import getValuesAtSameLevelFromDeepLevel from "../../../shared/utils/getValuesAtSameLevelFromDeepLevel";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import { HandleEmailModal } from "./HandleEmailModal";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { ICustomField } from "../../../../../../models/ICustomField";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { getDataObjectArray } from "../../../shared/utils/getDataObject";
import { getDataWithNoEmailValues } from "./getDataWithNoEmailValues";
import { convertDataFromUniquenameToName } from "./convertDataFromUniquenameToName";
import { NoViewPermission } from "../../../shared/components/NoViewPermission";
import { getVisibleFieldsArray } from "../../../shared/utils/getFieldsArray";
import { dataUploadHandler } from "../../../shared/utils/dataUploadHandler";
import { FormikValues } from "formik";
import { User } from "../../../../../../models/Accounts";
import { getCorrectTimezone } from "../../../../../../shared/dateTimeTimezoneFormatter";
import moment from "moment";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type SendEmailModalProps = {
  formHeading: string;
  selectedItems: Array<any>;
  modelName: string;
  appName: string;
  user: User | null;
  fieldsList: ICustomField[];
  currentModule?: IModuleMetadata;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  newItem?: (value: any) => void;
  onCancel: (value: boolean) => void;
};

export const SendEmailModal = ({
  formHeading,
  selectedItems,
  modelName,
  appName,
  user,
  fieldsList,
  currentModule,
  genericModels,
  allLayoutFetched,
  newItem = () => {},
  onCancel = () => {},
}: SendEmailModalProps) => {
  const { t } = useTranslation();
  const [emailTemplates, setEmailTemplates] = React.useState<IEmailTemplate[]>(
    []
  );
  let [selectedItemsPageCount, setSelectedItemsPageCount] = React.useState(1);
  const [emailTemplatesLoading, setEmailsTemplatesLoading] =
    React.useState<boolean>(true);
  const [emailSetting, setEmailSetting] = React.useState<IEmailSetting>();
  const [emailSettingsLoading, setEmailSettingsLoading] =
    React.useState<boolean>(true);
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);
  const [modelDataProcessing, setModelDataProcessing] =
    React.useState<boolean>(false);
  const [modelDataForSelectedItems, setModelDataForSelectedItems] =
    React.useState<any[]>([]);
  const [recordsWithNoEmailValue, setRecordsWithNoEmailValue] = React.useState<
    any[]
  >([]);
  const [emailTemplateViewPermission, setEmailTemplateViewPermission] =
    React.useState(true);
  const [
    emailConfigurationViewPermission,
    setEmailConfigurationViewPermission,
  ] = React.useState(true);

  useQuery<FetchData<IEmailTemplate>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
    variables: {
      modelName: "emailTemplate",
      fields: [
        "id",
        "name",
        "subject",
        "templateServiceName",
        "templateModuleName",
        "fileKey",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ],
      filters: [
        {
          operator: "is_empty",
          name: "templateType",
          value: ["${empty}"],
        },
      ],
    },
    onCompleted: (responseOnCompletion) => {
      setEmailsTemplatesLoading(false);
      if (responseOnCompletion?.fetch?.data?.length) {
        setEmailTemplates(responseOnCompletion.fetch.data);
      } else if (
        responseOnCompletion?.fetch.messageKey.includes("requires-view")
      ) {
        setEmailTemplateViewPermission(false);
      }
    },
  });

  useQuery<FetchData<IEmailSetting>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
    variables: {
      modelName: "emailConfiguration",
      fields: ["id", "provider", "config", "sendFrom", "replyTo"],
      filters: [],
    },
    onCompleted: (responseOnCompletion) => {
      setEmailSettingsLoading(false);
      if (responseOnCompletion?.fetch?.data?.length) {
        setEmailSetting(
          getValuesAtSameLevelFromDeepLevel(responseOnCompletion.fetch.data[0])
        );
      } else if (
        responseOnCompletion?.fetch.messageKey.includes("requires-view")
      ) {
        setEmailConfigurationViewPermission(false);
      }
    },
  });

  const [sendEmails] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
    onCompleted: (data) => {
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes(`-success`)
      ) {
        toast.success(`Email sent successfully`);
        setSavingProcess(false);
        newItem(data.save.data);
        onCancel(false);
        return;
      }
      setSavingProcess(false);
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const [saveEmailTemplate] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: modelName === "moduleTemplate" ? "crm" : "notify",
      },
    },
  });

  const handleSendEmail = async (values: any) => {
    setSavingProcess(true);

    let emailJobVariables: FormikValues = {
      id: null,
      modelName: "emailJob",
      saveInput: {
        recordIds: values.recordIds,
        emailType: values.emailType,
        templateId: values.templateId === "null" ? null : values.templateId,
        scheduledDatetime: values.scheduledDatetime
          ? user?.timezone
            ? getCorrectTimezone(values.scheduledDatetime, user?.timezone)
            : moment(values.scheduledDatetime).toISOString()
          : null,
      },
    };

    if (!values.templateId || values.templateId === "null") {
      const fileKey = await dataUploadHandler(
        values.fileKey,
        null,
        "emailTemplate",
        "notify"
      );

      let emailTemplateVariables: FormikValues = {
        name: values.subject,
        subject: values.subject,
        templateServiceName: "crm",
        templateModuleName: modelName,
        templateType: "quick_mail",
        fileKey: fileKey,
        attachmentFileKeys:
          values.attachmentFileKeys &&
          JSON.stringify(values.attachmentFileKeys),
      };

      try {
        await saveEmailTemplate({
          variables: {
            id: null,
            modelName: "emailTemplate",
            saveInput: {
              ...emailTemplateVariables,
            },
          },
        }).then(async (response) => {
          if (
            response.data.save.data &&
            response.data.save.data.id &&
            response.data.save.messageKey.includes("-success")
          ) {
            try {
              await sendEmails({
                variables: {
                  ...emailJobVariables,
                  saveInput: {
                    ...emailJobVariables.saveInput,
                    templateId: response.data.save.data.id,
                  },
                },
              });
            } catch (error: any) {
              setSavingProcess(false);
              if (error) toast.error(error.toString());
            }
            return;
          }
          toast.error("Mail sent failed");
          setSavingProcess(false);
          return;
        });
      } catch (error) {
        console.error(error);
        setSavingProcess(false);
        toast.error("Mail sent failed");
      }
    } else {
      try {
        await sendEmails({
          variables: emailJobVariables,
        });
      } catch (error: any) {
        setSavingProcess(false);
        if (error) toast.error(error.toString());
      }
    }
  };

  const handleRecordsWithNoEmailValue = (items: any[]) => {
    const itemsSearched = items?.filter((item) => item.values);
    const itemsPreSelected = items?.filter((item) => !item.values);
    let modelDataForPreSelectedWithEmail: any[] = [];
    let dataWithEmailValue: any[] = [];
    let dataWithNoEmailValue: any[] = [];
    const fieldsWithEmailDatatype = fieldsList?.filter(
      (field) => field.dataType === "email"
    );

    itemsPreSelected.forEach((item) => {
      if (
        modelDataForSelectedItems.findIndex(
          (mdfsItem) => mdfsItem.id === item.id
        ) !== -1
      )
        modelDataForPreSelectedWithEmail.push(
          modelDataForSelectedItems.filter(
            (mdfsItem) => mdfsItem.id === item.id
          )[0]
        );
    });

    const convertedItemsSearchedData = convertDataFromUniquenameToName(
      fieldsList,
      getDataObjectArray(
        itemsSearched?.map((item) => {
          return { ...item?.values, id: item?.rowId };
        })
      )
    );

    convertedItemsSearchedData?.forEach((modelData) => {
      fieldsWithEmailDatatype?.forEach((field) => {
        if (modelData[field?.name]) {
          if (
            dataWithEmailValue?.findIndex(
              (data) => data.id === modelData.id
            ) === -1
          )
            dataWithEmailValue.push(modelData);
        }
      });
    });

    convertedItemsSearchedData?.forEach((modelData) => {
      if (
        dataWithEmailValue.findIndex((data) => modelData.id === data.id) === -1
      )
        dataWithNoEmailValue.push(modelData);
    });

    setRecordsWithNoEmailValue(
      dataWithNoEmailValue.concat(
        getDataWithNoEmailValues(fieldsList, modelDataForPreSelectedWithEmail)
      )
    );
  };

  const [getModelData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setModelDataForSelectedItems([
          ...modelDataForSelectedItems,
          ...getDataObjectArray(responseOnCompletion.fetch.data),
        ]);
        setSelectedItemsPageCount(++selectedItemsPageCount);
        recursionFetchModelData(selectedItemsPageCount);
        return;
      } else if (responseOnCompletion?.fetch.messageKey.includes("view")) {
        Toast.error(responseOnCompletion?.fetch.message);
        setModelDataProcessing(false);
        return;
      } else if (responseOnCompletion?.fetch?.data?.length === 0) {
        setModelDataProcessing(false);
        return;
      } else {
        Toast.error(responseOnCompletion?.fetch.message);
        setModelDataProcessing(false);
        return;
      }
    },
  });

  const recursionFetchModelData = (pageNumber: number) => {
    getModelData({
      variables: {
        modelName: modelName,
        fields: getVisibleFieldsArray(fieldsList),
        pageNumber: pageNumber,
        filters: [
          {
            name: "id",
            operator: "in",
            value: selectedItems.map((item) => {
              return item?.id;
            }),
          },
        ],
      },
    });
  };

  React.useEffect(() => {
    if (fieldsList?.length > 0 && selectedItems?.length > 0 && appName) {
      setModelDataForSelectedItems([]);
      setSelectedItemsPageCount(1);
      setModelDataProcessing(true);
      recursionFetchModelData(1);
    }
  }, [fieldsList, selectedItems, appName]);

  React.useEffect(() => {
    if (modelDataForSelectedItems?.length > 0 && fieldsList?.length > 0) {
      setRecordsWithNoEmailValue(
        getDataWithNoEmailValues(fieldsList, modelDataForSelectedItems)
      );
    }
  }, [modelDataForSelectedItems, fieldsList]);

  return (
    <>
      <GenericFormModalContainer
        formHeading={formHeading}
        onCancel={() => onCancel(false)}
        extendedWidth={true}
      >
        {!emailTemplateViewPermission || !emailConfigurationViewPermission ? (
          <NoViewPermission
            modelName={`${
              !emailTemplateViewPermission ? "Email_Template" : ""
            } ${
              !emailConfigurationViewPermission ? "Email_Configuration" : ""
            }`.trim()}
            addPadding={false}
            shadow={false}
            entireMessage={false}
          />
        ) : emailSettingsLoading ||
          emailTemplatesLoading ||
          modelDataProcessing ? (
          <div className="w-full flex items-center justify-center">
            <Loading color="Blue" />
          </div>
        ) : (
          <HandleEmailModal
            emailSetting={emailSetting}
            emailTemplates={emailTemplates}
            appName={appName}
            modelName={modelName}
            currentModule={currentModule}
            onCancel={onCancel}
            selectedItems={modelDataForSelectedItems}
            recordsWithNoEmailValue={recordsWithNoEmailValue}
            user={user}
            handleSendEmail={handleSendEmail}
            handleRecordsWithNoEmailValue={(items) =>
              handleRecordsWithNoEmailValue(items)
            }
            savingProcess={savingProcess}
            fieldsList={fieldsList}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
          />
        )}
      </GenericFormModalContainer>
      <Backdrop />
    </>
  );
};
