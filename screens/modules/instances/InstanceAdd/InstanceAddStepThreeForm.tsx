import GenericFormModalContainer from "../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import FormStepper from "../../crm/shared/components/FormStepper";
import { Formik } from "formik";
import { subdomainSlugify } from "../subdomainSlugify";
import React from "react";
import CheckBox from "remixicon-react/CheckboxCircleFillIcon";
import { IInstance } from "../../../../models/Accounts";

const appSelectionArray = [
  {
    label: "CRM",
    value: "crm",
    src: "/crm.svg",
  },
  // {
  //   label: "Loan Management",
  //   value: "loanManagemnet",
  //   src: "/loan_management.svg",
  // },
  // {
  //   label: "Risk Management",
  //   value: "riskManagement",
  //   src: "/risk_management.svg",
  // },
];

export function InstanceAddStepThreeForm(props: {
  renderFullPage: boolean;
  onOutsideClick: (value: boolean) => void;
  steps: ({ label: string } | { label: string } | { label: string })[];
  activeStep: number;
  installableAppMapper: (
    app: { src: string; label: string; value: string },
    index: number
  ) => JSX.Element;
  internalInstance: Partial<IInstance>;
  formArray: Record<string, any>;
  validationSchema: any;
  onNextClick: (values: Record<string, any>) => void;
  element: ({ handleSubmit }: { handleSubmit: any }) => JSX.Element;
}) {
  return (
    <GenericFormModalContainer
      renderFullPage={props.renderFullPage}
      topIconType="MoreInfo"
      infoArray={[
        {
          label: "",
          value: "Choose apps that will be sharing the same name and domain.",
        },
      ]}
      formHeading="Select Apps"
      onOutsideClick={props.onOutsideClick}
      useModalFormInUrl={true}
    >
      <div className="w-full max-h-[60vh] overflow-y-auto pr-1.5 card-scroll mt-8 flex flex-col items-center">
        <FormStepper steps={props.steps} activeStep={props.activeStep} />
        <div className="grid grid-cols-2 w-full gap-x-4 gap-y-4 mb-4 mt-9">
          {appSelectionArray.map(props.installableAppMapper)}
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <Formik
            initialValues={{
              subdomain:
                props.internalInstance?.subdomain ||
                subdomainSlugify(props.formArray["name"]),
              description:
                props.internalInstance.description ||
                props.formArray["description"],
              isSample: props.formArray["isSample"],
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

export function AppToBeInstalled(props: {
  selectedApps: string[];
  app: { src: string; label: string; value: string };
  onClick: () => void;
}) {
  return (
    <div
      className={`flex flex-col border justify-center items-center rounded-xl shadow-lg p-2 cursor-pointer ${
        props.selectedApps.includes(props.app.value)
          ? "border-vryno-theme-blue"
          : ""
      }`}
      onClick={props.onClick}
    >
      <div className="w-full flex flex-row justify-end">
        <CheckBox
          className={`${
            props.selectedApps.includes(props.app.value)
              ? "text-vryno-theme-blue"
              : "text-vryno-icon-gray"
          }`}
        />
      </div>
      <img src={props.app.src} alt={props.app.label} />
      <span className="text-vryno-label-gray text-xs pt-2">
        {props.app.label}
      </span>
    </div>
  );
}
