import React from "react";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import * as Yup from "yup";
import { toast } from "react-toastify";

export interface IStageData {
  stageName: string;
  probability: number;
  dealCategory: string;
}

export const AddStageModal = ({
  onOutsideClick,
  handleCreateStage,
  savingProcess,
  editStageData,
}: {
  onOutsideClick: () => void;
  handleCreateStage: (values: FormikValues) => void;
  savingProcess: boolean;
  editStageData: {} | IStageData;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const validationSchema = Yup.object().shape({
    stageName: Yup.string()
      .required(t("Stage name is mandatory"))
      .max(35, "Stage name must be at most 35 characters")
      .matches(/^\S+(?:\s+\S+)*$/g, t("common:no-space-trailing-error")),
    probability: Yup.string().required(t("Probability is mandatory")).max(3),
    dealCategory: Yup.string().required(t("Deal Category is mandatory")),
  });

  return (
    <GenericFormModalContainer
      formHeading={"Add Stage"}
      onOutsideClick={onOutsideClick}
      onCancel={onOutsideClick}
    >
      <Formik
        initialValues={{
          stageName: "",
          probability: "",
          dealCategory: "",
          ...editStageData,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (isNaN(+values.probability)) {
            toast.error("Invalid probability value");
            return;
          }
          let refactoredValues = {
            ...values,
            probability: +values.probability,
          };
          if (refactoredValues.probability < 0) {
            toast.error("Probability value cannot be negative");
            return;
          } else if (refactoredValues.probability > 100) {
            toast.error("Probability value cannot be greater than 100");
            return;
          }
          handleCreateStage(values);
          onOutsideClick();
        }}
      >
        {({ handleSubmit }) => (
          <>
            <FormInputBox
              required={true}
              name="stageName"
              label="Stage Name"
              type="text"
              disabled={false}
            />
            <FormInputBox
              required={true}
              name="probability"
              label="Probability"
              type="string"
              disabled={false}
            />
            <FormDropdown
              required={true}
              name="dealCategory"
              label="Deal Category"
              options={[
                { value: "open", label: "Open" },
                { value: "closed won", label: "Closed Won" },
                { value: "closed lost", label: "Closed Lost" },
              ]}
              placeholder="Select Category"
            />
            <div className="grid grid-cols-2 w-full gap-x-36 mt-6.5 ">
              <Button
                id="cancel-form"
                disabled={savingProcess}
                onClick={onOutsideClick}
                kind="back"
                buttonType="thin"
                userEventName="stage-save:cancel-click"
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
                userEventName="stage-save:submit-click"
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
