import React from "react";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { ConnectedEmailProps } from "./connectedEmailHelpers";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import { ICustomField } from "../../../../../../models/ICustomField";
import { getGQLOperationParams } from "../../../../../../graphql/helpers/operationSchemaMapper";
import { useLazyQuery } from "@apollo/client";
import { EmailPreview } from "./connectedEmailHelpers";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import Pagination from "../../../shared/components/Pagination";
import ArrowRightIcon from "remixicon-react/ArrowRightSLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownSLineIcon";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";

const decoders = { rfc2047: require("rfc2047") };

export const ConnectedEmail = ({
  id,
  appName,
  containerName,
  modelName,
  fieldsList,
  modelData,
  handleEmailCount,
  imapEmailModal,
  userPreferences,
}: ConnectedEmailProps) => {
  const { user } = React.useContext(UserStoreContext);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [emails, setEmails] = React.useState<EmailPreview[]>([]);
  const [emailCount, setEmailCount] = React.useState<number>(0);
  const [emailAddresses, setEmailAddresses] = React.useState<string[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [actualPageNumber, setActualPageNumber] = React.useState<number>(1);
  const [lastPageNumber, setLastPageNumber] = React.useState<number>(1);
  const [openThreadedMail, setOpenedThreadeMail] = React.useState<string>();
  const [threadedEmailsLoading, setThreadedEmailsLoading] =
    React.useState<boolean>(false);

  const [fetchMail] = useLazyQuery(
    ...getGQLOperationParams({
      topic: "notify",
      operation: "fetchMail",
      onCompleted: (response: any) => {
        if (response?.fetchMail?.data) {
          setEmails([...emails, ...response?.fetchMail?.data]);
          setLastPageNumber(Math.ceil(response?.fetchMail?.count / 50));
          setEmailCount(response?.fetchMail?.count);
          handleEmailCount(response?.fetchMail?.count);
          setLoading(false);
        }
      },
      onError: () => {
        setEmails([]);
        setLoading(false);
      },
    })
  );

  const [fetchThreadedMails] = useLazyQuery(
    ...getGQLOperationParams({
      topic: "notify",
      operation: "fetchMail",
      onCompleted: (response: any) => {
        if (response?.fetchMail?.data) {
          let updatedEmails: any[] = [...emails];
          let openedThreadIndex = updatedEmails?.findIndex(
            (email) => email.id === openThreadedMail
          );
          updatedEmails.splice(
            openedThreadIndex + 1,
            0,
            ...(response?.fetchMail?.data?.map((thread: any) => {
              return { ...thread, threadedEmail: true, bgColor: "bg-gray-100" };
            }) as any)
          );
          setEmails([...updatedEmails]);
          setThreadedEmailsLoading(false);
        }
      },
      onError: () => {
        setThreadedEmailsLoading(false);
      },
    })
  );

  React.useEffect(() => {
    if (modelData) {
      const updatedEmailAddressList = fieldsList
        ?.reduce((result: string[], item: ICustomField) => {
          return item.dataType == SupportedDataTypes.email
            ? [...result, { ...modelData, ...modelData?.fields }[item.name]]
            : result;
        }, [])
        ?.map((email) => email);
      setEmailAddresses(updatedEmailAddressList);
      fetchMail({
        variables: {
          expression: "( a )",
          orderBy: [{ name: "date", order: ["DESC"] }],
          filters: [
            {
              name: "participants",
              operator: "any",
              value: updatedEmailAddressList,
            },
          ],
        },
      });
    }
  }, [modelData]);

  const handleFetchThreadMessages = async (references: string[]) => {
    setThreadedEmailsLoading(true);
    await fetchThreadedMails({
      variables: {
        expression: "( a )",
        orderBy: [{ name: "date", order: ["DESC"] }],
        filters: [
          {
            name: "messageId",
            operator: "in",
            value: references,
          },
        ],
      },
    });
  };

  return (
    <GenericHeaderCardContainer
      id={id}
      extended={true}
      cardHeading={"Emails"}
      modelName={modelName}
      renderHtmlNextToOpenCloseButton={
        emails?.length > 0 ? (
          <Pagination
            containerName={containerName}
            itemsCount={emailCount}
            currentPageNumber={currentPageNumber}
            disabledLastPage={actualPageNumber === lastPageNumber}
            hideFirstLastPageButtons={true}
            currentPageItemCount={
              emails?.slice(
                (currentPageNumber - 1) * 50,
                currentPageNumber * 50
              )?.length
            }
            pageInfoLocation="between"
            onPageChange={(
              pageNumber: number,
              pageType?: "first" | "back" | "next" | "last"
            ) => {
              if (emails?.length < 50 * pageNumber) {
                setLoading(true);
                fetchMail({
                  variables: {
                    expression: "( a )",
                    orderBy: [{ name: "date", order: ["DESC"] }],
                    filters: [
                      {
                        name: "participants",
                        operator: "any",
                        value: emailAddresses,
                      },
                    ],
                    pageNumber:
                      pageType === "first"
                        ? 1
                        : pageType === "back"
                        ? pageNumber
                        : pageType === "last"
                        ? pageNumber
                        : actualPageNumber + 1,
                  },
                });
              }
              setCurrentPageNumber(pageNumber);
              setActualPageNumber(
                pageType === "first"
                  ? 1
                  : pageType === "back"
                  ? pageNumber
                  : pageType === "last"
                  ? pageNumber
                  : actualPageNumber + 1
              );
            }}
          />
        ) : (
          <></>
        )
      }
      userPreferences={[]}
    >
      {loading ? (
        <ItemsLoader currentView="List" loadingItemCount={2} />
      ) : (
        <div
          className={`${
            userPreferences?.[0]?.defaultPreferences?.[modelName]
              ?.selectedSizeView === "noLimit"
              ? ""
              : "overflow-y-scroll max-h-64"
          }`}
        >
          {emails?.length > 0 ? (
            <GenericList
              listSelector={false}
              truncate={true}
              includeUrlWithRender={true}
              handleRowClick={(record) => imapEmailModal(record)}
              tableHeaders={[
                {
                  columnName: "references",
                  label: "",
                  dataType: SupportedDataTypes.number,
                  render: (record: {
                    id: string;
                    threadedEmail?: boolean;
                    references: string[];
                    messageId: string;
                  }) => {
                    if (record?.id !== openThreadedMail) {
                      return (
                        <Button
                          id={`open-threade-email-${record.id}`}
                          userEventName="open-threaded-email-button-clicked"
                          customStyle={`${
                            record?.threadedEmail
                              ? "hidden"
                              : record?.references?.length > 0
                              ? ""
                              : "hidden"
                          } w-5 h-5 rounded-full bg-gray-300 hover:bg-vryno-theme-light-blue flex items-center justify-center`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEmails([
                              ...emails?.filter(
                                (email) => !email?.threadedEmail
                              ),
                            ]);
                            setOpenedThreadeMail(record?.id);
                            handleFetchThreadMessages(record?.references);
                          }}
                          loading={threadedEmailsLoading}
                          disabled={threadedEmailsLoading}
                        >
                          <ArrowRightIcon
                            size={16}
                            className="text-gray-600 hover:text-white"
                          />
                        </Button>
                      );
                    } else {
                      return (
                        <Button
                          id={`close-threade-email-${record.id}`}
                          userEventName="close-threaded-email-button-clicked"
                          customStyle={`${
                            record?.threadedEmail
                              ? "hidden"
                              : record?.references?.length > 0
                              ? ""
                              : "hidden"
                          } w-5 h-5 rounded-full bg-gray-300 hover:bg-vryno-theme-light-blue flex items-center justify-center`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEmails([
                              ...emails?.filter(
                                (email) => !email?.threadedEmail
                              ),
                            ]);
                            setOpenedThreadeMail("");
                            setThreadedEmailsLoading(false);
                          }}
                          loading={threadedEmailsLoading}
                          disabled={threadedEmailsLoading}
                        >
                          <ArrowDownIcon
                            size={16}
                            className="text-gray-600 hover:text-white"
                          />
                        </Button>
                      );
                    }
                  },
                },
                {
                  columnName: "sendFrom",
                  label: "Send From",
                  dataType: SupportedDataTypes.singleline,
                  render: (record: {
                    sendFrom: string;
                    [key: string]: string;
                  }) => {
                    return (
                      <div
                        className={`${
                          record?.flags?.includes("Seen") ? "text-gray-500" : ""
                        } `}
                      >
                        {decoders.rfc2047.decode(record.sendFrom)
                          ? decoders.rfc2047.decode(record.sendFrom)
                          : "-"}
                      </div>
                    );
                  },
                },
                {
                  columnName: "sendTo",
                  label: "Send To",
                  dataType: SupportedDataTypes.singleline,
                  render: (record: {
                    sendTo: string;
                    [key: string]: string;
                  }) => {
                    return (
                      <div
                        className={`${
                          record?.flags?.includes("Seen") ? "text-gray-500" : ""
                        } `}
                      >
                        {decoders.rfc2047.decode(record.sendTo)
                          ? decoders.rfc2047.decode(record.sendTo)
                          : "-"}
                      </div>
                    );
                  },
                },
                {
                  columnName: "subject",
                  label: "Subject",
                  dataType: SupportedDataTypes.singleline,
                  render: (record: {
                    subject: string;
                    [key: string]: string;
                  }) => {
                    return (
                      <div
                        className={`${
                          record?.flags?.includes("Seen") ? "text-gray-500" : ""
                        } `}
                      >
                        {decoders.rfc2047.decode(record.subject)
                          ? decoders.rfc2047.decode(record.subject)
                          : "-"}
                      </div>
                    );
                  },
                },
                {
                  columnName: "date",
                  label: "Date",
                  dataType: SupportedDataTypes.datetime,
                  render: (record: { date: string; [key: string]: string }) => {
                    return (
                      <div
                        className={`${
                          record?.flags?.includes("Seen") ? "text-gray-500" : ""
                        } `}
                      >
                        {getDateAndTime(record.date, user ?? undefined)}
                      </div>
                    );
                  },
                },
              ]}
              fieldsList={fieldsList}
              data={emails?.slice(
                (currentPageNumber - 1) * 50,
                currentPageNumber * 50
              )}
              oldGenericListUI={true}
            />
          ) : (
            <div className="w-full flex items-center justify-center">
              <span className="text-sm text-gray-600">No Data Found</span>
            </div>
          )}
        </div>
      )}
    </GenericHeaderCardContainer>
  );
};
