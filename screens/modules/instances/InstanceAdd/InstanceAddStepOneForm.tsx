import GenericFormModalContainer from "../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import FormStepper from "../../crm/shared/components/FormStepper";
import { Formik } from "formik";
import React from "react";
import { IInstance } from "../../../../models/Accounts";
import { TFunction } from "next-i18next";

export function InstanceAddStepOneForm(props: {
  renderFullPage: boolean;
  formHeading: string | undefined;
  onOutsideClick: (value: boolean) => void;
  steps: ({ label: string } | { label: string } | { label: string })[];
  activeStep: number;
  s: TFunction | string;
  internalInstance: Partial<IInstance>;
  formArray: Record<string, any>;
  validationSchema: any;
  onNextClick: (values: Record<string, any>) => void;
  element: ({
    handleSubmit,
    handleChange,
  }: {
    handleSubmit: any;
    handleChange: any;
  }) => JSX.Element;
}) {
  return (
    <GenericFormModalContainer
      renderFullPage={props.renderFullPage}
      topIconType="MoreInfo"
      formHeading={props.formHeading}
      infoArray={[
        {
          label: "Instance",
          value:
            "An instance is like a database or a group of applications required for running your business. Enter a name that suits your business",
        },
      ]}
      onOutsideClick={props.onOutsideClick}
      useModalFormInUrl={true}
    >
      <div className="w-full max-h-[60vh] overflow-y-auto pr-1.5 card-scroll mt-8 flex flex-col items-center">
        <FormStepper steps={props.steps} activeStep={props.activeStep} />
        <img
          src="/computer_screen.svg"
          alt="Computer Screen"
          className="w-44 mt-9"
        />
        <div className="w-44 mt-6.5 mb-4 text-center ">
          <span className="text-vryno-message text-sm">
            <>{props.s}</>
          </span>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <Formik
            initialValues={{
              name: props.internalInstance.name || props.formArray["name"],
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
