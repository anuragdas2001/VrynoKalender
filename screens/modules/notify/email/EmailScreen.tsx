import React from "react";
import { useLazyQuery } from "@apollo/client";
import {
  EmailFullView,
  EmailPreview,
} from "../../crm/generic/GenericModelDetails/Email/connectedEmailHelpers";
import { Backdrop } from "../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Loading } from "../../../../components/TailwindControls/Loading/Loading";
import Frame from "react-frame-component";
import {
  QUERY_FETCH_MAIL,
  QUERY_GET_MAIL,
} from "../../../../graphql/queries/LinkAccountQuery";
import { EmailParsedPreview } from "./EmailParsedPreview";
import _ from "lodash";

const decoders = { rfc2047: require("rfc2047") };

export const EmailScreen = ({
  record,
  onCancel,
}: {
  record: EmailPreview | null;
  onCancel: () => void;
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [threadLoading, setThreadLoading] = React.useState<boolean>(false);
  const [fetchedMails, setFetchedMails] = React.useState<EmailPreview[]>([]);
  const [fetchMailsCount, setFetchMailsCount] = React.useState<number>(0);
  const [getMails, setGetMails] = React.useState<EmailFullView[]>([]);
  const [getMailsCount, setGetMailsCount] = React.useState<number>(0);
  const [mailTrailCount, setMailTrainCount] = React.useState<number>(0);

  const [getMail] = useLazyQuery(QUERY_GET_MAIL, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
  });

  const [fetchMail] = useLazyQuery(QUERY_FETCH_MAIL, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
  });

  const handleThreadFetch = async (
    updatedRecord: EmailPreview,
    manuallyClicked: boolean = false
  ) => {
    await fetchMail({
      variables: {
        expression: "( a )",
        orderBy: [{ name: "date", order: ["DESC"] }],
        filters: [
          {
            name: "messageId",
            operator: "in",
            value: updatedRecord.references
              .reverse()
              .splice(fetchedMails?.length, 5),
          },
        ],
      },
    }).then(async (response) => {
      if (
        response?.data?.fetchMail?.data &&
        response?.data?.fetchMail?.messageKey.includes("-success")
      ) {
        setFetchedMails([...fetchedMails, ...response?.data?.fetchMail?.data]);
        let allRecords = manuallyClicked
          ? [...response?.data?.fetchMail?.data]
          : [record, ...response?.data?.fetchMail?.data];
        const fetchAllMailPromise = allRecords.map(
          async (item: EmailPreview) => {
            const response = await getMail({
              variables: {
                id: item.id,
              },
            });
            return response.data?.getMail?.data;
          }
        );
        await Promise.all(fetchAllMailPromise).then((response) => {
          setGetMails([...getMails, ...response]);
        });
      }
    });
  };

  React.useEffect(() => {
    const fetchAllEmails = async () => {
      if (record) {
        let updatedRecord: EmailPreview = _.cloneDeep(record);
        setLoading(true);
        if (updatedRecord.references.length > 0) {
          await handleThreadFetch(updatedRecord);
        } else {
          const fetchAllMailPromise = [updatedRecord].map(
            async (item: EmailPreview) => {
              const response = await getMail({
                variables: {
                  id: item.id,
                },
              });
              return response.data?.getMail?.data;
            }
          );
          await Promise.all(fetchAllMailPromise).then((response) => {
            setGetMails([...response]);
          });
        }
        setMailTrainCount([...record.references]?.length);
        setLoading(false);
      }
    };
    fetchAllEmails();
  }, [record]);

  const getMailHeading = (loading: boolean, email: EmailPreview | null) => {
    return `${
      !loading
        ? decoders.rfc2047.decode(email && email?.subject)
          ? `Subject : ${decoders.rfc2047.decode(email && email?.subject)}`
          : "Subject : No Subject"
        : ""
    }`;
  };

  const getMailSubHeading = (loading: boolean, email: EmailPreview | null) => {
    return `${
      !loading
        ? decoders.rfc2047.decode(email && email?.sendFrom)
          ? `Send From : ${decoders.rfc2047.decode(email && email?.sendFrom)}`
          : ""
        : ""
    }`;
  };

  const handleLoadMoreClicked = async (record: EmailPreview | null) => {
    if (record) {
      let updatedRecord: EmailPreview = _.cloneDeep(record);
      setThreadLoading(true);
      await handleThreadFetch(updatedRecord, true);
      setThreadLoading(false);
    }
  };

  return (
    <>
      <GenericFormModalContainer
        topIconType={`${loading ? "None" : "Close"}`}
        formHeading={getMailHeading(loading, record)}
        formSubHeading={getMailSubHeading(loading, record)}
        additionalInfo={`${
          mailTrailCount + 1 !== 1 ? `Total mails : ${mailTrailCount + 1}` : ``
        }`}
        onCancel={onCancel}
        onOutsideClick={onCancel}
        maxWidth={true}
      >
        <div className="w-full h-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <Loading color="Blue" />
            </div>
          ) : (
            <Frame className={`w-full ${"h-[55vh]"} card-scroll`}>
              {getMails?.map((mail, index) => (
                <EmailParsedPreview mail={mail} key={index} index={index} />
              ))}
            </Frame>
          )}
          {/* {!loading && getMails?.length < mailTrailCount + 1 && (
            <div className="separator">
              <p
                className={`text-sm text-gray-400 flex items-center gap-x-2 cursor-pointer hover:text-vryno-theme-light-blue`}
                onClick={() => {
                  handleLoadMoreClicked(record);
                }}
              >
                {threadLoading ? <Loading color="Blue" /> : "Load More"}
              </p>
            </div>
          )} */}
        </div>
      </GenericFormModalContainer>
      <Backdrop onClick={onCancel} />
    </>
  );
};
