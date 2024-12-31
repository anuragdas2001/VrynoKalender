import React from "react";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import * as Yup from "yup";
import { Formik, FormikValues } from "formik";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "react-i18next";

export type AddNewCustomViewModalProps = {
  formHeading: string;
  savingProcess: boolean;
  handleSave: (values: FormikValues) => void;
  onCancel: () => void;
};

export const AddNewCustomViewModal = ({
  formHeading,
  savingProcess,
  handleSave,
  onCancel,
}: AddNewCustomViewModalProps) => {
  const { t } = useTranslation(["commmon"]);
  return (
    <>
      <GenericFormModalContainer
        formHeading={formHeading}
        onCancel={() => onCancel()}
        onOutsideClick={() => onCancel()}
        limitWidth={true}
      >
        <Formik
          initialValues={{ name: "" }}
          onSubmit={(values) => handleSave(values)}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Name is required"),
          })}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <>
              <FormInputBox
                name={"name"}
                label={"Custom View Name"}
                required={true}
              />
              <div className="grid grid-cols-2 my-4 gap-x-4">
                <Button
                  id="cancel-form"
                  onClick={() => onCancel()}
                  kind="back"
                  disabled={savingProcess}
                  userEventName="custom-view-field-save:cancel-click"
                >
                  {t("common:cancel")}
                </Button>

                <Button
                  id="save-form"
                  onClick={() => handleSubmit()}
                  loading={savingProcess}
                  kind="primary"
                  disabled={savingProcess}
                  userEventName="custom-view-field-save:submit-click"
                >
                  {t("common:save")}
                </Button>
              </div>
            </>
          )}
        </Formik>
      </GenericFormModalContainer>
      <Backdrop />
    </>
  );
};
