import { InstanceAddStepOneForm } from "./InstanceAddStepOneForm";
import { subdomainSlugify } from "../subdomainSlugify";
import { InstanceAddStepOneFormFields } from "./InstanceAddStepOneFormFields";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { IInstance } from "../../../../models/Accounts";
import { TFunction } from "next-i18next";

export function InstanceAddStepOneFormWrapper({
  renderFullPage,
  t,
  onOutsideClick,
  FormStepperArray,
  steps,
  internalInstance,
  formArray,
  setFormArray,
  setSteps,
  instancesExist,
  handleButtonClose,
}: {
  renderFullPage: boolean;
  t: TFunction;
  onOutsideClick: (value: boolean) => void;
  FormStepperArray: { label: string }[];
  steps: number;
  internalInstance: Partial<IInstance>;
  formArray: Record<string, any>;
  setFormArray: (
    value:
      | ((prevState: Record<string, any>) => Record<string, any>)
      | Record<string, any>
  ) => void;
  setSteps: (value: ((prevState: number) => number) | number) => void;
  instancesExist: boolean;
  handleButtonClose: () => void;
}) {
  const router = useRouter();
  const nameValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("name-error"))
      .max(50)
      .matches(
        /^([A-Za-z0-9_@./#&$+-\\\/_\-]|([A-Za-z0-9_@./#&$+-\\\/_\-][A-Za-z0-9_@./#&$+-\\\/_\- ]{0,50}[A-Za-z0-9_@./#&$+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
  });
  return (
    <InstanceAddStepOneForm
      renderFullPage={renderFullPage}
      formHeading={t("create-instance")}
      onOutsideClick={onOutsideClick}
      steps={FormStepperArray}
      activeStep={steps}
      s={t("create-instance-message")}
      internalInstance={internalInstance}
      formArray={formArray}
      validationSchema={nameValidationSchema}
      onNextClick={(values) => {
        setFormArray({
          ...formArray,
          ...values,
          ...{
            subdomain:
              formArray["subdomain"] || subdomainSlugify(values["name"]),
          },
        });
        setSteps(steps + 1);
      }}
      element={({ handleSubmit }) => (
        <InstanceAddStepOneFormFields
          instancesExist={instancesExist}
          onCancel={
            router?.pathname.includes("add")
              ? () => router.push("/instances")
              : () => handleButtonClose()
          }
          onNextClick={handleSubmit}
        />
      )}
    />
  );
}
