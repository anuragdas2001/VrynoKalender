import { Formik, FormikValues } from "formik";
import React from "react";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";

export const AddPipelineModal = ({
  onOutsideClick,
  handleCreatePipeline,
  modalValues,
}: {
  onOutsideClick: () => void;
  handleCreatePipeline: (pipelineId: string, values: FormikValues) => void;
  modalValues: {
    visible: boolean;
    id: string;
    editMode: boolean;
    name: string;
  };
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const [savingProcess, setSavingProcess] = React.useState(false);

  const validationSchema = Yup.object().shape({
    pipelineName: Yup.string()
      .required(t("Pipeline name is mandatory"))
      .max(35, "Pipeline name must be at most 35 characters")
      .matches(/^\S+(?:\s+\S+)*$/g, t("common:no-space-trailing-error")),
  });

  return (
    <GenericFormModalContainer
      formHeading={"Add Pipeline"}
      onOutsideClick={onOutsideClick}
      onCancel={onOutsideClick}
    >
      <Formik
        initialValues={{
          pipelineName: modalValues.name,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setSavingProcess(true);
          if (modalValues.editMode) {
            handleCreatePipeline(modalValues.id, values);
          } else {
            handleCreatePipeline("", values);
          }
          setSavingProcess(false);
          onOutsideClick();
        }}
      >
        {({ handleSubmit }) => (
          <>
            <FormInputBox
              name="pipelineName"
              label="Pipeline Name"
              type="text"
              disabled={false}
              required={true}
            />
            <div className="grid grid-cols-2 w-full gap-x-36 mt-6.5">
              <Button
                id="cancel-form"
                disabled={savingProcess}
                onClick={onOutsideClick}
                kind="back"
                buttonType="thin"
                userEventName="pipeline-save:cancel-click"
              >
                {t("common:cancel")}
              </Button>
              <Button
                id="save-form"
                loading={savingProcess}
                disabled={savingProcess}
                onClick={() => {
                  handleSubmit();
                }}
                kind="primary"
                buttonType="thin"
                userEventName="pipeline-save:submit-click"
              >
                {t("common:save")}
              </Button>
            </div>
          </>
        )}
      </Formik>
    </GenericFormModalContainer>
  );
};
