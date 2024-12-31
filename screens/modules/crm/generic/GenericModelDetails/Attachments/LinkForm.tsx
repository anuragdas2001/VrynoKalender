import { Formik, FormikValues } from "formik";
import React from "react";
import * as Yup from "yup";
import { IFile } from "../../../../../../models/IFile";
import LinkFormFields from "./LinkFormFields";

export type LinkFormProps = {
  data:
    | {
        visible: boolean;
        data: IFile | {};
        id: string | null;
      }
    | {};
  handleSave: (T: FormikValues) => void;
  saveLoading: boolean;
  editMode?: boolean;
  onCancel: () => void;
};

let fieldInitialValues = {
  name: "",
  fileKey: "",
  fileType: "attachment_link",
  fileName: "",
};

const LinkForm = ({
  data,
  handleSave,
  saveLoading,
  editMode = false,
  onCancel = () => {},
}: LinkFormProps) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter a name for link").min(5).max(15),
    fileName: Yup.string()
      .required("Please enter or paste a url")
      .url("Please enter a valid url"),
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
          <LinkFormFields
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

export default LinkForm;
