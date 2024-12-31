import React from "react";
import GenericFormModalContainer from "../../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../../../../../components/TailwindControls/Backdrop";
import AddEditProductTaxForm from "./AddEditProductTaxForm";
import { FormikValues } from "formik";

export const ConnectedAddEditProductTaxForm = ({
  data,
  savingProcess,
  setAddEditProductTaxModal,
  handleSave,
}: {
  data: any | null;
  savingProcess: boolean;
  setAddEditProductTaxModal: (value: {
    visible: boolean;
    data: any | null;
  }) => void;
  handleSave: (values: FormikValues) => void;
}) => {
  return (
    <>
      <GenericFormModalContainer
        formHeading={data && Object.keys(data).length ? "Edit Tax" : "Add Tax"}
        limitWidth={true}
        onOutsideClick={() =>
          setAddEditProductTaxModal({ visible: false, data: null })
        }
        onCancel={() =>
          setAddEditProductTaxModal({ visible: false, data: null })
        }
      >
        <AddEditProductTaxForm
          data={data}
          handleSave={(values) => handleSave(values)}
          saveLoading={savingProcess}
          editMode={data && Object.keys(data).length ? true : false}
          onCancel={() =>
            setAddEditProductTaxModal({ visible: false, data: null })
          }
        />
      </GenericFormModalContainer>
      <Backdrop
        onClick={() =>
          setAddEditProductTaxModal({ visible: false, data: null })
        }
      />
    </>
  );
};
