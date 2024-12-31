import { InstanceAddStepTwoForm } from "./InstanceAddStepTwoForm";
import { InstanceAddStepTwoFormFields } from "./InstanceAddStepTwoFormFields";
import React from "react";
import { IInstance } from "../../../../models/Accounts";
import { TFunction } from "next-i18next";

export function InstanceAddStepTwoFormWrapper({
  renderFullPage,
  onOutsideClick,
  FormStepperArray,
  steps,
  internalInstance,
  formArray,
  detailsValidationSchema,
  instanceAdmins,
  setAdminsError,
  setFormArray,
  setSteps,
  t,
  handleDomainCheck,
  editMode,
  setAdmin,
  adminsError,
}: {
  renderFullPage: boolean;
  onOutsideClick: (value: boolean) => void;
  FormStepperArray: { label: string }[];
  steps: number;
  internalInstance: Partial<IInstance>;
  formArray: Record<string, any>;
  detailsValidationSchema: any;
  instanceAdmins: string[];
  setAdminsError: (value: ((prevState: string) => string) | string) => void;
  setFormArray: (
    value:
      | ((prevState: Record<string, any>) => Record<string, any>)
      | Record<string, any>
  ) => void;
  setSteps: (value: ((prevState: number) => number) | number) => void;
  t: TFunction;
  handleDomainCheck: (values: string) => Promise<void>;
  editMode: boolean;
  setAdmin: (value: ((prevState: string[]) => string[]) | string[]) => void;
  adminsError: string;
}) {
  return (
    <InstanceAddStepTwoForm
      renderFullPage={renderFullPage}
      onOutsideClick={onOutsideClick}
      steps={FormStepperArray}
      activeStep={steps}
      internalInstance={internalInstance}
      formArray={formArray}
      validationSchema={detailsValidationSchema}
      onNextClick={(values) => {
        if (!instanceAdmins || instanceAdmins.length === 0) {
          setAdminsError("Please enter at least one valid email.");
          return;
        }
        setFormArray({
          ...formArray,
          ...values,
          ...{ instanceAdmins: instanceAdmins },
        });
        setSteps(steps + 1);
      }}
      element={({ handleSubmit, setFieldTouched, values, handleChange }) => (
        <InstanceAddStepTwoFormFields
          onSubmit={(e) => e.preventDefault()}
          label={t("sub-domain-label")}
          onBlur={async () => {
            setFieldTouched("subdomain");
            await handleDomainCheck(values["subdomain"]);
          }}
          disabled={editMode}
          placeholder={t("sub-domain-placeholder")}
          values={values}
          adminLabel={t("admin-label")}
          items={instanceAdmins}
          handleAdd={(values) => setAdmin(values)}
          adminsError={adminsError}
          descriptionLabel={t("description-label")}
          descriptionPlaceholder={t("description-placeholder")}
          sampleLabel={t("isSample-label")}
          backButton={() => {
            setSteps(steps - 1);
            setFormArray({
              ...formArray,
              ...values,
              ...{ instanceAdmins: instanceAdmins },
            });
          }}
          nextButton={handleSubmit}
        />
      )}
    />
  );
}
