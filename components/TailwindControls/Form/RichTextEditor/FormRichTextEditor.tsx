import React from "react";
import { Content, Editor, EditorContent, useEditor } from "@tiptap/react";
import { PageIcons } from "../../VrynoIcon";
import ImageUrlPicker from "./ImageUrlPicker";
import { Formik, FormikValues, useFormikContext } from "formik";
import { Config } from "../../../../shared/constants";
import BoldIcon from "remixicon-react/BoldIcon";
import ItalicIcon from "remixicon-react/ItalicIcon";
import UnderlineIcon from "remixicon-react/UnderlineIcon";
import HighlightIcon from "remixicon-react/MarkPenLineIcon";
import UndoBackIcon from "remixicon-react/ArrowGoBackLineIcon";
import UndoForwardIcon from "remixicon-react/ArrowGoForwardLineIcon";
import LinksIcon from "remixicon-react/LinksLineIcon";
import UnLinkIcon from "remixicon-react/LinkUnlinkIcon";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { getSecureImageObjectURL } from "../SecureImage/getSecureImageObjectURL";
import { ImageUploadHandler } from "../../RichTextEditor/ImageUploadHandler";
import Link from "@tiptap/extension-link";
import { SuggestionOptions } from "@tiptap/suggestion";
import { getTiptapExtensions } from "./SupportedExtensions";
import { get, isObject } from "lodash";
import Paragraph from "@tiptap/extension-paragraph";
import * as Yup from "yup";
import GenericFormModalContainer from "../../Modals/FormModal/GenericFormModalContainer";
import FormInputBox from "../InputBox/FormInputBox";
import Button from "../Button/Button";
import { Backdrop } from "../../Backdrop";
import { useTranslation } from "next-i18next";
import { stringToRichTextObject } from "./stringToRichTextObject";
import { imageUploadHandler } from "../../../../screens/modules/crm/shared/utils/imageUploadHandler";
import { imageToUri } from "../../../../screens/modules/crm/shared/utils/getImageDataUrl";
import { SupportedApps } from "../../../../models/shared";

export type FormRichTextEditorProps = {
  name: string;
  label?: string;
  isHtml?: boolean;
  disabled?: boolean;
  data?: Content;
  required?: boolean;
  labelLocation?: SupportedLabelLocations;
  handleNoteChange: (notes: Record<string, any> | string) => void;
  showImage?: boolean;
  externalExpressionToCalculateValue?: string;
  formResetted?: boolean;
  editMode?: boolean;
  setFormResetted?: (value: boolean) => void;
  clearFiles?: boolean;
  handleClearState?: (value: boolean) => void;
  supportMentions?: boolean;
  mentionSuggestions?: Omit<SuggestionOptions, "editor">;
  rejectRequired?: boolean;
  addClear?: boolean;
  allowMargin?: boolean;
  paddingInPixelForInputBox?: number;
  enableRichTextReinitialize?: boolean;
  dataTestId?: string;
};

const MenuBar = ({
  editor,
  showImage,
  serviceName = SupportedApps.accounts,
  moduleName = "user",
}: {
  editor: Editor | null;
  showImage: boolean;
  serviceName?: string;
  moduleName?: string;
}) => {
  const { t } = useTranslation(["common"]);
  const [linkModalVisible, setLinkModalVisible] =
    React.useState<boolean>(false);
  const selectedText = editor?.state?.doc?.textBetween(
    editor.view.state.selection.from,
    editor.view.state.selection.to,
    ""
  );

  const validationSchema = Yup.object().shape({
    linkText: Yup.string().required("Please enter a text for link"),
    link: Yup.string()
      .url("Please enter a valid url")
      .required("Please enter a link"),
  });

  if (!editor) return null;

  const handleImageAdd = async (
    item: File,
    uploadToUrl: "public" | "private",
    serviceName: string = SupportedApps.accounts,
    moduleName: string = "user"
  ) => {
    const fileId = await imageUploadHandler({
      image: item,
      serviceName: serviceName,
      moduleName: moduleName,
      publicUrl: uploadToUrl === "private" ? false : true,
      params: undefined,
    });

    if (fileId) {
      uploadToUrl === "public"
        ? editor
            .chain()
            .focus()
            .setImage({
              src: `${Config.metaPublicUploadUrl()}${serviceName}/${moduleName}/${fileId}`,
            })
            .run()
        : getSecureImageObjectURL(
            `${Config.metaPrivateUploadUrl()}${serviceName}/${moduleName}/${fileId}`
          ).then((res) => {
            imageToUri(res, function (uri: any) {
              editor
                .chain()
                .focus()
                .setImage({ src: `${uri}` })
                .run();
            });
          });
    }
  };

  const handleLinkSubmit = (values: Record<any, any>) => {
    let updatedAtPos = editor.state.selection.$from.pos;

    editor.chain().focus().unsetLink().deleteSelection().run();
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: values.link, target: "_blank" })
      .insertContentAt(updatedAtPos, values.linkText)
      .run();
    setLinkModalVisible(false);
  };

  return (
    <>
      <div className="flex flex-row justify-evenly py-1">
        <Button
          id="rich-text-bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          customStyle={
            editor.isActive("bold") ? "text-blue-500" : "text-vryno-icon-gray"
          }
          userEventName="richText-bold:toggle-click"
        >
          {PageIcons(BoldIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="rich-text-italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          customStyle={
            editor.isActive("italic") ? "text-blue-500" : "text-vryno-icon-gray"
          }
          userEventName="richText-italic:toggle-click"
        >
          {PageIcons(ItalicIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="rich-text-underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          customStyle={
            editor.isActive("underline")
              ? "text-blue-500"
              : "text-vryno-icon-gray"
          }
          userEventName="richText-underline:toggle-click"
        >
          {PageIcons(UnderlineIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="rich-text-highlight"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          customStyle={
            editor.isActive("highlight")
              ? "text-blue-500"
              : "text-vryno-icon-gray"
          }
          userEventName="richText-highlight:toggle-click"
        >
          {PageIcons(HighlightIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="rich-text-link"
          onClick={() => setLinkModalVisible(true)}
          customStyle={
            editor.isActive("link") ? "text-blue-500" : "text-vryno-icon-gray"
          }
          userEventName="richText-link:toggle-click"
        >
          {PageIcons(LinksIcon, 20, "cursor-pointer")}
        </Button>
        {editor.isActive("link") && (
          <Button
            id="rich-text-unlink"
            onClick={() => editor.chain().focus().unsetLink().run()}
            customStyle={`text-vryno-icon-gray`}
            userEventName="richText-unlink:toggle-click"
          >
            {PageIcons(UnLinkIcon, 20, "cursor-pointer")}
          </Button>
        )}
        {showImage && (
          <div>
            <ImageUrlPicker
              onChange={(item: File) =>
                handleImageAdd(item, "private", serviceName, moduleName)
              }
            />
          </div>
        )}
        <Button
          id="rich-text-undo"
          onClick={() => editor.chain().focus().undo().run()}
          customStyle={"text-vryno-icon-gray"}
          userEventName="richText-undo:toggle-click"
        >
          {PageIcons(UndoBackIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="rich-text-redo"
          onClick={() => editor.chain().focus().redo().run()}
          customStyle={"text-vryno-icon-gray"}
          userEventName="richText-redo:toggle-click"
        >
          {PageIcons(UndoForwardIcon, 20, "cursor-pointer")}
        </Button>
      </div>
      {linkModalVisible && (
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <GenericFormModalContainer
            formHeading={`Add Link`}
            onOutsideClick={() => setLinkModalVisible(false)}
            limitWidth={true}
            onCancel={() => setLinkModalVisible(false)}
          >
            <Formik
              initialValues={{
                link:
                  editor?.getAttributes("link") &&
                  Object.keys(editor?.getAttributes("link"))?.length > 0
                    ? get(editor?.getAttributes("link"), "href", "")
                    : "",
                linkText: selectedText,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleLinkSubmit(values);
              }}
            >
              {({ handleSubmit }) => (
                <div className="w-full">
                  <FormInputBox name="linkText" label="Text" type="text" />
                  <FormInputBox name="link" label="URL" type="text" />
                  <div className="mt-4">
                    <Button
                      id="save-form"
                      onClick={() => {
                        handleSubmit();
                      }}
                      kind="primary"
                      userEventName="richText-link:save-click"
                    >
                      <>{t("common:save")}</>
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </GenericFormModalContainer>
          <Backdrop onClick={() => setLinkModalVisible(false)} />
        </form>
      )}
    </>
  );
};

function FormRichTextEditor({
  name,
  label,
  isHtml,
  disabled,
  data,
  labelLocation = SupportedLabelLocations.OnTop,
  handleNoteChange = () => {},
  required = false,
  showImage = true,
  formResetted = false,
  editMode = false,
  setFormResetted = () => {},
  clearFiles,
  handleClearState = () => {},
  supportMentions = false,
  mentionSuggestions,
  rejectRequired,
  addClear,
  allowMargin = true,
  paddingInPixelForInputBox,
  enableRichTextReinitialize = false,
  dataTestId,
}: FormRichTextEditorProps) {
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
  });

  const { touched, setFieldValue, values } = useFormikContext<FormikValues>();
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);

  const isValid = touched[name]
    ? required && !values[name]
      ? false
      : true
    : true;

  React.useEffect(() => {
    if (editor !== null) {
      editor.on("update", ({ editor }) => {
        if (!isHtml) {
          handleNoteChange(editor.getJSON());
        } else {
          handleNoteChange(editor.getHTML());
        }
      });
      if (data) {
        editor.commands.setContent(data);
      }
    }
  }, [editor]);

  React.useEffect(() => {
    if (enableRichTextReinitialize && editor !== null && data) {
      editor.commands.setContent(data);
    }
  }, [values[name]]);

  React.useEffect(() => {
    if (editor !== null && formResetted) editor.commands.setContent("");
  }, [formResetted]);

  React.useEffect(() => {
    if (editMode && data && editor !== null) {
      editor.commands.setContent(data);
    }
    // }, [editMode, data]);
  }, [editMode]);

  React.useEffect(() => {
    if (clearFiles && editor !== null) {
      editor.commands.setContent("");
    }
    handleClearState(false);
  }, [clearFiles]);

  React.useEffect(() => {
    if (!values[name]) return;
    if (isObject(values[name])) {
      let valuePresent = false;
      for (
        let index = 0;
        index < (values[name] as any)["content"]?.length;
        index++
      ) {
        if ((values[name] as any)["content"][index].content) {
          valuePresent = true;
          break;
        }
      }
      if (!valuePresent) setFieldValue(name, null);
    }
    if (typeof values[name] === "string") {
      setFieldValue(
        name,
        values[name].length ? stringToRichTextObject(values[name]) : null
      );
    }
  }, [values[name]]);

  const divFlexCol = "flex-col";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";
  const paddingLeftClass = "pl-2";
  const paddingRightClass = "pr-2";
  const borderClass =
    isValid || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  return (
    <div className={`w-full flex ${divFlexCol} ${allowMargin ? "my-2" : ""}`}>
      <div className="w-full flex justify-between">
        {label && (
          <label
            htmlFor={paramCase(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses}`}
          >
            {label}
            <RequiredIndicator required={rejectRequired ? false : required} />
          </label>
        )}
        {addClear && !required && (
          <div className="flex self-start">
            <input
              id={`clear-${name}`}
              data-testid={paramCase(`clear-${name}`)}
              type="checkbox"
              onClick={() => {
                if (formDisabled) {
                  setFieldValue(name, "");
                  setFormDisabled(false);
                  return;
                }
                setFieldValue(name, null);
                setFormDisabled(true);
              }}
              className="cursor-pointer mr-1.5"
            />
            <label htmlFor={`clear-${name}`} className="cursor-pointer text-xs">
              clear
            </label>
          </div>
        )}
      </div>
      <div
        className={`border relative w-full rounded-md text-sm bg-white placeholder-gray-500 focus:shadow-md focus:outline-none ${
          paddingInPixelForInputBox
            ? `py-[${paddingInPixelForInputBox}px]`
            : "py-2"
        } py-2 ${focusBorderClass} ${borderClass} ${paddingRightClass} ${paddingLeftClass}`}
      >
        <EditorContent
          editor={editor}
          data-testid={
            dataTestId ? paramCase(dataTestId) : paramCase(`${name}`)
          }
          className="max-h-44 overflow-scroll text-xs"
          disabled={disabled}
        />
        <hr className="w-full mt-4 mb-1" />
        <MenuBar editor={editor} showImage={showImage} />
      </div>
      {!isValid && (
        <label className="text-red-600 ml-2 mt-1 text-xs">
          {`${label} is required`}
        </label>
      )}
    </div>
  );
}
export default FormRichTextEditor;
