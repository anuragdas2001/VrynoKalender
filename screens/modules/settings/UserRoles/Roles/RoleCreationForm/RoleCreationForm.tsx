import { Formik, FormikValues } from "formik";
import React from "react";
import * as Yup from "yup";
import RoleCreationFormFields from "./RoleCreationFormFields";
import { IRole } from "../../../../../../models/shared";

export type RoleCreationFormProps = {
  userRoles: { value: string; label: string }[];
  data: IRole | null;
  handleSave: (T: FormikValues) => void;
  saveLoading: boolean;
  editMode?: boolean;
  onCancel: () => void;
};

const RoleCreationForm = ({
  userRoles,
  data,
  handleSave,
  saveLoading,
  editMode = false,
  onCancel = () => {},
}: RoleCreationFormProps) => {
  const validationSchema = Yup.object().shape({
    role: Yup.string()
      .matches(/^\S+(?: \S+)*$/, "Role name cannot start or end with space.")
      .required("Please enter a role name")
      .min(1, "Role name must be atleast 1 characters")
      .max(35, "Role name cannot exceed 35 characters."),
    copyFrom: Yup.string().nullable(),
  });

  let fieldInitialValues = {
    role: "",
    copyFrom: "",
  };
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
          <RoleCreationFormFields
            editMode={editMode}
            userRoles={userRoles}
            handleSave={handleSubmit}
            saveLoading={saveLoading}
            onCancel={onCancel}
            rolesData={data}
          />
        )}
      </Formik>
    </form>
  );
};

export default RoleCreationForm;
