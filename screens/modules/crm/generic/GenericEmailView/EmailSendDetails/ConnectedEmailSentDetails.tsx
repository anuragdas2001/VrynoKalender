import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import { EmailSendDetailScreen } from "./EmailSendDetailScreen";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { PageLoader } from "../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  IConnectedGenericEmailProps,
  IEmailItemTabValue,
  IEmailJobItem,
  emailJobFields,
  emailJobItemVariablesGenerator,
} from "./emailJobItemHelper";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import GeneralScreenLoader from "../../../shared/components/GeneralScreenLoader";

export const ConnectedEmailSentDetails = observer(
  ({
    appName,
    modelName,
    fieldsList,
    currentModule,
    id,
  }: IConnectedGenericEmailProps) => {
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { genericModels } = generalModelStore;
    const [emailJob, setEmailJob] = React.useState<Record<string, string>>({});
    const [emailJobItems, setEmailJobItems] = React.useState<IEmailJobItem[]>(
      []
    );
    const [emailTemplate, setEmailTemplate] = React.useState<{
      id: string;
      name: string;
    } | null>(null);
    const [itemsCount, setItemsCount] = React.useState<number>(0);
    const [successPageNumber, setSuccessPageNumber] = React.useState<number>(1);
    const [sentPageNumber, setSentPageNumber] = React.useState<number>(1);
    const [cancelledPageNumber, setCancelledPageNumber] =
      React.useState<number>(1);
    const [deliveredPageNumber, setDeliveredPageNumber] =
      React.useState<number>(1);
    const [failedPageNumber, setFailedPageNumber] = React.useState<number>(1);
    const [bouncedPageNumber, setBouncedPageNumber] = React.useState<number>(1);
    const [otherPageNumber, setOtherPageNumber] = React.useState<number>(1);

    const [selectedEmailItemTab, setSelectedEmailItemTab] =
      React.useState<IEmailItemTabValue>("statistics");

    const [emailJobLoading, setEmailJobLoading] = React.useState(true);
    const [emailJobItemsLoading, setEmailJobItemsLoading] =
      React.useState(false);

    const [getEmailJob] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "notify",
        },
      },
    });

    const [getEmailJobItem] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "notify",
        },
      },
    });

    const [getRecordData] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

    const handleEmailJobResponse = (responseOnCompletion: any) => {
      if (responseOnCompletion?.data?.fetch?.data?.length) {
        setEmailJob(responseOnCompletion.data.fetch.data[0]);
        if (!emailTemplate) {
          getEmailTemplates({
            variables: {
              modelName: "emailTemplate",
              fields: ["id", "name"],
              filters: [
                {
                  operator: "eq",
                  name: "id",
                  value: responseOnCompletion.data.fetch.data[0].templateId,
                },
              ],
            },
          });
        } else {
          setEmailJobItemsLoading(false);
        }
      }
    };

    const handleEmailJobItemResponse = async (responseOnCompletion: any) => {
      if (responseOnCompletion?.data?.fetch?.messageKey.includes("-success")) {
        if (!responseOnCompletion?.data?.fetch?.data?.length) {
          setEmailJobItems([]);
          setItemsCount(responseOnCompletion?.data?.fetch?.count);
          setEmailJobItemsLoading(false);
          return;
        }
        const emailJobItemArray = [...responseOnCompletion?.data?.fetch?.data];
        let emailJobItemData = [...responseOnCompletion?.data?.fetch?.data];
        const recordIds: string[] = [];
        responseOnCompletion?.data?.fetch?.data.forEach((data: any) => {
          recordIds.push(data.emailRecipientRecordId);
        });
        const firstName =
          fieldsList?.filter(
            (field) => field.visible && field.name === "firstName"
          )?.[0] || null;
        await getRecordData({
          variables: {
            modelName: modelName,
            fields: firstName ? ["firstName", "id", "name"] : ["id", "name"],
            filters: [
              {
                operator: "in",
                name: "id",
                value: recordIds,
              },
            ],
          },
        }).then((response) => {
          if (response?.data?.fetch.messageKey.includes("-success")) {
            const recordResponseArray = response?.data?.fetch.data;
            for (let i = 0; i < recordResponseArray.length; i++) {
              const recordData = recordResponseArray[i];
              for (let j = 0; j < emailJobItemArray?.length; j++) {
                if (
                  emailJobItemArray[j].emailRecipientRecordId === recordData.id
                ) {
                  emailJobItemData[j] = {
                    ...emailJobItemData[j],
                    name: recordData.firstName
                      ? `${recordData.firstName} ${recordData.name}`
                      : recordData.name,
                  };
                  break;
                }
              }
            }
          } else {
            toast.error(response?.data?.fetch.message);
          }
        });
        setEmailJobItems(emailJobItemData);
        setItemsCount(responseOnCompletion?.data?.fetch?.count);
      }
      setEmailJobItemsLoading(false);
    };

    const [getEmailTemplates] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "notify",
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data?.length) {
          setEmailTemplate(responseOnCompletion.fetch.data[0]);
          setEmailJob({
            ...emailJob,
            templateId: responseOnCompletion.fetch.data[0].name,
          });
        }
        setEmailJobLoading(false);
      },
    });

    React.useEffect(() => {
      getEmailJob({
        variables: {
          modelName: "emailJob",
          fields: emailJobFields,
          filters: [
            { operator: "eq", name: "id", value: id },
            { name: "recordStatus", operator: "in", value: ["a", "i"] },
          ],
        },
      }).then((response) => handleEmailJobResponse(response));
    }, []);

    const handleEmailItemTabSelection = (selectedTab: IEmailItemTabValue) => {
      setSelectedEmailItemTab(selectedTab);
      setEmailJobItemsLoading(true);
      if (selectedTab === "statistics") {
        getEmailJob({
          variables: {
            modelName: "emailJob",
            fields: emailJobFields,
            filters: [
              { operator: "eq", name: "id", value: id },
              { name: "recordStatus", operator: "in", value: ["a", "i"] },
            ],
          },
        }).then((response) => handleEmailJobResponse(response));
        return;
      }
      getEmailJobItem({
        variables: emailJobItemVariablesGenerator(
          emailJob.id,
          selectedTab,
          selectedTab === "cancelled"
            ? cancelledPageNumber
            : selectedTab === "success"
            ? successPageNumber
            : selectedTab === "sent"
            ? sentPageNumber
            : selectedTab === "delivered"
            ? deliveredPageNumber
            : selectedTab === "failed"
            ? failedPageNumber
            : selectedTab === "bounced"
            ? bouncedPageNumber
            : otherPageNumber
        ),
      }).then((response) => handleEmailJobItemResponse(response));
    };

    if (fieldsList.length <= 0 || !currentModule) {
      return <GeneralScreenLoader modelName={"..."} />;
    }

    return emailJobLoading ? (
      <div className="flex items-center justify-center h-screen text-xl">
        <PageLoader />
      </div>
    ) : (
      <EmailSendDetailScreen
        emailJob={emailJob}
        emailJobItems={emailJobItems}
        template={emailTemplate}
        selectedEmailItemTab={selectedEmailItemTab}
        onEmailItemTabSelection={handleEmailItemTabSelection}
        emailJobItemsLoading={emailJobItemsLoading}
        itemsCount={itemsCount}
        currentPageNumber={
          selectedEmailItemTab === "cancelled"
            ? cancelledPageNumber
            : selectedEmailItemTab === "success"
            ? successPageNumber
            : selectedEmailItemTab === "sent"
            ? sentPageNumber
            : selectedEmailItemTab === "delivered"
            ? deliveredPageNumber
            : selectedEmailItemTab === "failed"
            ? failedPageNumber
            : selectedEmailItemTab === "bounced"
            ? bouncedPageNumber
            : otherPageNumber
        }
        onPageChange={(pageNumber: number) => {
          setEmailJobItemsLoading(true);
          selectedEmailItemTab === "cancelled"
            ? setCancelledPageNumber(pageNumber)
            : selectedEmailItemTab === "success"
            ? setSuccessPageNumber(pageNumber)
            : selectedEmailItemTab === "sent"
            ? setSentPageNumber(pageNumber)
            : selectedEmailItemTab === "delivered"
            ? setDeliveredPageNumber(pageNumber)
            : selectedEmailItemTab === "failed"
            ? setFailedPageNumber(pageNumber)
            : selectedEmailItemTab === "bounced"
            ? setBouncedPageNumber(pageNumber)
            : setOtherPageNumber(pageNumber);
          getEmailJobItem({
            variables: emailJobItemVariablesGenerator(
              emailJob.id,
              selectedEmailItemTab,
              pageNumber
            ),
          }).then((response) => handleEmailJobItemResponse(response));
        }}
        fieldsList={fieldsList}
        appName={appName}
        modelName={modelName}
      />
    );
  }
);
