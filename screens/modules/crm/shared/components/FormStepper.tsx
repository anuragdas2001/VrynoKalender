import "rc-steps/assets/index.css";
import Steps, { Step } from "rc-steps";

export type FormStepperProps = {
  steps: { label: string }[];
  activeStep: number;
};

export function FormStepper({ steps, activeStep }: FormStepperProps) {
  return (
    <Steps current={activeStep}>
      {steps.map((step, index) => (
        <Step title={step.label} key={index} />
      ))}
    </Steps>
  );
}

export default FormStepper;
