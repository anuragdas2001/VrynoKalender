import React from "react";
import { Editor } from "@tiptap/react";
import BoldIcon from "remixicon-react/BoldIcon";
import ItalicIcon from "remixicon-react/ItalicIcon";
import UnderlineIcon from "remixicon-react/UnderlineIcon";
import HighlightIcon from "remixicon-react/MarkPenLineIcon";
import UndoBackIcon from "remixicon-react/ArrowGoBackLineIcon";
import UndoForwardIcon from "remixicon-react/ArrowGoForwardLineIcon";
import strikeThroughIcon from "remixicon-react/Strikethrough2Icon";
import BracesIcon from "remixicon-react/BracesLineIcon";
import { PageIcons } from "../../VrynoIcon";
import ImageUrlPicker from "../RichTextEditor/ImageUrlPicker";
import { imageUploadHandler } from "../../../../screens/modules/crm/shared/utils/imageUploadHandler";
import { getSecureImageObjectURL } from "../SecureImage/getSecureImageObjectURL";
import { imageToUri } from "../../../../screens/modules/crm/shared/utils/getImageDataUrl";
import { Config } from "../../../../shared/constants";
import LinksIcon from "remixicon-react/LinksLineIcon";
import UnLinkIcon from "remixicon-react/LinkUnlinkIcon";
import ListCheckIcon from "remixicon-react/ListOrderedIcon";
import GenericFormModalContainer from "../../Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../Backdrop";
import { Formik } from "formik";
import FormInputBox from "../InputBox/FormInputBox";
import Button from "../Button/Button";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { get } from "lodash";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import { insertHTML } from "./CustomNodes/rawHtmlNode";
import CodeIcon from "remixicon-react/CodeSSlashLineIcon";
import FormTextAreaBox from "../TextArea/FormTextAreaBox";
import { AttachmentContainer } from "./AttachmentContainer";
import { User } from "../../../../models/Accounts";

export const MenuBar = ({
  editor,
  modelName,
  uploadToUrl,
  allowFileAttachments,
  editMode,
  disabled,
  editModeFiles,
  fileUpload,
  hideFonts = false,
  hideTable = false,
  user,
  setEditModeFiles,
  setFileUpload,
}: {
  editor: Editor | null;
  modelName?: string;
  allowFileAttachments: boolean;
  uploadToUrl: "public" | "private";
  editMode: boolean;
  disabled?: boolean;
  editModeFiles: {
    name: string;
    fileId: string;
  }[];
  fileUpload: {
    name: string;
    fileId: string;
  }[];
  hideFonts?: boolean;
  hideTable?: boolean;
  user: User | null;
  setEditModeFiles: (
    values: {
      name: string;
      fileId: string;
    }[]
  ) => void;
  setFileUpload: (
    values: {
      name: string;
      fileId: string;
    }[]
  ) => void;
}) => {
  const { t } = useTranslation(["common"]);

  const selectedText = editor?.state?.doc?.textBetween(
    editor.view.state.selection.from,
    editor.view.state.selection.to,
    ""
  );
  const [linkModalVisible, setLinkModalVisible] =
    React.useState<boolean>(false);
  const [recordUrlLinkVisible, setRecordUrlLinkVisible] =
    React.useState<boolean>(false);
  const validationSchema = Yup.object().shape({
    linkText: Yup.string().required("Please enter a text for link"),
    link: Yup.string().required("Valid URL is required."),
  });

  const htmlCodeValidationSchema = Yup.object().shape({
    htmlCode: Yup.string().required("Please enter a valid html."),
  });

  const [uploadHtml, setUploadHtml] = React.useState<{
    visible: boolean;
    data: string | null;
  }>({ visible: false, data: "" });

  if (!editor) return null;

  const handleImageAdd = async (
    item: File,
    uploadToUrl: "public" | "private"
  ) => {
    const fileId = await imageUploadHandler({
      image: item,
      serviceName: "crm",
      moduleName: "emailTemplate",
    });
    if (fileId) {
      uploadToUrl === "public"
        ? editor
            .chain()
            .focus()
            .setImage({
              src: `${Config.metaPublicUploadUrl()}crm/emailTemplate/${fileId}`,
            })
            .run()
        : getSecureImageObjectURL(
            `${Config.metaPrivateUploadUrl()}crm/emailTemplate/${fileId}`
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
    setRecordUrlLinkVisible(false);
  };

  const handleExternalError = (value: string) => {
    const urlRegex = new RegExp(
      "((http|https)://)(www.)?" +
        "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" +
        "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)"
    );
    if (value?.toString() === "{{recordUrl}}" || urlRegex.test(value)) {
      return "";
    } else return `Please enter a valid url`;
  };

  return (
    <>
      <div
        className={`flex flex-row flex-wrap items-center justify-evenly my-4`}
      >
        <input
          type="color"
          disabled={disabled}
          onChange={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
          defaultValue={"#C2C2C2"}
          value={editor.getAttributes("textStyle").color}
          className={`w-6 h-6 rounded-md bg-white cursor-pointer ${
            disabled ? "" : "hover:text-blue-500"
          }`}
        />
        <Button
          id="menu-bar-underline"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          customStyle={
            editor.isActive("underline")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-underline:toggle-click"
        >
          {PageIcons(UnderlineIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-bold"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
          customStyle={
            editor.isActive("bold")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-bold:toggle-click"
        >
          {PageIcons(BoldIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-italic"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          customStyle={
            editor.isActive("italic")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-italic:toggle-click"
        >
          {PageIcons(ItalicIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-strike"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          customStyle={
            editor.isActive("strike")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-strike:toggle-click"
        >
          {PageIcons(strikeThroughIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-highlight"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          customStyle={
            editor.isActive("highlight")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-highlight:toggle-click"
        >
          {PageIcons(HighlightIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-ordered-list"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          customStyle={
            editor.isActive("orderedList")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-orderedList:toggle-click"
        >
          {PageIcons(ListCheckIcon, 20, "cursor-pointer")}
        </Button>
        <div id="menu-bar-image-picker">
          <ImageUrlPicker
            disabled={disabled}
            onChange={(item: File) => handleImageAdd(item, uploadToUrl)}
          />
        </div>
        <Button
          id="menu-bar-code-button"
          disabled={disabled}
          onClick={() => setUploadHtml({ visible: true, data: "" })}
          customStyle={
            uploadHtml.visible
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-htmlCodeInsert:toggle-click"
        >
          {PageIcons(CodeIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-link"
          disabled={disabled}
          onClick={() => {
            setRecordUrlLinkVisible(true);
            setLinkModalVisible(true);
          }}
          customStyle={
            editor.isActive("link")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-link:toggle-click"
        >
          {PageIcons(BracesIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-link-modal"
          disabled={disabled}
          onClick={() => {
            setLinkModalVisible(true);
          }}
          customStyle={
            editor.isActive("link")
              ? "text-blue-500"
              : `text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`
          }
          userEventName="menuBar-link-modal:toggle-click"
        >
          {PageIcons(LinksIcon, 20, "cursor-pointer")}
        </Button>
        {editor.isActive("link") && (
          <Button
            id="menu-bar-unset-link"
            disabled={disabled}
            onClick={() => editor.chain().focus().unsetLink().run()}
            customStyle={`text-gray-400 ${
              disabled ? "" : "hover:text-blue-500"
            }`}
            userEventName="menuBar-unsetLink:toggle-click"
          >
            {PageIcons(UnLinkIcon, 20, "cursor-pointer")}
          </Button>
        )}
        <Button
          id="menu-bar-undo"
          disabled={disabled}
          onClick={() => editor.chain().focus().undo().run()}
          customStyle={`text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`}
          userEventName="menuBar-undo:toggle-click"
        >
          {PageIcons(UndoBackIcon, 20, "cursor-pointer")}
        </Button>
        <Button
          id="menu-bar-redo"
          disabled={disabled}
          onClick={() => editor.chain().focus().redo().run()}
          customStyle={`text-gray-400 ${disabled ? "" : "hover:text-blue-500"}`}
          userEventName="menuBar-redo:toggle-click"
        >
          {PageIcons(UndoForwardIcon, 20, "cursor-pointer")}
        </Button>
      </div>
      <hr className={`w-full mt-2 mb-4 ${hideFonts ? "hidden" : ""}`} />
      <div
        className={`flex flex-row items-center justify-evenly py-1 ${
          hideFonts ? "hidden" : ""
        }`}
      >
        <Button
          id="menu-bar-font-style-inter"
          disabled={disabled}
          onClick={() => editor.chain().focus().setFontFamily("Inter").run()}
          customStyle={
            editor.isActive("textStyle", { fontFamily: "Inter" })
              ? "text-blue-500 cursor-pointer"
              : `text-gray-400 cursor-pointer ${
                  disabled ? "" : "hover:text-blue-500"
                }`
          }
          userEventName="menuBar-fontStyle-inter-click"
        >
          Inter
        </Button>
        <Button
          id="menu-bar-font-style-sans"
          disabled={disabled}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setFontFamily("Comic Sans MS, Comic Sans")
              .run()
          }
          customStyle={
            editor.isActive("textStyle", {
              fontFamily: "Comic Sans MS, Comic Sans",
            })
              ? "text-blue-500 cursor-pointer"
              : `text-gray-400 cursor-pointer ${
                  disabled ? "" : "hover:text-blue-500"
                }`
          }
          userEventName="menuBar-fontStyle-sans-click"
        >
          Sans
        </Button>
        <Button
          id="menu-bar-font-style-serif"
          disabled={disabled}
          onClick={() => editor.chain().focus().setFontFamily("serif").run()}
          customStyle={
            editor.isActive("textStyle", { fontFamily: "serif" })
              ? "text-blue-500 cursor-pointer"
              : `text-gray-400 cursor-pointer ${
                  disabled ? "" : "hover:text-blue-500"
                }`
          }
          userEventName="menuBar-fontStyle-serif-click"
        >
          Serif
        </Button>
        <Button
          id="menu-bar-font-style-monospace"
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().setFontFamily("monospace").run()
          }
          customStyle={
            editor.isActive("textStyle", { fontFamily: "monospace" })
              ? "text-blue-500 cursor-pointer"
              : `text-gray-400 cursor-pointer ${
                  disabled ? "" : "hover:text-blue-500"
                }`
          }
          userEventName="menuBar-fontStyle-monospace-click"
        >
          Monospace
        </Button>
        <Button
          id="menu-bar-font-style-cursive"
          disabled={disabled}
          onClick={() => editor.chain().focus().setFontFamily("cursive").run()}
          customStyle={
            editor.isActive("textStyle", { fontFamily: "cursive" })
              ? "text-blue-500 cursor-pointer"
              : `text-gray-400 cursor-pointer ${
                  disabled ? "" : "hover:text-blue-500"
                }`
          }
          userEventName="menuBar-fontStyle-cursive-click"
        >
          Cursive
        </Button>
      </div>
      <hr className={`w-full mb-4 ${hideFonts ? "hidden" : ""}`} />
      <div
        className={`flex flex-row items-center justify-evenly pb-4 ${
          hideTable ? "hidden" : ""
        }`}
      >
        <span>Table</span>
        <button
          disabled={disabled}
          className={"text-gray-400 flex gap-x-1 hover:text-blue-500"}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          New
        </button>
        <button
          disabled={disabled}
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className={"text-gray-400 flex gap-x-1 hover:text-blue-500"}
        >
          {PageIcons(AddIcon, 20, "cursor-pointer")} Column Before
        </button>
        <button
          disabled={disabled}
          className={"text-gray-400 flex gap-x-1 hover:text-blue-500"}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          {PageIcons(AddIcon, 20, "cursor-pointer")} Column After
        </button>
        <button
          disabled={disabled}
          className={"text-gray-400 flex gap-x-1 hover:text-red-500"}
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          {PageIcons(DeleteIcon, 20, "cursor-pointer")} Column
        </button>
        <button
          disabled={disabled}
          className={"text-gray-400 flex gap-x-1 hover:text-blue-500"}
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          {PageIcons(AddIcon, 20, "cursor-pointer")} Row Before
        </button>
        <button
          disabled={disabled}
          className={"text-gray-400 flex gap-x-1 hover:text-blue-500"}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          {PageIcons(AddIcon, 20, "cursor-pointer")} Row After
        </button>
        <button
          disabled={disabled}
          className={"text-gray-400 flex gap-x-1 hover:text-red-500"}
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          {PageIcons(DeleteIcon, 20, "cursor-pointer")} Row
        </button>
        <button
          disabled={disabled}
          className={"text-gray-400 flex gap-x-1 hover:text-red-500"}
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          {PageIcons(DeleteIcon, 20, "cursor-pointer")} Table
        </button>
      </div>
      <hr className={`w-full mb-3 ${allowFileAttachments ? "" : "hidden"}`} />
      {allowFileAttachments && (
        <AttachmentContainer
          modelName={modelName}
          editMode={editMode}
          allowFileAttachments={allowFileAttachments}
          editModeFiles={editModeFiles}
          fileUpload={fileUpload}
          setEditModeFiles={setEditModeFiles}
          setFileUpload={setFileUpload}
          disabled={disabled}
        />
      )}
      {uploadHtml?.visible && (
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <GenericFormModalContainer
            formHeading={`Add Html Code`}
            onOutsideClick={() => {
              setUploadHtml({ visible: false, data: "" });
            }}
            limitWidth={true}
            onCancel={() => {
              setUploadHtml({ visible: false, data: "" });
            }}
          >
            <Formik
              initialValues={{
                htmlCode: "",
              }}
              validationSchema={htmlCodeValidationSchema}
              onSubmit={(values) => {
                insertHTML(editor, values?.htmlCode ?? "");
                setUploadHtml({ visible: false, data: "" });
              }}
            >
              {({ handleSubmit, values }) => (
                <div className="w-full">
                  <FormTextAreaBox name="htmlCode" label="HTML" rows={10} />
                  <div className="grid grid-cols-2 gap-x-4 mt-4">
                    <Button
                      id="cancel-form"
                      onClick={() => {
                        setUploadHtml({ visible: false, data: "" });
                      }}
                      kind="back"
                      userEventName="richText-menu-html-code:cancel-click"
                    >
                      {t("common:cancel")}
                    </Button>
                    <Button
                      id="save-form"
                      onClick={() => {
                        handleSubmit();
                      }}
                      kind="primary"
                      userEventName="richText-menu-html-code:save-click"
                    >
                      {t("common:save")}
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </GenericFormModalContainer>
          <Backdrop onClick={() => setLinkModalVisible(false)} />
        </form>
      )}

      {linkModalVisible && (
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <GenericFormModalContainer
            formHeading={`Add Link`}
            onOutsideClick={() => {
              setRecordUrlLinkVisible(false);
              setLinkModalVisible(false);
            }}
            limitWidth={true}
            onCancel={() => {
              setRecordUrlLinkVisible(false);
              setLinkModalVisible(false);
            }}
          >
            <Formik
              initialValues={{
                link: recordUrlLinkVisible
                  ? editor?.getAttributes("link") &&
                    Object.keys(editor?.getAttributes("link"))?.length > 0
                    ? get(
                        editor?.getAttributes("link"),
                        "href",
                        "{{recordUrl}}"
                      )
                    : "{{recordUrl}}"
                  : editor?.getAttributes("link") &&
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
              {({ handleSubmit, values }) => (
                <div className="w-full">
                  <FormInputBox name="linkText" label="Text" type="text" />
                  <FormInputBox
                    name="link"
                    label="URL"
                    type="text"
                    disabled={recordUrlLinkVisible}
                    externalError={
                      values["link"] ? handleExternalError(values["link"]) : ""
                    }
                  />
                  <div className="mt-4">
                    <Button
                      id="save-form"
                      onClick={() => {
                        handleSubmit();
                      }}
                      kind="primary"
                      disabled={
                        handleExternalError(values["link"]) === ""
                          ? false
                          : true
                      }
                      userEventName="richText-menu-link:save-click"
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
