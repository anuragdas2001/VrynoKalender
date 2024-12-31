import React, { useContext, useEffect } from "react";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import { IEmailTemplate, SupportedApps } from "../../../../../models/shared";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { observer } from "mobx-react-lite";
import { GenericEmailScreen } from "./GenericEmailScreen";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { SendEmailModal } from "../GenericModelView/SendEmailForm/SendEmailModal";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { useTranslation } from "react-i18next";
import { UserStoreContext } from "../../../../../stores/UserStore";
import GeneralScreenLoader from "../../shared/components/GeneralScreenLoader";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";

const emailDataFields = [
  "id",
  "sendFrom",
  "replyTo",
  "recordIds",
  "status",
  "errorMessage",
  "totalRecords",
  "emailType",
  "scheduledDatetime",
  "updatedAt",
  "updatedBy",
  "createdAt",
  "createdBy",
  "templateId",
  "stats",
  "recordStatus",
];

const emailTypeMapper: Record<string, string[]> = {
  completed: ["completed", "cancelled", "skipped"],
  inProcess: ["pending", "processing", "hold", "scheduled"],
  error: ["error"],
};

interface IConnectedGenericEmailProps {
  modelName: string;
  appName: SupportedApps;
  fieldsList: ICustomField[];
  currentModule?: IModuleMetadata;
  id?: string;
}

const getEmailJobFilters = (
  selectedButton: string,
  emailTemplates: IEmailTemplate[]
) => {
  const filters = [
    {
      name: "status",
      operator: "in",
      value: emailTypeMapper[selectedButton],
    },
    {
      name: "templateId",
      operator: "in",
      value: emailTemplates?.map(
        (emailTemplate: IEmailTemplate) => emailTemplate?.id
      ),
    },
  ];
  // if (selectedButton === "inProcess")
  return [
    {
      operator: "in",
      name: "recordStatus",
      value: ["a", "i"],
    },
    ...filters,
  ];
  // return filters;
};

export const ConnectedGenericEmail = observer(
  ({
    appName,
    modelName,
    fieldsList,
    currentModule,
    id,
  }: IConnectedGenericEmailProps) => {
    const { t } = useTranslation();
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { genericModels, allLayoutFetched } = generalModelStore;
    const [emails, setEmails] = React.useState<Record<string, string>[]>([]);
    const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
    const [itemsCount, setItemsCount] = React.useState<number>(0);
    const [emailTemplates, setEmailTemplates] = React.useState<
      IEmailTemplate[]
    >([]);
    const [emailsFetchedLoading, setEmailsFetchedLoading] =
      React.useState<boolean>(true);
    const [emailTemplatesFetchedLoading, setEmailTemplatesFetchedLoading] =
      React.useState<boolean>(true);
    const [sendEmailModal, setSendEmailModal] = React.useState(false);
    const [selectedButton, setSelectedButton] =
      React.useState<string>("inProcess");
    const [cancelEmailJobModal, setCancelEmailJobModal] = React.useState<{
      visible: boolean;
      item: Record<string, string> | null;
    }>({ visible: false, item: null });
    const [cancelProcessing, setCancelProcessing] =
      React.useState<boolean>(false);
    const [statusChangeProcess, setStatusChangeProcess] = React.useState(false);

    const [getEmailsData] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "notify",
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data) {
          setEmails(responseOnCompletion.fetch.data);
          setItemsCount(responseOnCompletion.fetch.count);
        }
        setEmailsFetchedLoading(false);
      },
    });

    const [getEmailTemplates] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "notify",
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data?.length) {
          setEmailTemplates(responseOnCompletion.fetch.data);
          setEmailTemplatesFetchedLoading(false);
          setEmailsFetchedLoading(true);
          getEmailsData({
            variables: {
              modelName: "emailJob",
              fields: emailDataFields,
              filters: getEmailJobFilters(
                selectedButton,
                responseOnCompletion.fetch.data
              ),
            },
          });
          return;
        }
        setEmailsFetchedLoading(false);
        setEmailTemplatesFetchedLoading(false);
      },
    });

    const [cancelEmailJob] = useMutation(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "notify",
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (
          responseOnCompletion.save.data &&
          responseOnCompletion.save.data.id &&
          responseOnCompletion.save.messageKey.includes("-success")
        ) {
          Toast.success(responseOnCompletion.save.message);
          setCancelEmailJobModal({ visible: false, item: null });
          setEmails([
            ...emails.filter(
              (email) => email.id !== responseOnCompletion?.save?.data?.id
            ),
          ]);
          setCancelProcessing(false);
          return;
        }
        if (responseOnCompletion.save.messageKey) {
          Toast.error(responseOnCompletion.save.message);
          setCancelProcessing(false);
          return;
        }
        setCancelProcessing(false);
        Toast.error(t("common:unknown-message"));
      },
    });

    const [saveEmailJob] = useMutation(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "notify",
        },
      },
    });

    const handleEmailJobStatusChange = (
      id: string,
      recordStatus: "a" | "i"
    ) => {
      saveEmailJob({
        variables: {
          id: id,
          modelName: "emailJob",
          saveInput: { recordStatus: recordStatus },
        },
      }).then(async (responseOnCompletionRule) => {
        if (
          responseOnCompletionRule?.data?.save?.data &&
          responseOnCompletionRule.data.save.messageKey.includes("-success")
        ) {
          setEmails(
            emails.map((email) => {
              if (email.id === responseOnCompletionRule.data.save.data.id) {
                email.recordStatus = recordStatus;
              }
              return email;
            })
          );
          setStatusChangeProcess(false);
          Toast.success(responseOnCompletionRule.data.save.message);
        } else {
          setStatusChangeProcess(false);
          if (responseOnCompletionRule?.data?.save?.messageKey) {
            Toast.error(responseOnCompletionRule.data.save.message);
            return;
          }
          Toast.error(t("common:unknown-message"));
        }
      });
    };

    useEffect(() => {
      if (!modelName) return;
      getEmailTemplates({
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
              operator: "eq",
              name: "templateModuleName",
              value: modelName,
            },
          ],
        },
      });
    }, [modelName]);

    if (fieldsList.length <= 0 || !currentModule) {
      return <GeneralScreenLoader modelName={"..."} />;
    }

    return (
      <>
        {emailTemplatesFetchedLoading ? (
          <div className="p-6">
            {ItemsLoader({ currentView: "List", loadingItemCount: 4 })}
          </div>
        ) : (
          <GenericEmailScreen
            emails={
              emailTemplates?.length
                ? emails.map((email) => {
                    return {
                      ...email,
                      templateId: emailTemplates.filter(
                        (template) => template.id === email.templateId
                      )[0]?.name,
                    };
                  })
                : []
            }
            allEmails={emails}
            itemsCount={itemsCount}
            currentPageNumber={currentPageNumber}
            handlePageChange={(pageNumber) => {
              setCurrentPageNumber(pageNumber);
              setEmailsFetchedLoading(true);
              getEmailsData({
                variables: {
                  modelName: "emailJob",
                  fields: emailDataFields,
                  filters: getEmailJobFilters(selectedButton, emailTemplates),
                  pageNumber: pageNumber,
                },
              });
            }}
            emailTemplates={emailTemplates}
            emailFetchLoading={emailsFetchedLoading}
            appName={appName}
            modelName={modelName}
            selectedButton={selectedButton}
            setSendEmailModal={(value) => setSendEmailModal(value)}
            setSelectedButton={(value) => {
              setCurrentPageNumber(1);
              setItemsCount(0);
              setSelectedButton(value);
              setEmailsFetchedLoading(true);
              getEmailsData({
                variables: {
                  modelName: "emailJob",
                  fields: emailDataFields,
                  filters: getEmailJobFilters(value, emailTemplates),
                },
              });
            }}
            handleCancelEmail={(item) =>
              setCancelEmailJobModal({ visible: true, item: item })
            }
            statusChangeProcess={statusChangeProcess}
            setStatusChangeProcess={(value: boolean) =>
              setStatusChangeProcess(value)
            }
            handleEmailJobStatusChange={handleEmailJobStatusChange}
          />
        )}
        {sendEmailModal && (
          <SendEmailModal
            formHeading="Send Email"
            onCancel={() => setSendEmailModal(false)}
            selectedItems={[]}
            appName={appName}
            modelName={modelName}
            currentModule={currentModule}
            fieldsList={fieldsList}
            user={user}
            newItem={(value) => setEmails([...emails, value])}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
          />
        )}
        {cancelEmailJobModal.visible && (
          <>
            <DeleteModal
              id={"cancel-email-job"}
              modalHeader={"Cancel Email Job"}
              modalMessage={"Are you sure you want to cancel email job?"}
              leftButton={"No"}
              rightButton={"Yes"}
              loading={cancelProcessing}
              onCancel={() =>
                setCancelEmailJobModal({ visible: false, item: null })
              }
              onDelete={() => {
                setCancelProcessing(true);
                cancelEmailJob({
                  variables: {
                    id: cancelEmailJobModal?.item?.id,
                    modelName: "emailJob",
                    saveInput: {
                      status: "cancelled",
                    },
                  },
                });
              }}
              onOutsideClick={() =>
                setCancelEmailJobModal({ visible: false, item: null })
              }
            />
            <Backdrop
              onClick={() =>
                setCancelEmailJobModal({ visible: false, item: null })
              }
            />
          </>
        )}
      </>
    );
  }
);
