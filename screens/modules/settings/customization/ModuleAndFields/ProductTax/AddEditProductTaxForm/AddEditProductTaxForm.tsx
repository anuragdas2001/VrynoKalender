import { Formik, FormikValues } from "formik";
import React from "react";
import * as Yup from "yup";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import AddEditProductTaxFormFields from "./AddEditProductTaxFormFields";

export type AddEditProductTaxFormProps = {
  data: any;
  handleSave: (T: FormikValues) => void;
  saveLoading: boolean;
  editMode?: boolean;
  onCancel: () => void;
};

const AddEditProductTaxForm = ({
  data,
  handleSave,
  saveLoading,
  editMode = false,
  onCancel = () => {},
}: AddEditProductTaxFormProps) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Tax name is required")
      .min(2, "Tax name cannot be less than 2")
      .max(30, "Tax name cannot exceed 30"),
    value: Yup.number()
      .nullable()
      .min(0, "Tax percentage cannot be less than 0")
      .max(100, "Tax percentage cannot exceed 100"),
  });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Formik
        initialValues={{
          name: data?.name,
          type: data?.taxType,
          value: data?.taxValue,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {({ handleSubmit, values, initialValues }) => (
          <AddEditProductTaxFormFields
            editMode={editMode}
            handleSave={handleSubmit}
            saveLoading={saveLoading}
            onCancel={onCancel}
          />
        )}
      </Formik>
    </form>
  );
};

export default AddEditProductTaxForm;
