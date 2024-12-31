import React from "react";
import { FormikValues, useFormikContext } from "formik";
import FormInputBox from "../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { subdomainSlugify } from "../subdomainSlugify";
import { Config } from "../../../../shared/constants";
import { MultipleEmailInputBox } from "../../../../components/TailwindControls/Form/MultipleEmailInputBox/MultipleEmailInputBox";
import FormTextAreaBox from "../../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import FormCheckBox from "../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import Button from "../../../../components/TailwindControls/Form/Button/Button";

export function InstanceAddStepTwoFormFields(props: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  label: string | undefined;
  onBlur: () => Promise<void>;
  disabled: boolean;
  placeholder: string | undefined;
  values: FormikValues;
  adminLabel: string;
  items: string[];
  handleAdd: (values: any) => void;
  adminsError: string;
  descriptionLabel: string | undefined;
  descriptionPlaceholder: string | undefined;
  sampleLabel: string | undefined;
  backButton: () => void;
  nextButton: (e?: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { errors } = useFormikContext();
  React.useEffect(() => {
    const nextButton = document.getElementById("next-button");
    if (nextButton) {
      nextButton.focus();
    }
  }, []);
  return (
    <>
      <div className="w-full mt-9">
        <FormInputBox
          name="subdomain"
          label={props.label}
          type="text"
          onBlur={props.onBlur}
          autoFocus={true}
          disabled={props.disabled}
          placeholder={props.placeholder}
          helpText={
            props.values["subdomain"] && (
              <label className="text-sm text-vryno-theme-blue">{`${subdomainSlugify(
                props.values["subdomain"]
              )}.${Config.appSubDomain}.${Config.appHostName}`}</label>
            )
          }
        />
        {!props.disabled && (
          <MultipleEmailInputBox
            name="instanceAdmins"
            label={props.adminLabel}
            items={props.items}
            handleAdd={props.handleAdd}
            handleDelete={props.handleAdd}
            disabled={false}
            adminsError={props.adminsError}
          />
        )}
        <FormTextAreaBox
          name="description"
          label={props.descriptionLabel}
          placeholder={props.descriptionPlaceholder}
          rows={2}
          maxCharLength={300}
        />
        <FormCheckBox name="isSample" label={props.sampleLabel} />
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4">
        <Button
          id="back-button"
          onClick={props.backButton}
          kind="back"
          userEventName="add-instance-step-two:cancel-click"
        >
          <span>Back</span>
        </Button>
        <Button
          id="next-button"
          onClick={() => {
            if (Object.keys(errors).length > 0) {
              return;
            }
            props.nextButton();
          }}
          type="submit"
          kind="primary"
          userEventName="add-instance-step-two:next-click"
        >
          <span>Next</span>
        </Button>
      </div>
    </>
  );
}
