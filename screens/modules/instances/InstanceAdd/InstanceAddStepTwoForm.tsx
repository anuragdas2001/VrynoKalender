import GenericFormModalContainer from "../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import FormStepper from "../../crm/shared/components/FormStepper";
import { Formik } from "formik";
import React from "react";
import { IInstance } from "../../../../models/Accounts";

export function InstanceAddStepTwoForm(props: {
  renderFullPage: boolean;
  onOutsideClick: (value: boolean) => void;
  steps: ({ label: string } | { label: string } | { label: string })[];
  activeStep: number;
  internalInstance: Partial<IInstance>;
  formArray: Record<string, any>;
  validationSchema: any;
  onNextClick: (values: Record<string, any>) => void;
  element: ({
    handleSubmit,
    setFieldTouched,
    values,
    handleChange,
  }: {
    handleSubmit: any;
    setFieldTouched: any;
    values: any;
    handleChange: any;
  }) => JSX.Element;
}) {
  return (
    <GenericFormModalContainer
      renderFullPage={props.renderFullPage}
      topIconType="MoreInfo"
      infoArray={[
        {
          label: "Sub Domain",
          value: "Personal access URL exclusive to every instance",
        },
        {
          label: "Admins",
          value: "Personals that can access your sub domain",
        },
        {
          label: "Description",
          value: "Leave personal comments describing your instance",
        },
      ]}
      formHeading="Instance Details"
      onOutsideClick={props.onOutsideClick}
      useModalFormInUrl={true}
    >
      <div className="w-full max-h-[60vh] overflow-y-auto pr-1.5 card-scroll mt-8 flex flex-col items-center">
        <FormStepper steps={props.steps} activeStep={props.activeStep} />
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <Formik
            initialValues={{
              subdomain:
                props.internalInstance?.subdomain ||
                props.formArray["subdomain"],
              description:
                props.internalInstance.description ||
                props.formArray["description"],
              isSample: props.formArray["isSample"]
                ? props.formArray["isSample"]
                : true,
            }}
            validationSchema={props.validationSchema}
            onSubmit={props.onNextClick}
          >
            {props.element}
          </Formik>
        </form>
      </div>
    </GenericFormModalContainer>
  );
}
