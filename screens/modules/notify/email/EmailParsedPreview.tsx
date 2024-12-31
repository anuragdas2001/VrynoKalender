import _ from "lodash";
import React from "react";
import parse from "emailjs-mime-parser";
import { EmailAttachmentHelper } from "./EmailAttachmentHelper";
import { EmailFullView } from "../../crm/generic/GenericModelDetails/Email/connectedEmailHelpers";
import { getDataFromUrl } from "../../crm/shared/utils/getDataFromUrl";
import { Config } from "../../../../shared/constants";
import { UserStoreContext } from "../../../../stores/UserStore";

let emailContent = "";

const removeContentAfterHrTagEncountered = (
  originalString: string,
  substring: string
) => {
  let position: number = originalString.indexOf(substring);
  if (position !== -1) {
    return originalString.substring(0, position);
  } else {
    return originalString;
  }
};

export const handleHrTagParse = (emailContent: string) => {
  let updatedEmailContent = emailContent;
  updatedEmailContent = removeContentAfterHrTagEncountered(
    updatedEmailContent,
    `<hr style="display:inline-block;width:98%" tabindex="-1">`
  );
  updatedEmailContent = removeContentAfterHrTagEncountered(
    updatedEmailContent,
    `<hr tabindex="-1" style="display:inline-block; width:98%">`
  );
  return updatedEmailContent;
};

export type EmailParsedPreviewProps = {
  mail: EmailFullView;
  index: number;
};

export const EmailParsedPreview = ({
  mail,
  index,
}: EmailParsedPreviewProps) => {
  const { user } = React.useContext(UserStoreContext);
  const [attachments, setAttachments] = React.useState<
    { contentSrc: string; headerContentId: string; contentType: string }[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [updatedMail, setUpdatedMail] = React.useState<EmailFullView>();
  const [emailDataParsed, setEmailDataParsed] = React.useState();
  const handleParsedEmailData = (
    parsedEmailData: any,
    parsedEmailContent: string
  ) => {
    const childnodes: any[] = _.get(parsedEmailData, "childNodes", []);
    emailContent = parsedEmailContent;
    if (childnodes?.length > 0) {
      let childNodeToParse = {
        contentType: { value: "text/html" },
        content: "",
      };
      childnodes.forEach((childnode, index) => {
        const innerChildNodes: any[] = _.get(childnode, "childNodes", []);
        if (innerChildNodes?.length > 0) {
          handleParsedEmailData(childnode, emailContent);
        } else if (_.get(childnode.contentType, "value", "") === "text/html") {
          childNodeToParse = childnode;
        }
      });
      handleParsedEmailData(childNodeToParse, emailContent);
    } else if (_.get(parsedEmailData, "content", "") !== "") {
      emailContent = _.get(parsedEmailData, "content", "")
        ? new TextDecoder().decode(_.get(parsedEmailData, "content", ""))
        : "";
    }
    return handleHrTagParse(emailContent);
  };

  React.useEffect(() => {
    const handleEmailParsing = async () => {
      if (mail) {
        let fileKeyData = await getDataFromUrl(
          `${Config.metaPrivateUploadUrl()}${"notify"}/${"mail"}/${
            mail.rfc822FileKey
          }`
        ).then((data) => data);
        const parsedEmailData = parse(fileKeyData);
        setEmailDataParsed(parsedEmailData);
        setUpdatedMail({
          ...mail,
          body: {
            subject: _.get(parsedEmailData?.headers, "subject", ""),
            from: _.get(parsedEmailData?.headers, "from", ""),
            to: _.get(parsedEmailData?.headers, "to", ""),
            date: _.get(parsedEmailData?.headers, "date", ""),
            content: handleParsedEmailData(parsedEmailData, ""),
          },
        });
        setLoading(false);
      }
    };
    handleEmailParsing();
  }, [mail]);

  const handleUpdatedContent = (
    content: string,
    attachments: {
      contentSrc: string;
      headerContentId: string;
      contentType: string;
    }[]
  ) => {
    let updatedContent = content;
    attachments?.forEach((attachment) => {
      updatedContent = updatedContent?.replace(
        `cid:${attachment.headerContentId}`,
        `${attachment.contentSrc}`
      );
    });
    return updatedContent;
  };

  React.useEffect(() => {
    if (updatedMail && attachments?.length > 0) {
      setUpdatedMail({
        ...updatedMail,
        body: {
          ...updatedMail?.body,
          content: handleUpdatedContent(updatedMail.body.content, attachments),
        },
      });
    }
  }, [attachments]);

  return (
    <div
      style={{
        width: "90%",
        height: "100%",
        border: "1px solid #DDE2E8",
        borderRadius: "6px",
        padding: "24px",
        margin: "8px 0px",
        boxShadow:
          "0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 12px 0 rgba(0, 0, 0, 0.09)",
      }}
    >
      {loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#C2C2C2" }}>Loading...</p>
        </div>
      ) : (
        <>
          <div
            style={{ display: `${index === 0 ? "" : ""}`, marginBottom: "8px" }}
          >
            <p
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                columnGap: "2px",
              }}
            >
              <span>From :</span>
              <span style={{ fontWeight: "normal" }}>
                {updatedMail?.body?.from && updatedMail?.body?.from?.length > 0
                  ? updatedMail?.body?.from[0]?.initial
                  : "-"}
              </span>
            </p>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                columnGap: "2px",
              }}
            >
              <span>Sent :</span>
              <span style={{ fontWeight: "normal" }}>
                {updatedMail?.body?.date && updatedMail?.body?.date?.length > 0
                  ? updatedMail?.body?.date[0]?.initial
                  : "-"}
              </span>
            </p>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                columnGap: "2px",
              }}
            >
              <span>To :</span>
              <span style={{ fontWeight: "normal" }}>
                {updatedMail?.body?.to && updatedMail?.body?.to?.length > 0
                  ? updatedMail?.body?.to[0]?.initial
                  : "-"}
              </span>
            </p>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                columnGap: "2px",
              }}
            >
              <span> Subject :</span>
              <span style={{ fontWeight: "normal" }}>
                {updatedMail?.body?.subject &&
                updatedMail?.body?.subject?.length > 0
                  ? updatedMail?.body?.subject[0]?.initial
                  : "-"}
              </span>
            </p>
          </div>
          <div
            style={{
              display: `${
                _.get(emailDataParsed, "childNodes", [])?.length > 0
                  ? _.get(emailDataParsed, "childNodes", [])?.filter(
                      (childNode: any) =>
                        _.get(childNode?.headers, "content-disposition", "") &&
                        _.get(
                          (childNode?.headers?.["content-disposition"])[0],
                          "value",
                          ""
                        ) === "attachment"
                    )?.length > 0
                    ? ""
                    : "none"
                  : "none"
              }`,
              padding: "8px 0px",
              fontWeight: 600,
              fontFamily: "Poppins",
            }}
          >
            Attachments :
          </div>
          <div
            style={{
              display: `${
                _.get(emailDataParsed, "childNodes", [])?.length > 0
                  ? "flex"
                  : "none"
              }`,
              columnGap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {_.get(emailDataParsed, "childNodes", [])?.length > 0 &&
              _.get(emailDataParsed, "childNodes", [])?.map(
                (childnode, index) => (
                  <EmailAttachmentHelper
                    childNode={childnode}
                    key={index}
                    handleAttachments={({
                      contentSrc,
                      headerContentId,
                      contentType,
                    }) =>
                      setAttachments([
                        ...attachments,
                        { contentSrc, headerContentId, contentType },
                      ])
                    }
                  />
                )
              )}
          </div>
          <div
            className={`w-full overflow-y-auto pr-1.5 card-scroll mt-8 flex flex-col items-center justify-center`}
            dangerouslySetInnerHTML={{
              __html: `${
                updatedMail?.body?.content
                  ? updatedMail?.body?.content
                  : `<div className="text-gray-500">No content</div>`
              }`,
            }}
          />
        </>
      )}
    </div>
  );
};
