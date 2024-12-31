import React from "react";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../components/TailwindControls/Form/InputBox/FormInputBox";

export function InstanceAddStepOneFormFields(props: {
  instancesExist: boolean;
  onCancel: () => void;
  onNextClick: any;
}) {
  React.useEffect(() => {
    const nextButton = document.getElementById("create-instance");
    if (nextButton) {
      nextButton.focus();
    }
  }, []);
  return (
    <>
      <FormInputBox
        name="name"
        type="text"
        required={true}
        placeholder="Enter Instance name"
        autoFocus={true}
        autoComplete="off"
      />
      <div
        className={`grid mt-4 ${
          props.instancesExist ? "grid-cols-2" : ""
        } w-full gap-x-4`}
      >
        {props.instancesExist && (
          <Button
            id="cancel-instance"
            onClick={props.onCancel}
            kind="back"
            userEventName="add-instance-step-one:cancel-click"
          >
            <span>Cancel</span>
          </Button>
        )}
        <Button
          id="create-instance"
          onClick={props.onNextClick}
          type={"submit"}
          kind="primary"
          userEventName="add-instance-step-one:next-click"
        >
          <span>Create Instance</span>
        </Button>
      </div>
    </>
  );
}
