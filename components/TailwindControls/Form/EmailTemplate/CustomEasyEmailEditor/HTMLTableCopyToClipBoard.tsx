import { toast } from "react-toastify";
import ClipboardIcon from "remixicon-react/ClipboardLineIcon";
import React from "react";

export const HTMLTableCopyToClipboard = ({
  clipboardContent,
  handleCopyClipboardButton = () => {},
}: {
  clipboardContent: string | null;
  handleCopyClipboardButton?: (value: string | null) => void;
}) => {
  const [copyInProcess, setCopyInProcess] = React.useState(false);

  const htmlTablecopyToClipboard = async () => {
    if (navigator.clipboard && clipboardContent) {
      await navigator.permissions
        .query({ name: "clipboard-read" as any })
        .then(async (result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(clipboardContent);
            handleCopyClipboardButton(clipboardContent);
            toast.success("Text copied to clipboard");
          } else {
            toast.error("Permission denied to copy content");
          }
        })
        .catch((error) => toast.error("Permission denied to copy content"));
    } else {
      toast.error("Permission denied to copy content");
    }
    setCopyInProcess(false);
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setCopyInProcess(true);
        htmlTablecopyToClipboard();
      }}
      className="pl-1"
      disabled={copyInProcess}
      data-testid={`copy-to-clipboard-html-table-data`}
    >
      <ClipboardIcon size={16} />
    </button>
  );
};
