import React from "react";
import * as Yup from "yup";
import { Formik, FormikValues } from "formik";
import ModuleCreationFormFields from "./ModuleCreationFormFields";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import { getFieldsFromDisplayExpression } from "../../../../../crm/shared/utils/getFieldsFromDisplayExpression";
import { IGenericModel } from "../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type ModuleCreationFormProps = {
  appName?: string;
  moduleData?: IModuleMetadata | null;
  handleSave: (T: FormikValues) => void;
  saveLoading: boolean;
  editMode?: boolean;
  onCancel: () => void;
  modulesFetched: IModuleMetadata[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
};

let fieldInitialValues = {
  name: "",
  label: "",
  createNavigationItem: true,
};

const ModuleCreationForm = ({
  appName,
  moduleData,
  handleSave,
  saveLoading,
  editMode = false,
  modulesFetched,
  genericModels,
  allLayoutFetched,
  onCancel = () => {},
}: ModuleCreationFormProps) => {
  const validationSchema = Yup.object().shape({
    label: Yup.string()
      .required("Please enter a name for module")
      .min(3)
      .max(35)
      .matches(/^\S+(?:\s+\S+)*$/g, "Name cannot contain trailing blankspaces"),
  });

  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);

  React.useEffect(() => {
    if (moduleData?.name && allLayoutFetched) {
      setFieldsList(genericModels[moduleData?.name]?.fieldsList ?? []);
    }
  }, [moduleData?.name, allLayoutFetched]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Formik
        initialValues={{
          ...fieldInitialValues,
          label: moduleData?.label?.en,
          searchByFields: moduleData
            ? getFieldsFromDisplayExpression(
                moduleData?.displayExpression ?? ""
              )
            : ["name"],
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {({ handleSubmit }) => (
          <ModuleCreationFormFields
            editMode={editMode}
            fieldsList={fieldsList}
            modulesFetched={modulesFetched}
            handleSave={handleSubmit}
            saveLoading={saveLoading}
            onCancel={onCancel}
            moduleData={moduleData}
          />
        )}
      </Formik>
    </form>
  );
};

export default ModuleCreationForm;
