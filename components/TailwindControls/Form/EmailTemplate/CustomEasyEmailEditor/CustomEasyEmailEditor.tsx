import React, { useState } from "react";
import { BlockManager, BasicType, AdvancedType } from "easy-email-core";
import { EmailEditor, EmailEditorProvider } from "easy-email-editor";
import { ExtensionProps, StandardLayout } from "easy-email-extensions";
import { useWindowSize } from "react-use";
import "easy-email-editor/lib/style.css";
import "easy-email-extensions/lib/style.css";
import "@arco-themes/react-easy-email-theme/css/arco.css";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import Button from "../../Button/Button";
import SaveIcon from "remixicon-react/SaveLineIcon";
import { JsonToMjml } from "easy-email-core";
import { useFormikContext } from "formik";
import { Loading } from "../../../Loading/Loading";
import { imageUploadHandler } from "../../../../../screens/modules/crm/shared/utils/imageUploadHandler";
import { Config } from "../../../../../shared/constants";
import { AttachmentContainer } from "../AttachmentContainer";
import { getSortedFieldList } from "../../../../../screens/modules/crm/shared/utils/getOrderedFieldsList";
import { TableHTMLContent } from "./TableHTMLContent";
import _ from "lodash";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../models/Accounts";
import { Content, useEditor } from "@tiptap/react";
import { getTiptapExtensions } from "../../RichTextEditor/SupportedExtensions";
import { SuggestionOptions } from "@tiptap/suggestion";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";

const defaultCategories: ExtensionProps["categories"] = [
  {
    label: "Content",
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
        payload: { attributes: { padding: "0px 0px 0px 0px" } },
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.WRAPPER,
      },
      {
        type: AdvancedType.NAVBAR,
      },
    ],
  },
  {
    label: "Layout",
    active: true,
    displayType: "column",
    blocks: [
      {
        title: "2 columns",
        payload: [
          ["50%", "50%"],
          ["33%", "67%"],
          ["67%", "33%"],
          ["25%", "75%"],
          ["75%", "25%"],
        ],
      },
      {
        title: "3 columns",
        payload: [
          ["33.33%", "33.33%", "33.33%"],
          ["25%", "25%", "50%"],
          ["50%", "25%", "25%"],
        ],
      },
      {
        title: "4 columns",
        payload: [["25%", "25%", "25%", "25%"]],
      },
      {
        title: "8 columns",
        payload: [
          [
            "12.5%",
            "12.5%",
            "12.5%",
            "12.5%",
            "12.5%",
            "12.5%",
            "12.5%",
            "12.5%",
          ],
        ],
      },
      {
        title: "10 columns",
        payload: [
          [
            "10%",
            "10%",
            "10%",
            "10%",
            "10%",
            "10%",
            "10%",
            "10%",
            "10%",
            "10%",
          ],
        ],
      },
    ],
  },
];

const fontList = [
  "Arial",
  "Tahoma",
  "Verdana",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Lato",
  "Montserrat",
  "Monospace",
  "Roboto",
  "Comic Sans",
  "Brush Script",
  "Pacifico",
].map((item) => ({ value: item, label: item }));

export const CustomEasyEmailEditorWrapper = ({
  currentModule,
  groupOptions,
  loading,
  editMode,
  emailTemplateData,
  allowFileAttachments,
  editModeFiles,
  fileUpload,
  modelName,
  genericModels,
  allLayoutFetched,
  user,
  supportMentions,
  mentionSuggestions,
  setEditModeFiles,
  setFileUpload,
  handleCustomTemplateEditorWrapperSave = () => {},
}: {
  supportMentions?: boolean;
  mentionSuggestions?: Omit<SuggestionOptions, "editor">;
  currentModule?: IModuleMetadata;
  groupOptions?: {
    [label: string]: {
      label: string;
      value: string | null;
      visible?: boolean | undefined;
      extraInfoField?: boolean | undefined;
      includeModuleName?: boolean | undefined;
    }[];
  };
  loading?: boolean;
  editMode: boolean;
  modelName?: string;
  emailTemplateData: string;
  allowFileAttachments: boolean;
  editModeFiles: {
    name: string;
    fileId: string;
  }[];
  fileUpload: {
    name: string;
    fileId: string;
  }[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
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
  handleCustomTemplateEditorWrapperSave?: () => void;
}) => {
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

  const [template, setTemplate] = useState<any | null>({
    content: BlockManager.getBlockByType(BasicType.PAGE)!.create({
      type: BasicType.PAGE,
      data: {
        value: {
          breakpoint: "480px",
          headAttributes: "",
          "font-size": "14px",
          "font-weight": "400",
          "line-height": "1.7",
          headStyles: [],
          fonts: [],
          responsive: true,
          "font-family":
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans','Helvetica Neue', sans-serif",
          "text-color": "#000000",
          width: "2840px",
          height: "100%",
          margin: "0px",
          padding: "0px",
        },
      },
      attributes: {
        "background-color": "#fff",
        width: "2840px",
        height: "100%",
        margin: "0px",
        padding: "0px",
      },
      children: [
        {
          type: "wrapper",
          data: {
            value: {
              width: "2840px",
              height: "100%",
            },
          },
          attributes: {
            padding: "0px",
            margin: "0px",
            direction: "ltr",
            "text-align": "center",
          },
          children: [],
        },
      ],
    }),
  });
  const [currentMergeTag, setCurrentMergeTag] = React.useState<string>("");
  const [internalLoading, setInternalLoading] = React.useState<boolean>(false);
  const { setFieldValue } = useFormikContext();
  const { width } = useWindowSize();
  const smallScene = width < 1400;
  const [updatedValuesInMergetag, setUpdatedValuesInMergetag] = React.useState<
    Record<string, Record<string, string>>
  >({});
  const [tagValueHolder, setTagValueHolder] = React.useState<
    Record<string, string>
  >({});
  const [addThisAsHTMLtoEditor, setAddThisAsHTMLtoEditor] = React.useState<
    string | null
  >(null);
  const [updatedGroupOptions, setUpdatedGroupOptions] = React.useState<{
    [name: string]: {
      label: string;
      value: string | null;
      visible?: boolean | undefined;
      extraInfoField?: boolean | undefined;
      includeModuleName?: boolean | undefined;
      notReverseLookup?: boolean;
    }[];
  }>();

  React.useEffect(() => {
    if (
      groupOptions &&
      Object.keys(groupOptions)?.length > 0 &&
      currentModule
    ) {
      let updatedGroupOptions: any = _.cloneDeep(groupOptions);
      let currentModuleLabel = _.get(currentModule, "name", "");
      updatedGroupOptions[currentModuleLabel].push({
        label: `${currentModuleLabel} Table`,
        value: `crm.${currentModule.name}.${currentModule.name}Table`,
        includeModuleName: true,
        extraInfoField: true,
        notReverseLookup: true,
      });
      setUpdatedGroupOptions(_.cloneDeep(updatedGroupOptions));
    }
  }, [groupOptions, currentModule]);

  React.useEffect(() => {
    let updatedValuesInDropdown: Record<string, string> = {};
    let updatedTagValueHolder: Record<string, string> = {};
    const handleMergeTagGeneration = async () => {
      if (updatedGroupOptions && Object.keys(updatedGroupOptions)?.length > 0) {
        await Promise.all(
          Object.keys(updatedGroupOptions)?.map(async (key) => {
            await Promise.all(
              updatedGroupOptions[key].map(async (groupKey) => {
                let updatedContent = groupKey?.value;
                if (key === "user" && groupKey.value === "signature") {
                  editor?.commands?.setContent(user?.signature as Content);
                  updatedContent = editor ? editor?.getHTML() : null;
                }
                if (groupKey?.value) {
                  let currentServiceValue = updatedContent?.split(".")[0];
                  let currentModuleValue = updatedContent?.split(".")[1];
                  let currentFieldName = updatedContent?.split(".")[2];
                  if (
                    groupKey?.extraInfoField &&
                    currentModuleValue &&
                    allLayoutFetched
                  ) {
                    let updatedRevereseLookupFieldList = getSortedFieldList(
                      genericModels[currentModuleValue]?.fieldsList || []
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
                    if (groupKey?.notReverseLookup) {
                      updatedContent = `<!DOCTYPE html><html><head><style>table{font-family: arial, sans-serif;border-collapse: collapse; overflow : auto; width : 100%; table-layout: fixed; } th{color : white; background-color : black; text-align: left;padding: 8px; width : ${
                        100 /
                        (updatedRevereseLookupFieldList?.filter(
                          (field) => field.visible
                        )?.length +
                          1)
                      }%; word-wrap: break-word;}
                      td{text-align: left;padding: 8px; width : ${
                        100 /
                        (updatedRevereseLookupFieldList?.filter(
                          (field) => field.visible
                        )?.length +
                          1)
                      }%; word-wrap: break-word;}
                      }</style></head><body><table><thead><tr><th>Serial No. </th>${updatedRevereseLookupFieldList
                        ?.filter((field) => field.visible)
                        ?.map(
                          (reverseLookupField) =>
                            `<th>${reverseLookupField?.label?.en}</th>`
                        )
                        .join(
                          ""
                        )}</tr></thead><tbody><tr><td>{{item.serialNumber}}</td>${updatedRevereseLookupFieldList
                        ?.filter((field) => field.visible)
                        ?.map(
                          (reverseLookupField) =>
                            `<td>{{item.${reverseLookupField?.name}}}</td>`
                        )
                        .join("")}</tr></tbody></table></body></html>`;
                    } else {
                      updatedContent = `<!DOCTYPE html><html><head><style>table{font-family: arial, sans-serif;border-collapse: collapse; overflow : auto; width : 100%; table-layout: fixed; } th{color : white; background-color : black; text-align: left;padding: 8px; width : ${
                        100 /
                        (updatedRevereseLookupFieldList?.filter(
                          (field) => field.mandatory
                        )?.length +
                          1)
                      }%; word-wrap: break-word;}
                      td{text-align: left;padding: 8px; width : ${
                        100 /
                        (updatedRevereseLookupFieldList?.filter(
                          (field) => field.mandatory
                        )?.length +
                          1)
                      }%; word-wrap: break-word;}
                      }</style></head><body><table><thead><tr><th>Serial No. </th>${updatedRevereseLookupFieldList
                        ?.filter((field) => field.mandatory)
                        ?.map(
                          (reverseLookupField) =>
                            `<th>${reverseLookupField?.label?.en}</th>`
                        )
                        .join("")}</tr></thead></table><!--{% for item in ${
                        currentReverseLookupIndex !== -1
                          ? `${currentModuleValue}.${currentModule?.reverseLookups[currentReverseLookupIndex]?.name}`
                          : `${currentModuleValue}.${currentFieldName}`
                      } %}--><table><tbody><tr><td>{{item.serialNumber}}</td>${updatedRevereseLookupFieldList
                        ?.filter((field) => field.mandatory)
                        ?.map(
                          (reverseLookupField) =>
                            `<td>{{item.${reverseLookupField?.name}}}</td>`
                        )
                        .join(
                          ""
                        )}</tr></tbody></table><!--{% endfor %}--></body></html>`;
                    }
                  }
                  updatedValuesInDropdown[key] = updatedValuesInDropdown[key]
                    ? {
                        ...(updatedValuesInDropdown[key] as any),
                        [`${groupKey?.value}${
                          key === "user" && groupKey?.value === "signature"
                            ? "**"
                            : groupKey?.extraInfoField && currentModuleValue
                            ? "**"
                            : ""
                        }`]: groupKey.label,
                      }
                    : {
                        [`${groupKey?.value}${
                          key === "user" && groupKey?.value === "signature"
                            ? "**"
                            : groupKey?.extraInfoField && currentModuleValue
                            ? "**"
                            : ""
                        }`]: groupKey.label,
                      };
                  updatedTagValueHolder[
                    `${key}.${groupKey.value as string}${
                      groupKey?.extraInfoField && currentModuleValue ? "**" : ""
                    }`
                  ] = updatedContent as string;
                }
              })
            );
          })
        );
        setUpdatedValuesInMergetag({ ...(updatedValuesInDropdown as any) });
        setTagValueHolder({ ...updatedTagValueHolder });
      }
    };
    handleMergeTagGeneration();
  }, [updatedGroupOptions]);

  React.useEffect(() => {
    if (emailTemplateData && typeof emailTemplateData === "string") {
      setTemplate(JSON.parse(emailTemplateData));
    }
  }, [emailTemplateData]);

  React.useEffect(() => {
    if (currentMergeTag && currentMergeTag.includes("**")) {
      setAddThisAsHTMLtoEditor(
        currentMergeTag === "user.signature**"
          ? tagValueHolder[currentMergeTag.replaceAll("**", "")]
          : tagValueHolder[currentMergeTag]
      );
    }
  }, [currentMergeTag]);

  if (!template) {
    return (
      <div className="w-full h-25vh">
        <Loading color="Blue" />
      </div>
    );
  }

  const onUploadImage = async (file: File) => {
    const fileId = await imageUploadHandler({
      image: file,
      serviceName: "crm",
      moduleName: "emailTemplate",
    });
    if (fileId) {
      return `${Config.metaPublicUploadUrl()}crm/emailTemplate/${fileId}`;
    }
  };

  return (
    <div className="w-full h-full">
      {addThisAsHTMLtoEditor && (
        <TableHTMLContent
          htmlContent={addThisAsHTMLtoEditor}
          setAddThisAsHTMLtoEditor={setAddThisAsHTMLtoEditor}
          setCurrentMergeTag={setCurrentMergeTag}
        />
      )}
      <AttachmentContainer
        editMode={editMode}
        modelName={modelName}
        allowFileAttachments={allowFileAttachments}
        editModeFiles={editModeFiles}
        fileUpload={fileUpload}
        setEditModeFiles={setEditModeFiles}
        setFileUpload={setFileUpload}
      />
      <EmailEditorProvider
        data={template}
        height={"calc(100vh - 70px)"}
        autoComplete
        dashed={false}
        fontList={fontList}
        onUploadImage={onUploadImage as any}
        onSubmit={async (values) => {
          setInternalLoading(true);
          setTemplate(values);
          const jsonTomjml = JsonToMjml({
            data: values?.content,
            context: values?.content,
            mode: "production",
          });
          try {
            const response = await fetch("/api/generate-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ jsonTomjml }),
            });

            const data = await response.json();
            await setFieldValue("htmlEditor", {
              json: values,
              html: data.html,
              htmlEditor: true,
            });
            setTimeout(() => {
              handleCustomTemplateEditorWrapperSave();
              setInternalLoading(false);
            }, 1000);
          } catch (error) {
            console.error("Error:", error);
            setInternalLoading(false);
          }
        }}
        mergeTags={{ ...updatedValuesInMergetag }}
        mergeTagGenerate={(value) => {
          setCurrentMergeTag(
            `${
              value?.split(`.`)?.length > 3
                ? currentModule?.name === value?.split(".")[0]
                  ? value?.slice(
                      value?.indexOf(".") ? value?.indexOf(".") + 1 : 0
                    )
                  : value
                : value
            }`
          );
          return `{{${
            value?.split(`.`)?.length > 3
              ? currentModule?.name === value?.split(".")[0]
                ? value?.slice(
                    value?.indexOf(".") ? value?.indexOf(".") + 1 : 0
                  )
                : value
              : value
          }}}`;
        }}
      >
        {({ values }, { submit, restart }) => {
          return (
            <>
              <div
                className={`${
                  !template ? "hidden" : ""
                } fixed top-[5rem] md:top-[4.3rem] right-0 z-[999] pr-6`}
              >
                <Button
                  id="save-template"
                  buttonType="thin"
                  kind="primary"
                  onClick={submit}
                  loading={loading || internalLoading}
                  disabled={loading || internalLoading}
                  userEventName="template-save:submit-click"
                >
                  <span className="flex items-center justify-center gap-x-1">
                    <SaveIcon size={18} />
                    <span className="text-sm">{`Save`}</span>
                  </span>
                </Button>
              </div>
              <StandardLayout
                compact={!smallScene}
                showSourceCode={true}
                categories={defaultCategories}
              >
                <EmailEditor />
              </StandardLayout>
            </>
          );
        }}
      </EmailEditorProvider>
    </div>
  );
};
