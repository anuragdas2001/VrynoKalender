import React from "react";
import { Content, EditorContent, useEditor } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import Link from "@tiptap/extension-link";
import { getTiptapExtensions } from "./SupportedExtensions";
import Paragraph from "@tiptap/extension-paragraph";
import { ICustomField } from "../../../../models/ICustomField";

export type ViewRichTextEditorProps = {
  data?: Content;
  richTextOverflowScroll?: boolean;
  supportMentions?: boolean;
  mentionSuggestions?: Omit<SuggestionOptions, "editor">;
  editable?: boolean;
  fontSize: {
    header: string;
    value: string;
  };
  fontColor?: string;
  truncateData?: boolean;
  displayType?: string;
  field?: {
    label: string;
    value: string;
  };
  fixedWidth?: string;
};

function ViewRichTextEditor({
  data,
  richTextOverflowScroll = true,
  supportMentions = false,
  mentionSuggestions,
  editable = true,
  fontSize,
  fontColor = "text-vryno-card-value",
  truncateData,
  displayType,
  field,
  fixedWidth,
}: ViewRichTextEditorProps) {
  const [editorData, setEditorData] = React.useState<Content>();
  const extensions = getTiptapExtensions(supportMentions, mentionSuggestions);

  const editor = useEditor({
    extensions: [
      ...extensions,
      Link.configure({
        protocols: ["ftp", "mailto"],
        autolink: false,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: `break-keep ${displayType} ${truncateData ? "truncate" : ""}`,
        },
      }),
    ],
    editable: editable,
  });

  React.useEffect(() => {
    if (data) {
      setEditorData(data);
    } else {
      setEditorData(null);
    }
  }, [data]);

  React.useEffect(() => {
    if (editor !== null && editorData) {
      editor?.commands?.setContent(editorData);
      editor?.setEditable(false);
    }
  }, [editor]);

  React.useEffect(() => {
    if (editor !== null) {
      if (editorData) {
        editor?.commands?.setContent(editorData);
        editor?.setEditable(false);
      } else {
        editor?.commands.setContent("");
      }
    }
  }, [editorData]);

  return (
    <div
      className={`w-full grid grid-cols-12 rounded-md focus:shadow-md focus:outline-none break-words ${
        fontSize?.value || "text-xsm"
      } ${fontColor} whitespace-normal break-all ${fixedWidth || ""}`}
      onClick={
        !editor?.getHTML()?.includes("href")
          ? (e) => {}
          : (e) => {
              e.stopPropagation();
            }
      }
      style={{ maxWidth: "100%" }}
    >
      <div
        style={{
          overflowWrap: "break-word",
          whiteSpace: "normal",
          wordBreak: "break-all",
        }}
        className="col-span-12"
      >
        <div className="break-words whitespace-normal break-all">
          <div
            className={`${
              richTextOverflowScroll
                ? "overflow-scroll whitespace-normal break-all"
                : "whitespace-normal break-all"
            }`}
            dangerouslySetInnerHTML={{
              __html: `${editor?.getHTML()}`,
            }}
            data-testid={`${field?.label || "rich-text"}-${
              editor?.getText() || ""
            }`}
          />
          {/* <EditorContent
            editor={editor}
            className={`${
              richTextOverflowScroll
                ? "overflow-scroll whitespace-normal break-all"
                : "whitespace-normal break-all"
            }`}
            title={editor?.getText() || ""}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default ViewRichTextEditor;
