import React from "react";
import { HTMLTableCopyToClipboard } from "./HTMLTableCopyToClipBoard";

export type TableHTMLContentProps = {
  htmlContent: string | null;
  setAddThisAsHTMLtoEditor: (value: string | null) => void;
  setCurrentMergeTag: (value: string) => void;
};

export const TableHTMLContent = ({
  htmlContent,
  setAddThisAsHTMLtoEditor,
  setCurrentMergeTag,
}: TableHTMLContentProps) => {
  return (
    <>
      <div className={`flex flex-row items-center gap-x-4 px-6 my-4`}>
        <pre className="inline-block">{`Code </> :`}</pre>
        <p className="truncate bg-gray-200 rounded-lg p-4 w-full">
          {htmlContent}
        </p>
        <HTMLTableCopyToClipboard
          clipboardContent={htmlContent}
          handleCopyClipboardButton={(values) => {
            setAddThisAsHTMLtoEditor(null);
            setCurrentMergeTag("");
          }}
        />
      </div>
      <hr />
    </>
  );
};
