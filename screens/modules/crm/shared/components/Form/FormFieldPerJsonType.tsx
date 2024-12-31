import { FormTaskRepeat } from "../../../../../../components/TailwindControls/Form/JSONType/TaskRepeat/FormTaskRepeat";

export const FormFieldPerJsonType = ({
  name,
  label,
  jsonType,
  allowMargin = true,
  editMode = false,
  externalExpressionToCalculateValue,
  fieldCustomization,
}: {
  name: string;
  label: string;
  jsonType: any;
  allowMargin?: boolean;
  editMode?: boolean;
  externalExpressionToCalculateValue?: string;
  fieldCustomization?: boolean;
}) => {
  const jsonTypeComponent: Partial<Record<any, JSX.Element | null>> = {
    taskRepeat: (
      <FormTaskRepeat
        allowMargin={allowMargin}
        editMode={editMode}
        fieldCustomization={fieldCustomization}
      />
    ),
  };

  return (
    jsonTypeComponent[jsonType] || (
      <div>Unsupported Datatype {name} of JSON</div>
    )
  );
};
