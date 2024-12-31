import React from "react";
import { ICustomView } from "../../../../../../models/shared";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { ICustomField } from "../../../../../../models/ICustomField";
import { CustomViewFieldsModalForm } from "./CustomViewFieldsModalForm";
import { FormikValues } from "formik";

export type CustomViewFieldsModalProps = {
  formHeading: string;
  customView: ICustomView | null;
  fieldsList: ICustomField[];
  customViewFieldsList: ICustomField[];
  savingProcess: boolean;
  handleSave: (values: FormikValues) => void;
  onCancel: () => void;
};

export const CustomViewFieldsModal = ({
  formHeading,
  customView,
  fieldsList,
  customViewFieldsList,
  savingProcess,
  handleSave,
  onCancel,
}: CustomViewFieldsModalProps) => {
  return (
    <>
      <GenericFormModalContainer
        formHeading={formHeading}
        onCancel={() => onCancel()}
        onOutsideClick={() => onCancel()}
      >
        <CustomViewFieldsModalForm
          customView={customView}
          fieldsList={fieldsList?.filter(
            (field) =>
              field.name !== "layoutId" && field.name !== "recordStatus"
          )}
          customViewFieldsList={customViewFieldsList}
          savingProcess={savingProcess}
          handleSave={(values) => handleSave(values)}
          onCancel={onCancel}
        />
      </GenericFormModalContainer>
      <Backdrop />
    </>
  );
};
