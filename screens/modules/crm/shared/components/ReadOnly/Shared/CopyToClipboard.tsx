import { toast } from "react-toastify";
import ClipboardIcon from "remixicon-react/ClipboardLineIcon";
import { ICustomField } from "../../../../../../../models/ICustomField";
import React from "react";

export const CopyToClipboard = ({
  maskedFieldData,
  fetchMaskedFieldData,
  fieldDetail,
  field,
}: {
  maskedFieldData: {
    oldValue: any;
    newValue: any;
  };
  fetchMaskedFieldData: (fieldName: string) => null | any;
  fieldDetail: ICustomField | undefined;
  field: any;
}) => {
  const [copyInProcess, setCopyInProcess] = React.useState(false);

  const copyToClipboard = async () => {
    if (navigator.clipboard) {
      await navigator.permissions
        .query({ name: "clipboard-read" as any })
        .then(async (result) => {
          if (result.state === "granted" || result.state === "prompt") {
            let textToCopy = "";
            if (maskedFieldData.newValue) {
              textToCopy = maskedFieldData.newValue;
            } else {
              textToCopy = await fetchMaskedFieldData(
                fieldDetail?.systemDefined
                  ? field.value
                  : `fields.${field.value}`
              );
            }
            navigator.clipboard.writeText(textToCopy);
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
        copyToClipboard();
      }}
      className="pl-1"
      disabled={copyInProcess}
      data-testid={`copy-to-clipboard-masked-field-${field.label}-data`}
    >
      <ClipboardIcon size={16} />
    </button>
  );
};
