import React from "react";
import { AllFormFields } from "./FormFields/AllFromFields";
import { FormFieldPerDataTypeProps } from "./FormFieldPerDataTypeProps";
import { observer } from "mobx-react-lite";

export const FormFieldPerDataType = observer(
  (props: FormFieldPerDataTypeProps) => {
    const field = props.field;
    const fieldName = props.fieldName;
    const componentToRender =
      AllFormFields[field?.dataType] ||
      (() => (
        <div>
          Unsupported Datatype {fieldName ? fieldName : field?.name} of
          {field?.dataType}
        </div>
      ));
    return componentToRender(props);
  }
);
