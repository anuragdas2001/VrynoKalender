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
  IQuotedItemMappingLabels,
  QuotedItemConversionDataType,
} from "./QuotedItemConversionMappingScreen";

export const QuotedItemConversionDropdown = ({
  quoteMappingExcludedFieldNames,
  item,
  orderedItemList,
  invoicedItemList,
  quotedItemConversionData,
  dataType,
  dropdownChangeHandler,
  labelData,
  marginBottom,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  item: IConversionDropdownListType;
  orderedItemList: IConversionDropdownListType[];
  invoicedItemList: IConversionDropdownListType[];
  quotedItemConversionData: QuotedItemConversionDataType;
  dataType: SupportedDataTypes;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IQuotedItemMappingLabels;
  marginBottom: string;
}) => {
  const { values, setFieldValue, setValues } = useFormikContext<FormikValues>();
  const [salesOrderDropdown, setSalesOrderDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);
  const [invoiceDropdown, setInvoiceDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);

  React.useEffect(() => {
    if (!quoteMappingExcludedFieldNames.has(item.value)) {
      if (orderedItemList.length)
        setSalesOrderDropdown(
          orderedItemList.filter((val) =>
            conversionDropdownFilterHelper(val, dataType, item)
          )
        );
      if (invoicedItemList.length)
        setInvoiceDropdown(
          invoicedItemList.filter((val) =>
            conversionDropdownFilterHelper(val, dataType, item)
          )
        );
    }
  }, [quoteMappingExcludedFieldNames, orderedItemList, invoicedItemList]);

  React.useEffect(() => {
    // if (!salesOrderDropdown.length || !invoiceDropdown.length) return;
    if (Object?.keys(quotedItemConversionData || {})?.length === 0) return;

    setFieldValue(
      `${item.value}-orderedItem`,
      quotedItemConversionData[item.value]?.orderedItem?.value || null
    );
    setFieldValue(
      `${item.value}-invoicedItem`,
      quotedItemConversionData[item.value]?.invoicedItem?.value || null
    );
  }, [quotedItemConversionData]);

  return (
    <GenericHeaderCardContainerTransparentBackground
      cardHeading={item.label}
      extended={false}
      key={item.value}
      paddingY="py-3"
      marginBottom={marginBottom}
    >
      <div className="flex justify-between gap-6 px-4">
        <div className="w-1/2">
          <FormDropdown
            name={`${item.value}-orderedItem`}
            label={labelData.orderedItem}
            placeholder="None"
            options={[
              {
                dataType: dataType,
                label: "None",
                value: "none",
              },
              ...salesOrderDropdown,
            ]}
            onChange={(selectedOption) => {
              setFieldValue(
                `${item.value}-orderedItem`,
                selectedOption.currentTarget.value
              );
              dropdownChangeHandler(selectedOption.currentTarget.name, values);
            }}
            allowMargin={false}
            dataTestId={`${item.label}-orderedItem`}
          />
        </div>
        <div className="w-1/2">
          <FormDropdown
            name={`${item.value}-invoicedItem`}
            label={labelData.invoicedItem}
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
                `${item.value}-invoicedItem`,
                selectedOption.currentTarget.value
              );
              dropdownChangeHandler(selectedOption.currentTarget.name, values);
            }}
            allowMargin={false}
            dataTestId={`${item.label}-invoicedItem`}
          />
        </div>
      </div>
    </GenericHeaderCardContainerTransparentBackground>
  );
};
