import { lookupMapper } from "../../../utils/staticLookupMapper";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";
import { Option } from "../../../../../../../components/TailwindControls/Form/MultipleValuesLookupBox/MultipleValuesLookupBoxProps";
import { ICustomField } from "../../../../../../../models/ICustomField";

export const lookupFieldsOptionsResolver = (
  field: ICustomField,
  fieldName?: string
) => {
  return fieldName === "dealStageId" || field.name === "deal-dealStageId"
    ? field.dataTypeMetadata?.lookupOptions
        ?.slice()
        ?.sort((optionOne: Partial<Option>, optionTwo: Partial<Option>) =>
          (optionOne?.order ?? NaN) > (optionTwo?.order ?? NaN) ? 1 : -1
        )
        .map(
          (lookupOption: {
            id: string;
            label: { en: string };
            recordStatus: string;
          }) => {
            return {
              value: lookupOption.id,
              label: lookupOption.label.en,
              visible: lookupOption.recordStatus === "a",
            };
          }
        )
    : lookupMapper(field.dataTypeMetadata?.lookupOptions);
};

export const FormFieldLookup = ({
  field,
  setFieldValue,
  fieldName,
  editMode,
  showLabel = true,
  allowMargin = true,
  disabled = undefined,
  labelValue = "",
  required = false,
  rejectRequired = false,
  addClear = false,
  lookupDependencyFields,
  handleDependencyLookupFiltering,
  fieldCustomization,
  paddingInPixelForInputBox,
  setDefaultCurrency,
  dataTestId,
  hideValidationMessages,
  disableAutoSelectOfSystemDefinedValues,
}: FormFieldPerDataTypeProps) => {
  return (
    <FormDropdown
      rejectRequired={rejectRequired}
      required={required ? true : field.mandatory}
      addClear={addClear}
      editMode={editMode}
      name={fieldName ? fieldName : field.name}
      label={labelValue ? labelValue : field.label["en"]}
      showLabel={showLabel}
      options={lookupFieldsOptionsResolver(field, fieldName)}
      allowColourInValue={field.dataTypeMetadata?.allowColour}
      onChange={(selectedOption: any) => {
        setFieldValue(
          fieldName ? fieldName : field.name,
          selectedOption.currentTarget.value
        );
      }}
      allowMargin={allowMargin}
      disabled={
        fieldCustomization
          ? true
          : disabled !== undefined
          ? disabled
          : field.readOnly
      }
      paddingInPixelForInputBox={paddingInPixelForInputBox}
      externalExpressionToCalculateValue={field.expression}
      lookupDependencyFields={lookupDependencyFields}
      handleDependencyLookupFiltering={handleDependencyLookupFiltering}
      setDefaultCurrency={setDefaultCurrency}
      dataTestId={dataTestId}
      hideValidationMessages={hideValidationMessages}
      disableAutoSelectOfSystemDefinedValues={
        disableAutoSelectOfSystemDefinedValues
      }
    />
  );
};
