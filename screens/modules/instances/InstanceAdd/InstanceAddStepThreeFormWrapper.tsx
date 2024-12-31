import {
  AppToBeInstalled,
  InstanceAddStepThreeForm,
} from "./InstanceAddStepThreeForm";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import React from "react";
import { IInstance } from "../../../../models/Accounts";

export function InstanceAddStepThreeFormWrapper({
  renderFullPage,
  onOutsideClick,
  FormStepperArray,
  steps,
  selectedApp,
  handleAppSelection,
  internalInstance,
  formArray,
  detailsValidationSchema,
  handleSubmit,
  setSteps,
  loading,
}: {
  renderFullPage: boolean;
  onOutsideClick: (value: boolean) => void;
  FormStepperArray: { label: string }[];
  steps: number;
  selectedApp: string[];
  handleAppSelection: (app: string) => void;
  internalInstance: Partial<IInstance>;
  formArray: Record<string, any>;
  detailsValidationSchema: any;
  handleSubmit: (input: Partial<IInstance>) => void;
  setSteps: (value: ((prevState: number) => number) | number) => void;
  loading: boolean;
}) {
  return (
    <InstanceAddStepThreeForm
      renderFullPage={renderFullPage}
      onOutsideClick={onOutsideClick}
      steps={FormStepperArray}
      activeStep={steps}
      installableAppMapper={(app, index) => (
        <AppToBeInstalled
          key={index}
          selectedApps={selectedApp}
          app={app}
          onClick={() => {
            app.value !== "crm" && handleAppSelection(app.value);
          }}
        />
      )}
      internalInstance={internalInstance}
      formArray={formArray}
      validationSchema={detailsValidationSchema}
      onNextClick={(values) => {
        handleSubmit(formArray);
      }}
      element={({ handleSubmit }) => (
        <div className="grid grid-cols-2 w-full gap-x-4">
          <Button
            id="back-button"
            onClick={() => setSteps(steps - 1)}
            kind="back"
            userEventName="add-instance-step-three:cancel-click"
          >
            <span>Back</span>
          </Button>
          <Button
            id="submit-button"
            onClick={handleSubmit}
            type={"submit"}
            kind="primary"
            loading={loading}
            autoFocus={true}
            userEventName="add-instance-step-three:submit-click"
          >
            <span>Submit</span>
          </Button>
        </div>
      )}
    />
  );
}
