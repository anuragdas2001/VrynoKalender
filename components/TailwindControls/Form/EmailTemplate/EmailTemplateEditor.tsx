import React from "react";
import { Content, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useFormikContext } from "formik";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import Strike from "@tiptap/extension-strike";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import FormDropdown from "../Dropdown/FormDropdown";
import { MenuBar } from "./MenuBar";
import { ICustomField } from "../../../../models/ICustomField";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Gapcursor from "@tiptap/extension-gapcursor";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import TableRow from "@tiptap/extension-table-row";
import FontFamily from "@tiptap/extension-font-family";
import {
  IModuleMetadata,
  ReverseLookup,
} from "../../../../models/IModuleMetadata";
import { getSortedFieldList } from "../../../../screens/modules/crm/shared/utils/getOrderedFieldsList";
import { get } from "lodash";
import SwitchToggle from "../SwitchToggle/SwitchToggle";
import { MixpanelActions } from "../../../../screens/Shared/MixPanel";
import dynamic from "next/dynamic";
import { CustomTemplateEditorWrapper } from "./CustomTemplateEditor/CustomTemplateEditorWrapper";
import { IGenericModel } from "../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../models/Accounts";
import { SignatureModal } from "./SignatureModal";

const CustomEasyEmailEditorWrapper = dynamic(
  () =>
    import("./CustomEasyEmailEditor/CustomEasyEmailEditor").then(
      (lib) => lib.CustomEasyEmailEditorWrapper
    ),
  { ssr: false }
);

export type EmailTemplateEditorProps = {
  name: string;
  label?: string;
  isHtml?: boolean;
  disabled?: boolean;
  data?: Content;
  required?: boolean;
  labelLocation?: SupportedLabelLocations;
  modulesFetched: IModuleMetadata[];
  editMode: boolean;
  moduleSelectorOptions: { value: string; label: string }[];
  appName: string;
  currentModule?: IModuleMetadata;
  uploadToUrl?: "public" | "private";
  fieldSelectorFieldList: ICustomField[];
  allowFileAttachments: boolean;
  allowReverseLookups: boolean;
  showFieldNote: boolean;
  modelName: string;
  emailEditorRef?: React.MutableRefObject<null>;
  loading?: boolean;
  allowMargin?: boolean;
  limitHeight?: boolean;
  showHtmlEditor?: boolean;
  hideFonts?: boolean;
  hideTable?: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  user: User | null;
  editorToggleButtonVisible?: boolean;
  handleEditorChange: (notes: Record<string, any> | string) => void;
  handleCustomTemplateEditorWrapperSave?: () => void;
};

export const EmailTemplateEditor = ({
  name,
  label,
  isHtml,
  disabled,
  data,
  labelLocation = SupportedLabelLocations.OnTop,
  modulesFetched,
  required = false,
  editMode,
  appName,
  currentModule,
  uploadToUrl = "private",
  fieldSelectorFieldList,
  allowFileAttachments,
  showFieldNote,
  allowReverseLookups,
  modelName,
  loading,
  allowMargin = true,
  limitHeight = false,
  showHtmlEditor = true,
  hideFonts = false,
  hideTable = false,
  genericModels,
  allLayoutFetched,
  user,
  editorToggleButtonVisible = true,
  handleEditorChange = () => {},
  handleCustomTemplateEditorWrapperSave = () => {},
}: EmailTemplateEditorProps) => {
  const [htmlEditorCusorLocation, setHtmlEditorCursorLocation] =
    React.useState(0);
  const [insertContentIntoDragDrop, setInsertContentIntoDragDrop] =
    React.useState<string>("");
  const { errors, touched, values, setFieldValue } =
    useFormikContext<Record<string, string>>();
  const isValid = touched[name] ? errors[name] === undefined : true;
  const [groupOptions, setGroupOptions] = React.useState<{
    [name: string]: {
      label: string;
      value: string | null;
      visible?: boolean;
      extraInfoField?: boolean;
      includeModuleName?: boolean;
    }[];
  }>();
  const [editModeFiles, setEditModeFiles] = React.useState<
    { name: string; fileId: string }[]
  >([]);
  const [fileUpload, setFileUpload] = React.useState<
    { name: string; fileId: string }[]
  >([]);
  const [openSignatureWindow, setOpenSignatureWindow] =
    React.useState<boolean>(false);

  let editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder,
      Underline,
      Highlight,
      OrderedList,
      ListItem,
      Link.configure({
        protocols: ["ftp", "mailto"],
        openOnClick: true,
        autolink: false,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      Gapcursor,
      Table.configure({
        resizable: true,
        cellMinWidth: 175,
      }),
      Text,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      TableRow,
      TableHeader,
      TableCell,
      Strike,
    ],
  });

  React.useEffect(() => {
    if (editor !== null) {
      editor.on("update", ({ editor }) => {
        if (!isHtml) {
          handleEditorChange(editor.getJSON());
        } else {
          handleEditorChange(editor.getHTML());
        }
      });
      if (data) {
        editor.commands.setContent(data);
      }
    }
  }, [editor]);

  const divFlexCol = "flex-col";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";
  const borderClass = isValid
    ? "border-vryno-form-border-gray"
    : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  React.useEffect(() => {
    if (
      !currentModule ||
      !currentModule?.reverseLookups ||
      fieldSelectorFieldList?.length <= 0
    )
      return;
    let summarySectionFields: {
      aggregateOn: string;
      aggregatedValue: string | number | null;
      aggregationMethod: string;
      displayAs: { en: string };
      expression: string | null;
      format: { type: string; precision: number; ratio: string };
      input: string;
      name: string;
      type: string;
      reverseLookupFieldName: string;
    }[] = [];
    currentModule?.reverseLookups?.forEach((reverseLookup) => {
      summarySectionFields = [
        ...summarySectionFields,
        ...get(reverseLookup, "summarySection", [])?.map(
          (reverseField: any) => {
            return {
              ...reverseField,
              reverseLookupFieldName: `${reverseLookup?.moduleName}.${reverseLookup?.fieldName}Summary.`,
            };
          }
        ),
      ];
    });

    let updatedGroupOptions: {
      [name: string]: {
        label: string;
        value: string | null;
        visible?: boolean;
        extraInfoField?: boolean;
        includeModuleName?: boolean;
      }[];
    } = {
      ["user"]: [
        {
          label: "Signature",
          value: "signature",
          includeModuleName: false,
        },
      ],
      [currentModule?.name]: fieldSelectorFieldList
        ?.filter(
          (field) =>
            field.visible && !["recordImage", "image"].includes(field.dataType)
        )
        ?.map((field) => {
          const findIndexInSummarySection = summarySectionFields?.findIndex(
            (summaryField) => summaryField.name === field.name
          );
          if (findIndexInSummarySection === -1) {
            return {
              value: field.systemDefined ? field.name : `fields.${field.name}`,
              label: field.label.en,
              includeModuleName: true,
            };
          }
          return {
            value:
              !showFieldNote && field.systemDefined
                ? field.name
                : !showFieldNote && !field.systemDefined
                ? `fields.${field.name}`
                : field.systemDefined
                ? `${summarySectionFields[findIndexInSummarySection]?.reverseLookupFieldName}${field.name}`
                : `${summarySectionFields[findIndexInSummarySection]?.reverseLookupFieldName}fields.${field.name}`,
            label: field.label.en,
            includeModuleName: !showFieldNote ? true : false,
          };
        }),
    };
    {
      allowReverseLookups &&
        currentModule?.reverseLookups?.forEach(
          (reverseLookup: ReverseLookup) => {
            updatedGroupOptions[reverseLookup.moduleName] = updatedGroupOptions[
              reverseLookup.moduleName
            ]
              ? [
                  ...updatedGroupOptions[reverseLookup.moduleName],
                  {
                    value: `${appName}.${reverseLookup?.moduleName}.${reverseLookup?.fieldName}`,
                    label: reverseLookup?.displayedAs?.en,
                    extraInfoField: true,
                    includeModuleName: true,
                  },
                ]
              : [
                  {
                    value: `${appName}.${reverseLookup?.moduleName}.${reverseLookup?.fieldName}`,
                    label: reverseLookup?.displayedAs?.en,
                    extraInfoField: true,
                    includeModuleName: true,
                  },
                ];
          }
        );
    }
    setGroupOptions(updatedGroupOptions);
  }, [currentModule, fieldSelectorFieldList]);

  return (
    <div className={`flex ${divFlexCol} ${allowMargin && "my-4"}`}>
      {label && (
        <label
          htmlFor={paramCase(name)}
          className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray  ${labelClasses}`}
        >
          {label}
          <RequiredIndicator required={required} />
        </label>
      )}
      <div
        className={`border
                    ${borderClass}
                    relative
                    w-full rounded-md
                    text-sm
                    placeholder-gray-500 
                    ${focusBorderClass}
                    focus:shadow-md
                    focus:outline-none`}
      >
        <div
          className={`flex items-center justify-between bg-vryno-table-background px-4 w-full py-2`}
        >
          <div>
            {editorToggleButtonVisible && (
              <SwitchToggle
                name={"switchEditor"}
                label={`HTML Editor`}
                labelLocation="Left"
                onChange={() => {
                  setFieldValue(`switchEditor`, !values[`switchEditor`]);
                  MixpanelActions.track(
                    `switch-boolean-field-${`switchEditor`}:toggle-click`,
                    {
                      type: "switch",
                    }
                  );
                }}
                value={values[`switchEditor`]}
                disabled={
                  disabled ||
                  (values["htmlEditor"] !== null &&
                    values["htmlEditor"] !== undefined &&
                    values["htmlEditor"] !== "") ||
                  (values["fileKey"] !== null &&
                    values["fileKey"] !== undefined &&
                    values["fileKey"] !== "" &&
                    values["fileKey"] !== "<p></p>")
                }
              />
            )}
          </div>
          <div
            className={`col-span-2 gap-x-4 ${
              values["switchEditor"] ||
              (values["switchEditor"] &&
                editMode &&
                typeof JSON.parse(values["htmlEditor"]) !== "string")
                ? "hidden"
                : ""
            }`}
          >
            <FormDropdown
              name="fieldSelector"
              disabled={disabled}
              options={[]}
              allowMargin={false}
              optionGroups={groupOptions}
              onChange={(selectedOption) => {
                setFieldValue(
                  "fieldSelector",
                  selectedOption.currentTarget.value
                );
                if (selectedOption.currentTarget.value === "signature") {
                  setOpenSignatureWindow(true);
                  return;
                }
                let reverseLookup = false;
                let includeModuleName = true;
                let currentServiceValue =
                  selectedOption.currentTarget.value.split(".")[0];
                let currentModuleValue =
                  selectedOption.currentTarget.value.split(".")[1];
                let currentFieldName =
                  selectedOption.currentTarget.value.split(".")[2];
                groupOptions && Object.keys(groupOptions)?.length > 0
                  ? Object.keys(groupOptions)?.forEach((groupOptionKey) => {
                      const findIndex = groupOptions[groupOptionKey]?.findIndex(
                        (groupOption) =>
                          groupOption.value ===
                          selectedOption.currentTarget.value
                      );
                      if (
                        findIndex !== -1 &&
                        groupOptions[groupOptionKey][findIndex]?.extraInfoField
                      )
                        reverseLookup = true;

                      if (
                        findIndex !== -1 &&
                        !groupOptions[groupOptionKey][findIndex]
                          ?.includeModuleName
                      )
                        includeModuleName = false;
                    })
                  : null;

                if (reverseLookup && allLayoutFetched) {
                  let fieldsList =
                    genericModels[currentModuleValue]?.fieldsList || [];
                  let updatedRevereseLookupFieldList = getSortedFieldList(
                    fieldsList
                  )?.filter(
                    (field) =>
                      field?.visible &&
                      (field.addInSummarySection ? true : field?.addInForm)
                  );

                  let currentReverseLookupIndex =
                    currentModule?.reverseLookups?.findIndex(
                      (revLookup) =>
                        `${currentServiceValue}.${currentModuleValue}.${currentFieldName}` ===
                        `${currentServiceValue}.${revLookup?.moduleName}.${revLookup?.fieldName}`
                    ) ?? -1;
                  const updatedContent = `<table><thead><tr><th>Serial No. </th>${updatedRevereseLookupFieldList
                    ?.map(
                      (reverseLookupField) =>
                        `<th>${reverseLookupField?.label?.en}</th>`
                    )
                    .join("")}</tr></thead></table><p>{% for item in ${
                    currentReverseLookupIndex !== -1
                      ? `${currentModuleValue}.${currentModule?.reverseLookups[currentReverseLookupIndex]?.name}`
                      : `${currentModuleValue}.${currentFieldName}`
                  } %}</p><table><tbody><tr><td>{{item.serialNumber}}</td>${updatedRevereseLookupFieldList
                    ?.map(
                      (reverseLookupField) =>
                        `<td>{{item.${reverseLookupField?.name}}}</td>`
                    )
                    .join("")}</tr></tbody></table><p>{% endfor %}</p>`;
                  updatedRevereseLookupFieldList?.length > 0 &&
                  !values["switchEditor"]
                    ? editor?.commands?.insertContent(updatedContent)
                    : updatedRevereseLookupFieldList?.length > 0 &&
                      values["switchEditor"] &&
                      setFieldValue(
                        "htmlEditor",
                        `${values["htmlEditor"].slice(
                          0,
                          htmlEditorCusorLocation
                        )}${updatedContent}${values["htmlEditor"].slice(
                          htmlEditorCusorLocation
                        )}`
                      );
                } else {
                  let insertContent = includeModuleName
                    ? `{{${currentModule?.name}.${selectedOption.currentTarget.value}}}`
                    : `{{${selectedOption.currentTarget.value}}}`;
                  !values["switchEditor"]
                    ? editor?.view.dispatch(
                        editor?.state.tr.insertText(insertContent)
                      )
                    : editMode &&
                      typeof JSON.parse(values["htmlEditor"]) === "string"
                    ? setFieldValue(
                        "htmlEditor",
                        `${values["htmlEditor"].slice(
                          0,
                          htmlEditorCusorLocation
                        )}${insertContent}${values["htmlEditor"].slice(
                          htmlEditorCusorLocation
                        )}`
                      )
                    : setInsertContentIntoDragDrop(insertContent);
                }
                setFieldValue("fieldSelector", null);
              }}
            />
            <pre
              className={`w-full ${
                showFieldNote ? "" : "hidden"
              } flex items-center justify-end text-xs text-gray-700`}
            >{`(Note : **  Reverse Lookup Fields)`}</pre>
          </div>
        </div>
        {values["switchEditor"] ? (
          editMode &&
          values["htmlEditor"] &&
          typeof values["htmlEditor"] === "string" &&
          !values["jsonFileKey"] ? (
            <CustomTemplateEditorWrapper
              editMode={editMode}
              user={user}
              setHtmlEditorCursorLocation={setHtmlEditorCursorLocation}
            />
          ) : (
            <CustomEasyEmailEditorWrapper
              currentModule={currentModule}
              groupOptions={groupOptions}
              loading={loading}
              editMode={editMode}
              modelName={modelName}
              emailTemplateData={values["htmlEditor"]}
              editModeFiles={editModeFiles}
              fileUpload={fileUpload}
              genericModels={genericModels}
              allLayoutFetched={allLayoutFetched}
              allowFileAttachments={allowFileAttachments}
              user={user}
              setEditModeFiles={setEditModeFiles}
              setFileUpload={setFileUpload}
              handleCustomTemplateEditorWrapperSave={
                handleCustomTemplateEditorWrapperSave
              }
            />
          )
        ) : (
          <>
            <MenuBar
              editor={editor}
              allowFileAttachments={allowFileAttachments}
              uploadToUrl={uploadToUrl}
              editMode={editMode}
              disabled={disabled}
              modelName={modelName}
              hideFonts={hideFonts}
              hideTable={hideTable}
              editModeFiles={editModeFiles}
              fileUpload={fileUpload}
              user={user}
              setEditModeFiles={setEditModeFiles}
              setFileUpload={setFileUpload}
            />
            <hr className="w-full mt-2 mb-4" />
            {disabled ? (
              <input
                name="editorContent"
                disabled={disabled}
                className="h-96 overflow-scroll bg-white w-full rounded-md"
              />
            ) : (
              <EditorContent
                onClick={(e) => {
                  setHtmlEditorCursorLocation(
                    (e.target as HTMLTextAreaElement).selectionStart
                  );
                }}
                editor={editor}
                className={`${
                  limitHeight ? "h-60" : "h-96"
                }  overflow-scroll px-4 bg-white rounded-md`}
              />
            )}
          </>
        )}
      </div>
      {openSignatureWindow && (
        <SignatureModal
          user={user}
          handleSelectedHtml={(signatorEditor) => {
            const mainEditorDataSet = editor?.getJSON(); // content from main dataset
            const signatureDataset = signatorEditor?.getJSON(); // content from signature dataset
            let mergedContent = {};
            if (mainEditorDataSet) {
              mergedContent = {
                ...mainEditorDataSet,
                content: [
                  ...(mainEditorDataSet?.content as JSONContent[]),
                  ...(signatureDataset?.content as JSONContent[]),
                ],
              };
            } else {
              mergedContent = {
                ...signatureDataset,
                content: [...(signatureDataset?.content as JSONContent[])],
              };
            }
            editor?.commands?.setContent(mergedContent);
            if (editor) {
              if (!isHtml) {
                handleEditorChange(editor.getJSON());
              } else {
                handleEditorChange(editor.getHTML());
              }
            }
            setFieldValue("fieldSelector", null);
          }}
          setOpenSignatureWindow={setOpenSignatureWindow}
        />
      )}
      {!isValid && errors[name] && (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {errors[name]}
        </label>
      )}
    </div>
  );
};
export default EmailTemplateEditor;
