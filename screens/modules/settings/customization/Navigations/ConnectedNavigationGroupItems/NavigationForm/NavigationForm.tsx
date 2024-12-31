import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import NavigationFormFields from "./NavigationFormFields";
import { INavigation } from "../../../../../../../models/INavigation";
import { IGenericModel } from "../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { get } from "lodash";

export type NavigationFormProps = {
  data: INavigation | null;
  handleSave: (T: INavigation, editMode: boolean) => void;
  saveLoading: boolean;
  editMode?: boolean;
  onCancel: () => void;
  currentNavigationGroup: string;
  navigationByGroupKey: INavigation[];
  navigationItems: INavigation[];
  genericModels: IGenericModel;
  allModulesFetched: boolean;
};

const fieldInitialValues: Partial<INavigation> = {
  name: "",
  label: "",
  groupKey: "",
  order: -1,
  navType: "",
  navTypeMetadata: "",
};

const NavigationForm = ({
  data,
  handleSave,
  saveLoading,
  editMode = false,
  onCancel = () => {},
  currentNavigationGroup,
  navigationByGroupKey,
  navigationItems,
  genericModels,
  allModulesFetched,
}: NavigationFormProps) => {
  const validationSchema = Yup.object().shape({
    label: Yup.string()
      .required("Please enter a name for navigation module")
      .min(1)
      .max(35)
      .matches(/^\S+(?:\s+\S+)*$/g, "Name cannot contain trailing blankspaces"),
    order: Yup.number()
      .required("Please enter a valid order number")
      .min(0, "Minimum value for order is 3")
      .max(999, "Maximum value for order is 999"),
    navType: Yup.string().required("Please select a option"),
    navTypeMetadata: Yup.string().required(
      "Navigation Type Metadata is required"
    ),
  });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Formik
        initialValues={{
          ...fieldInitialValues,
          ...data,
          label: get(data?.label, "en", ""),
          navType: data?.navType,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values as INavigation, editMode);
        }}
      >
        {({ handleSubmit }) => (
          <NavigationFormFields
            data={data}
            navigationItems={navigationItems}
            editMode={editMode}
            handleSave={handleSubmit}
            saveLoading={saveLoading}
            onCancel={onCancel}
            currentNavigationGroup={currentNavigationGroup}
            navigationByGroupKey={navigationByGroupKey}
            genericModels={genericModels}
            allModulesFetched={allModulesFetched}
          />
        )}
      </Formik>
    </form>
  );
};

export default NavigationForm;
