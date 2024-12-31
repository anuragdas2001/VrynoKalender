import { Formik, FormikValues } from "formik";
import React from "react";
import * as Yup from "yup";
import AttachmentFormFields from "./AttachmentFormFields";

export type AttachmentFormProps = {
  data: any;
  handleSave: (T: FormikValues) => void;
  saveLoading: boolean;
  editMode?: boolean;
  onCancel: () => void;
  modelName: string;
};

let fieldInitialValues = {
  name: "",
  fileType: "",
  fileKey: "",
  fileName: "",
};

const AttachmentForm = ({
  data,
  handleSave,
  saveLoading,
  editMode = false,
  onCancel = () => {},
  modelName,
}: AttachmentFormProps) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter a name for the file")
      .min(5)
      .max(250),
    fileKey: Yup.string().required("Please choose a file to upload").nullable(),
  });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Formik
        initialValues={{
          ...fieldInitialValues,
          ...data,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {({ handleSubmit }) => (
          <AttachmentFormFields
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

export default AttachmentForm;
