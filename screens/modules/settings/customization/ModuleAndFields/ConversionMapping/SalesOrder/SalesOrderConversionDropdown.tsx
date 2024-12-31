import React from "react";
import { FormikValues, useFormikContext } from "formik";
import { conversionDropdownFilterHelper } from "../conversionMappingHelper";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import GenericHeaderCardContainerTransparentBackground from "../../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainerTransparentDropdown";
import {
  IConversionDropdownListType,
  IMappingDropdownType,
} from "../conversionTypes";
import {
  ISalesOrderMappingLabels,
  SalesOrderConversionDataType,
} from "./SalesOrderConversionMappingScreen";

export const SalesOrderConversionDropdown = ({
  quoteMappingExcludedFieldNames,
  item,
  invoiceList,
  salesOrderConversionData,
  dataType,
  dropdownChangeHandler,
  labelData,
  marginBottom,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  item: IConversionDropdownListType;
  invoiceList: IConversionDropdownListType[];
  salesOrderConversionData: SalesOrderConversionDataType;
  dataType: SupportedDataTypes;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: ISalesOrderMappingLabels;
  marginBottom: string;
}) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [invoiceDropdown, setInvoiceDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);

  React.useEffect(() => {
    if (!quoteMappingExcludedFieldNames.has(item.value) && invoiceList.length) {
      setInvoiceDropdown(
        invoiceList.filter((val) =>
          conversionDropdownFilterHelper(val, dataType, item)
        )
      );
    }
  }, [quoteMappingExcludedFieldNames, invoiceList]);

  React.useEffect(() => {
    // if (!salesOrderDropdown.length || !invoiceDropdown.length) return;
    if (Object?.keys(salesOrderConversionData || {})?.length === 0) return;

    setFieldValue(
      `${item.value}-invoice`,
      salesOrderConversionData[item.value]?.invoice?.value || null
    );
  }, [salesOrderConversionData]);
  // }, [salesOrderConversionData, salesOrderDropdown, invoiceDropdown]);

  return (
    <GenericHeaderCardContainerTransparentBackground
      cardHeading={item.label}
      extended={false}
      key={item.value}
      paddingY="py-3"
      marginBottom={marginBottom}
    >
      <div className="flex justify-between gap-6 px-4">
        <div className="w-full">
          <FormDropdown
            name={`${item.value}-invoice`}
            label={labelData.invoice}
            placeholder="None"
            options={[
              {
                dataType: dataType,
                label: "None",
                value: "none",
              },
              ...invoiceDropdown,
            ]}
            onChange={(selectedOption) => {
              setFieldValue(
                `${item.value}-invoice`,
                selectedOption.currentTarget.value
              );
              dropdownChangeHandler(selectedOption.currentTarget.name, values);
            }}
            allowMargin={false}
            dataTestId={`${item.label}-invoice`}
          />
        </div>
      </div>
    </GenericHeaderCardContainerTransparentBackground>
  );
};
