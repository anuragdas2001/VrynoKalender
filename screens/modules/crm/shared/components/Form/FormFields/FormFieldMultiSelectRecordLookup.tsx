import FormSearchBox from "../../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import {
  defaultOnSearchIconClick,
  fieldSpecificAppAndModel,
  retainDefaultValues,
  searchByHelper,
  searchByDisplayExpression,
} from "./recordLookupHelpers";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";
import React from "react";
import { GeneralStoreContext } from "../../../../../../../stores/RootStore/GeneralStore/GeneralStore";

export const FormFieldMultiSelectRecordLookup = ({
  field,
  editMode,
  index,
  fieldName,
  showLabel = true,
  allowMargin = true,
  formResetted,
  disabled = undefined,
  labelValue = "",
  required = false,
  formDetails,
  rejectRequired = false,
  addClear = false,
  fieldCustomization,
  retainDefaultValue,
  autoOpenSearchScreenContainer = false,
  overflow,
  paddingInPixelForInputBox,
  setCurrentFormLayer = () => {},
  disableGlobalSearchIcon = false,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => {
  const appAndModel = fieldSpecificAppAndModel(field);
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels } = generalModelStore;
  const label = showLabel ? (labelValue ? labelValue : field.label["en"]) : "";

  return (
    <FormSearchBox
      name={fieldName ? fieldName : field.name}
      rejectRequired={rejectRequired}
      addClear={addClear}
      fieldIndex={index}
      required={required ? true : field.mandatory}
      label={label}
      appName={appAndModel[0]}
      modelName={appAndModel[1]}
      parentModelName={formDetails?.modelName}
      editMode={editMode}
      multiple={true}
      overflow={overflow}
      allowMargin={allowMargin}
      autoOpenSearchScreenContainer={autoOpenSearchScreenContainer}
      paddingInPixelForInputBox={paddingInPixelForInputBox}
      disabled={
        fieldCustomization
          ? true
          : disabled !== undefined
          ? disabled
          : field.readOnly
      }
      externalExpressionToCalculateValue={field.expression}
      formResetted={formResetted}
      searchBy={searchByHelper(field, genericModels)}
      fieldDisplayExpression={searchByDisplayExpression(field)}
      field={field}
      defaultOnSearchIconClick={defaultOnSearchIconClick(field)}
      retainDefaultValues={retainDefaultValue || retainDefaultValues(field)}
      setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
      placeholder="Please enter here to search..."
      disableGlobalSearchIcon={disableGlobalSearchIcon}
      dataTestId={dataTestId}
      hideValidationMessages={hideValidationMessages}
    />
  );
};
