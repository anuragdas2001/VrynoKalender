import React from "react";
import FormRichTextEditor from "../RichTextEditor/FormRichTextEditor";
import Button from "../Button/Button";
import { FormikValues, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Content, Editor, useEditor } from "@tiptap/react";
import { getTiptapExtensions } from "../RichTextEditor/SupportedExtensions";
import { SuggestionOptions } from "@tiptap/suggestion";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";

type SignatureModalFormFieldsProps = {
  supportMentions?: boolean;
  mentionSuggestions?: Omit<SuggestionOptions, "editor">;
  handleSelectedHtml: (value: Editor | null) => void;
  setOpenSignatureWindow: (value: boolean) => void;
};

export const SignatureModalFormFields = ({
  supportMentions,
  mentionSuggestions,
  handleSelectedHtml,
  setOpenSignatureWindow,
}: SignatureModalFormFieldsProps) => {
  const { t } = useTranslation(["common"]);
  const { values, setFieldValue } = useFormikContext<FormikValues>();
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
          class: `break-keep`,
        },
      }),
    ],
    editable: true,
  });

  React.useEffect(() => {
    if (values["signature"]) {
      setEditorData(values["signature"]);
    } else {
      setEditorData(null);
    }
  }, [values["signature"]]);

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
    <div className="w-full">
      <FormRichTextEditor
        data={values["signature"]}
        handleNoteChange={(value) => setFieldValue("signature", value)}
        isHtml={false}
        name={"signature"}
        showImage={true}
        allowMargin={true}
        editMode={true}
        dataTestId={"signature"}
      />
      <div className="mt-4">
        <Button
          id="save-signature"
          onClick={() => {
            handleSelectedHtml(editor);
            setOpenSignatureWindow(false);
          }}
          kind="primary"
          userEventName="email-template-signature:save-click"
        >
          <>{t("common:save")}</>
        </Button>
      </div>
    </div>
  );
};
