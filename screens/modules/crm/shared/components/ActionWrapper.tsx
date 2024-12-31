import { ReactChild, ReactFragment } from "react";

export const ActionWrapper = ({
  content,
  zIndexValue,
  index,
  stickyHeader = true,
  recordId,
  openingRecordId,
  customPadding,
}: {
  content: Element | ReactChild | ReactFragment;
  zIndexValue?: number | undefined;
  index: number;
  stickyHeader?: boolean;
  recordId?: string;
  openingRecordId?: string | null;
  customPadding?: string;
}) => {
  return (
    <div
      id={`td-action-${index}`}
      className={` text-right right-0 ${customPadding || "px-6 py-2"} ${
        openingRecordId && openingRecordId === recordId
          ? "bg-transparent"
          : "bg-transparent"
      } text-vryno-card-value ${stickyHeader && "sticky"}`}
      style={{ zIndex: zIndexValue !== undefined ? zIndexValue : 10 }}
      key={`${index}-rendered-data`}
    >
      <>{content}</>
    </div>
  );
};
