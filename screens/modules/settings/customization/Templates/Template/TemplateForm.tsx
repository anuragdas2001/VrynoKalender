import React, { useContext } from "react";
import { Formik, FormikValues } from "formik";
import TemplateFormFields from "./TemplateFormFields";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import * as Yup from "yup";
import { PageLoader } from "../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import DataLoadErrorContainer from "../../../../crm/shared/components/DataLoadErrorContainer";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import _ from "lodash";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";

let initialValues = {
  templateModuleName: "",
  name: "",
  subject: "",
  fileKey: "",
  attachmentFileKeys: "",
  switchEditor: "",
};

export type TemplateFormProps = {
  data: Record<string, string>;
  appName: string;
  modelName: string;
  loading?: boolean;
  editMode: boolean;
  user: User | null;
  handleSave: (values: FormikValues) => void;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  allLayoutFetched: boolean;
};

const TemplateForm = ({
  data,
  loading,
  appName,
  modelName,
  editMode,
  user,
  handleSave,
  genericModels,
  allModulesFetched,
  allLayoutFetched,
}: TemplateFormProps) => {
  const emailEditorRef = React.useRef(null);
  const { navigations } = useContext(NavigationStoreContext);
  const [modulesFetched, setModulesFetched] = React.useState<IModuleMetadata[]>(
    []
  );
  const [moduleFetchLoading, setModuleFetchLoading] =
    React.useState<boolean>(true);
  const [moduleFetchingFailed, setModuleFetchingFailed] =
    React.useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    templateModuleName: Yup.string().required("Please select a module name."),
    name: Yup.string().required("Please enter name for email template"),
    subject: Yup.string().required("Please enter a subject for email template"),
    fileKey: Yup.mixed(),
    htmlEditor: Yup.mixed(),
    switchEditor: Yup.boolean().nullable(),
  });

  React.useEffect(() => {
    if (allModulesFetched) {
      let responseData = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined)
          ?.filter(
            (moduleItem: IModuleMetadata) =>
              moduleItem.name !== "quotedItem" &&
              moduleItem.name !== "orderedItem" &&
              moduleItem.name !== "invoicedItem" &&
              moduleItem.name !== "purchaseItem"
          ),
      ];
      setModulesFetched([...responseData]);
      setModuleFetchLoading(false);
    }
  }, [allModulesFetched]);

  if (moduleFetchLoading || !allModulesFetched || !allLayoutFetched) {
    return (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col  items-center justify-center"
      >
        <PageLoader />
      </div>
    );
  } else if (moduleFetchingFailed) {
    return (
      <DataLoadErrorContainer
        onClick={() => {
          setModuleFetchLoading(true);
          setModuleFetchingFailed(false);
        }}
      />
    );
  } else {
    return (
      <form id="div" onSubmit={(e) => e.preventDefault()} className="w-full">
        <Formik
          initialValues={{
            ...initialValues,
            ...data,
            switchEditor: data?.contentType === "html" ? true : false,
            htmlEditor: data?.jsonFileKey
              ? data?.jsonFileKey
              : data?.contentType === "html"
              ? data?.fileKey
              : undefined,
            fileKey: data?.contentType !== "html" ? data?.fileKey : undefined,
            attachmentFileKeys: data?.attachmentFileKeys
              ? JSON.parse(data?.attachmentFileKeys)
              : "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values: FormikValues) => {
            const usedHtmlEditor = _.get(values?.htmlEditor, "htmlEditor");
            if (
              (!values["fileKey"] || values["fileKey"] === "<p></p>") &&
              !values["switchEditor"]
            ) {
              Toast.error("Please provide a valid template");
              return;
            }
            usedHtmlEditor
              ? handleSave({
                  ...values,
                  htmlEditor: _.get(values?.htmlEditor, "json", {}),
                  fileKey: _.get(values?.htmlEditor, "html", ""),
                })
              : handleSave({ ...values });
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => {
            return (
              <TemplateFormFields
                handleSave={handleSubmit}
                appName={appName}
                modelName={modelName}
                modules={modulesFetched}
                data={data}
                user={user}
                loading={loading}
                editMode={editMode}
                navigations={navigations}
                emailEditorRef={emailEditorRef}
                genericModels={genericModels}
                allLayoutFetched={allLayoutFetched}
                handleCustomTemplateEditorWrapperSave={handleSubmit}
              />
            );
          }}
        </Formik>
      </form>
    );
  }
};

export default TemplateForm;
