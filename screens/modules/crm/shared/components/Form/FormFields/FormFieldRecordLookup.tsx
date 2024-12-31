import React from "react";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";
import { GeneralStoreContext } from "../../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import FormSearchBox from "../../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import {
  defaultOnSearchIconClick,
  fieldSpecificAppAndModel,
  retainDefaultValues,
  searchByHelper,
  searchByDisplayExpression,
} from "./recordLookupHelpers";

export const FormFieldRecordLookup = ({
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
  overflow,
  setValuesForFields,
  additionalFieldName,
  retainDefaultValue,
  paddingInPixelForInputBox,
  autoOpenSearchScreenContainer = false,
  setCurrentFormLayer = () => {},
  stopRecordLookupAutoReset = false,
  handleSetValuesForFields = () => {},
  disableGlobalSearchIcon = false,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => {
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels } = generalModelStore;
  const appAndModel = fieldSpecificAppAndModel(field);
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
      overflow={overflow}
      editMode={editMode}
      allowMargin={allowMargin}
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
      additionalFieldName={additionalFieldName}
      setValuesForFields={setValuesForFields}
      autoOpenSearchScreenContainer={autoOpenSearchScreenContainer}
      defaultOnSearchIconClick={defaultOnSearchIconClick(field)}
      retainDefaultValues={retainDefaultValue || retainDefaultValues(field)}
      setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
      stopRecordLookupAutoReset={stopRecordLookupAutoReset}
      paddingInPixelForInputBox={paddingInPixelForInputBox}
      handleSetValuesForFields={handleSetValuesForFields}
      disableGlobalSearchIcon={disableGlobalSearchIcon}
      dataTestId={dataTestId}
      hideValidationMessages={hideValidationMessages}
    />
  );
};
