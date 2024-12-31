import React, { useEffect, useRef } from "react";
import GenericBackHeader from "../../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import SaveIcon from "remixicon-react/SaveLineIcon";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useFormikContext } from "formik";
import EmailTemplateEditor from "../../../../../../components/TailwindControls/Form/EmailTemplate/EmailTemplateEditor";
import { setHeight } from "../../../../crm/shared/utils/setHeight";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { getSortedModuleByNavigation } from "../../../../crm/shared/utils/getSortedModuleListAccordingToNavigation";
import { INavigation } from "../../../../../../models/INavigation";
import _ from "lodash";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";

export type TemplateFormFieldsProps = {
  data: any;
  modules: IModuleMetadata[];
  appName: string;
  modelName: string;
  loading?: boolean;
  editMode: boolean;
  navigations: INavigation[];
  emailEditorRef: React.MutableRefObject<null>;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  user: User | null;
  handleSave: () => void;
  handleCustomTemplateEditorWrapperSave?: () => void;
};

const TemplateFormFields = ({
  data,
  modules,
  loading,
  appName,
  modelName,
  editMode,
  navigations,
  emailEditorRef,
  genericModels,
  allLayoutFetched,
  user,
  handleSave,
  handleCustomTemplateEditorWrapperSave = () => {},
}: TemplateFormFieldsProps) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [fieldSelectorFieldList, setFieldSelectorFieldList] = React.useState<
    ICustomField[]
  >([]);

  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef);
    }
  });

  React.useEffect(() => {
    if (allLayoutFetched && values["templateModuleName"]) {
      setFieldSelectorFieldList(
        genericModels[values["templateModuleName"]]?.fieldsList?.filter(
          (field) =>
            field.name !== "layoutId" &&
            field.name !== "id" &&
            field.name !== "recordStatus"
        )
      );
    }
  }, [allLayoutFetched, values["templateModuleName"]]);

  return (
    <>
      <GenericBackHeader heading={`${editMode ? "Edit" : "Create"} Template`}>
        <div>
          {!values["switchEditor"] && (
            <Button
              id="save-template"
              buttonType="thin"
              kind="primary"
              loading={loading}
              disabled={loading}
              onClick={() => {
                handleSave();
              }}
              userEventName="template-save:submit-click"
            >
              <span className="flex items-center justify-center gap-x-1">
                <SaveIcon size={18} />
                <span className="text-sm">{`Save`}</span>
              </span>
            </Button>
          )}
        </div>
      </GenericBackHeader>
      <div ref={heightRef} className="p-6 overflow-y-auto">
        <div className="bg-white py-5 px-6 w-full rounded-2xl shadow-sm">
          <FormDropdown
            name="templateModuleName"
            label="Module Name"
            options={getSortedModuleByNavigation(navigations, modules)?.map(
              (module) => {
                return { value: module.name, label: module.label?.en };
              }
            )}
            required={true}
            disabled={
              editMode ||
              (values["fileKey"] !== undefined &&
                values["fileKey"] !== "<p></p>") ||
              (values["htmlEditor"] !== null &&
                values["htmlEditor"] !== undefined &&
                values["htmlEditor"] !== "")
            }
            onChange={(selectedOption) => {
              setFieldValue(
                "templateModuleName",
                selectedOption.currentTarget.value
              );
              setFieldValue("fieldSelector", null);
              setFieldSelectorFieldList(
                genericModels[
                  values[selectedOption.currentTarget.value]
                ]?.fieldsList?.filter(
                  (field) =>
                    field.name !== "layoutId" &&
                    field.name !== "id" &&
                    field.name !== "recordStatus"
                )
              );
            }}
          />
          <div className="grid grid-cols-2 gap-x-4">
            <FormInputBox name="name" label="Template Name" required={true} />
            <FormInputBox
              name="subject"
              label="Template Subject"
              required={true}
            />
          </div>
          <EmailTemplateEditor
            name="fileKey"
            label="Template"
            data={(values as any)["fileKey"]}
            emailEditorRef={emailEditorRef}
            showFieldNote={modelName === "moduleTemplate" ? true : false}
            allowFileAttachments={modelName === "moduleTemplate" ? false : true}
            allowReverseLookups={modelName === "moduleTemplate" ? true : false}
            handleEditorChange={(value) => {
              setFieldValue("fileKey", value);
            }}
            isHtml={true}
            modulesFetched={modules}
            appName={appName}
            user={user}
            currentModule={
              (values as any)["templateModuleName"]
                ? getSortedModuleByNavigation(navigations, modules)?.filter(
                    (module) =>
                      module?.name === (values as any)["templateModuleName"]
                  )[0]
                : undefined
            }
            moduleSelectorOptions={getSortedModuleByNavigation(
              navigations,
              modules
            )?.map((module) => {
              return { value: module.name, label: module.label?.en };
            })}
            fieldSelectorFieldList={fieldSelectorFieldList}
            uploadToUrl="public"
            disabled={!values["templateModuleName"]}
            editMode={editMode}
            modelName={modelName}
            loading={loading}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            handleCustomTemplateEditorWrapperSave={
              handleCustomTemplateEditorWrapperSave
            }
          />
        </div>
      </div>
    </>
  );
};
export default TemplateFormFields;
