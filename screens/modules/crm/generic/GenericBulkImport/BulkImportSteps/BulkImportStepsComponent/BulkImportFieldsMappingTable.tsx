import GenericList, {
  GenericListHeaderType,
} from "../../../../../../../components/TailwindControls/Lists/GenericList";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../../models/ICustomField";
import ErrorWarningFillIcon from "remixicon-react/ErrorWarningFillIcon";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import { useFormikContext } from "formik";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import React from "react";
import { setHeight } from "../../../../shared/utils/setHeight";
import { FormFieldPerDataType } from "../../../../shared/components/Form/FormFieldPerDataType";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { IBulkImportData } from "../../bulkImportImportMappingHelpers";
import FormCheckBox from "../../../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import { getCountryCodeFromPreference } from "../../../../shared/components/Form/FormFields/FormFieldPhoneNumber";
import { IUserPreference } from "../../../../../../../models/shared";

export const BulkImportFieldsMappingTable = ({
  fieldMappingData,
  fieldsList,
  modelName,
  updateFieldsWithImportData,
  userPreferences,
  setPreservedFormikValues,
  ui,
}: {
  fieldMappingData: IBulkImportData[] | null;
  fieldsList: ICustomField[];
  modelName: string;
  userPreferences: IUserPreference[];
  updateFieldsWithImportData: (record: IBulkImportData) => void;
  setPreservedFormikValues: (name: string, value: string | null) => void;
  ui: string;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  });
  const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
    React.useState<string>(
      userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
    );

  React.useEffect(() => {
    setCountryCodeInUserPreference(
      getCountryCodeFromPreference(userPreferences)
    );
  }, [userPreferences]);

  const tableHeaders: GenericListHeaderType[] = [
    {
      label: "",
      columnName: "",
      dataType: SupportedDataTypes.boolean,
      render: (item: IBulkImportData, index: number) => {
        const isSelected = !fieldMappingData
          ? false
          : values[`fieldInCrm:${index}`]
          ? true
          : false;
        return (
          <div id="field-check-indicator" className="flex items-center">
            {isSelected ? (
              <CheckboxCircleFillIcon className="text-green-600" />
            ) : (
              <ErrorWarningFillIcon className="text-vryno-danger" />
            )}
          </div>
        );
      },
    },
    {
      label: "Fields in File",
      columnName: "fieldInFile",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Fields in CRM",
      columnName: "fieldInCrm",
      dataType: SupportedDataTypes.singleline,
      render: (record: IBulkImportData, index: number) => {
        return (
          <div className="w-full py-2">
            <div className="w-full max-w-[200px]">
              <FormDropdown
                name={`fieldInCrm:${index}`}
                allowMargin={false}
                options={[
                  { value: "---", label: "---" },
                  ...fieldsList.map((field) => {
                    return {
                      value: field.uniqueName,
                      label: field.label.en,
                    };
                  }),
                ]}
                onChange={(selectedOption) => {
                  const value =
                    selectedOption.currentTarget.value === "---"
                      ? null
                      : selectedOption.currentTarget.value;
                  setFieldValue(`fieldInCrm:${index}`, value);
                  setFieldValue(`replaceValue:${index}`, null);
                  setPreservedFormikValues(`fieldInCrm:${index}`, value);
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      label: "Replace Empty Value",
      columnName: "replaceValue",
      dataType: SupportedDataTypes.singleline,
      render: (record: IBulkImportData, index: number) => {
        const fieldInitialValue = fieldsList.filter(
          (field) => field.uniqueName === values[`fieldInCrm:${index}`]
        );
        return fieldInitialValue?.length ? (
          <FormFieldPerDataType
            fieldName={`replaceValue:${index}`}
            fieldLabel={fieldInitialValue[0]?.label?.en}
            id={`replaceValue:${index}`}
            field={fieldInitialValue[0]}
            isSample={false}
            setFieldValue={setFieldValue}
            modelName={modelName}
            values={values}
            showLabel={false}
            allowMargin={false}
            disabled={false}
            stopRecordLookupAutoReset={true}
            editMode={ui === "biedit" ? true : false}
            countryCodeInUserPreference={countryCodeInUserPreference}
          />
        ) : (
          <FormInputBox name={`replaceValue:${index}`} allowMargin={false} />
        );
      },
    },
    {
      label: "Options",
      columnName: "merge",
      dataType: SupportedDataTypes.boolean,
      render: (record: IBulkImportData, index: number) => {
        const fieldInitialValue = fieldsList.filter(
          (field) =>
            ["multiSelectLookup", "multiSelectRecordLookup"].includes(
              field.dataType
            ) && field.uniqueName === values[`fieldInCrm:${index}`]
        );

        return fieldInitialValue?.length ? (
          <FormCheckBox
            label="Merge"
            name={`merge:${index}`}
            value={Boolean(values[`merge:${index}`])}
            onChange={(e) => setFieldValue(`merge:${index}`, e.target.checked)}
            checkboxGap={2}
            labelSize="text-xsm"
            infoDetail={{
              label: "Merge",
              value: "Merge file and crm values into one set",
            }}
          />
        ) : (
          <></>
        );
      },
    },
    {
      label: "Data Row 1",
      columnName: "rowDataOne",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Data Row 2",
      columnName: "rowDataTwo",
      dataType: SupportedDataTypes.singleline,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 pt-2 pb-6">
      <div className="w-full py-4 px-4 bg-white rounded-xl">
        <div ref={heightRef} className="w-full overflow-y-auto">
          <GenericList
            data={fieldMappingData || []}
            tableHeaders={tableHeaders}
            fieldsList={fieldsList}
            listSelector={false}
            truncate={true}
            oldGenericListUI={true}
          />
        </div>
      </div>
    </div>
  );
};
