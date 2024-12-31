import _ from "lodash";
import React from "react";
import { uint8ArrayToDataURL } from "./Uint8ArrayToDataUrlConverter";

const TypeImageMapper: Record<string, string> = {
  pdf: "/email/pdf.svg",
  doc: "/email/doc.svg",
  docx: "/email/doc.svg",
  docs: "/email/doc.svg",
  xls: "/email/excel.svg",
  xlsx: "/email/excel.svg",
  csv: "/email/csv.svg",
};

export type EmailAttachmentHelperProps = {
  childNode: any;
  handleAttachments: (value: {
    contentSrc: string;
    headerContentId: string;
    contentType: string;
  }) => void;
};

export const EmailAttachmentHelper = ({
  childNode,
  handleAttachments,
}: EmailAttachmentHelperProps) => {
  const filename: string = _.get(childNode?.contentType?.params, "name", "");
  const contentType = _.get(childNode?.contentType, "value", "");
  const contentTypeName = filename.split(".")[filename.split(".").length - 1];
  const content = _.get(childNode, "content", []);
  const [contentSrc, setContentSrc] = React.useState<string>();
  const [headersContentId, setHeadersContentId] = React.useState();
  const [attachmentStyle, setAttachmentStyle] = React.useState<
    Record<string, string>
  >({
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    marginBottom: "4px",
    backgroundColor: "#ecf3fd",
    color: "black",
    textDecoration: "none",
    borderRadius: "8px",
    padding: "8px",
    fontFamily: "monospace",
    fontSize: "13px",
  });

  React.useEffect(() => {
    if (contentType && content && !contentSrc) {
      const headersContentId: string =
        _.get(childNode?.headers, "x-attachment-id", "")?.length > 0
          ? _.get((childNode?.headers?.["x-attachment-id"])[0], "value", "")
          : "";
      const generateBlobUrl = async () => {
        const dataUrl = await uint8ArrayToDataURL(content, contentType);
        setContentSrc(dataUrl);
        handleAttachments({
          contentSrc: dataUrl,
          headerContentId: headersContentId,
          contentType: contentType,
        });
      };
      generateBlobUrl();
    }
  }, [contentType, content, contentSrc]);

  if (contentType.includes("image")) {
    const headerDiscompositionType =
      _.get(childNode?.headers, "content-disposition", "")?.length > 0
        ? _.get((childNode?.headers?.["content-disposition"])[0], "value", "")
        : "";
    if (headerDiscompositionType === "attachment") {
      return (
        <a
          href={contentSrc}
          download={filename}
          style={attachmentStyle}
          onPointerEnter={() =>
            setAttachmentStyle({
              ...attachmentStyle,
              backgroundColor: "#2F98FF",
              color: "white",
            })
          }
          onPointerLeave={() =>
            setAttachmentStyle({
              ...attachmentStyle,
              backgroundColor: "#ecf3fd",
              color: "black",
            })
          }
        >
          <img
            src={contentSrc}
            alt={filename}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "2px",
              objectFit: "cover",
            }}
          />
          <p>{filename}</p>
        </a>
      );
    } else {
      return null;
    }
  } else if (
    ["pdf", "csv", "xls", "xlsx", "doc", "docs", "docx"].includes(
      contentTypeName
    )
  ) {
    const headerDiscompositionType =
      _.get(childNode?.headers, "content-disposition", "")?.length > 0
        ? _.get((childNode?.headers?.["content-disposition"])[0], "value", "")
        : "";
    if (headerDiscompositionType === "attachment") {
      return (
        <a
          href={contentSrc}
          download={filename}
          style={attachmentStyle}
          onPointerEnter={() =>
            setAttachmentStyle({
              ...attachmentStyle,
              backgroundColor: "#2F98FF",
              color: "white",
            })
          }
          onPointerLeave={() =>
            setAttachmentStyle({
              ...attachmentStyle,
              backgroundColor: "#ecf3fd",
              color: "black",
            })
          }
        >
          <img
            src={TypeImageMapper[contentTypeName]}
            alt={filename}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "2px",
              objectFit: "cover",
            }}
          />
          <p>{filename}</p>
        </a>
      );
    } else {
      return null;
    }
  } else return null;
};
